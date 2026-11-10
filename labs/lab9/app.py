import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError

from ai_service import (
    ModelRefusalError,
    ProviderUnavailableError,
    extract_project_details,
)


app = Flask(__name__)
base_dir = Path(__file__).resolve().parent
instance_dir = base_dir / "instance"
instance_dir.mkdir(parents=True, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{(instance_dir / 'portfolio.db').as_posix()}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Author(db.Model):
    __tablename__ = "authors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    projects = db.relationship("Project", backref="author", lazy=True)


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=False, default="")
    likes = db.Column(db.Integer, nullable=False, default=0)
    summary = db.Column(db.Text, nullable=False, default="")
    technologies = db.Column(db.Text, nullable=False, default="")
    author_id = db.Column(
        db.Integer,
        db.ForeignKey("authors.id"),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "likes": self.likes,
            "summary": self.summary,
            "technologies": self.technologies,
            "author_id": self.author_id,
            "author_name": self.author.name if self.author else None,
        }


def ensure_default_author():
    author = Author.query.filter_by(name="Stefania Gomez").first()
    if author is not None:
        return author

    author = Author(name="Stefania Gomez")
    db.session.add(author)
    db.session.commit()
    return author


def ensure_schema():
    db.create_all()

    project_table = inspect(db.engine).get_table_names()
    if "projects" in project_table:
        columns = [column["name"] for column in inspect(db.engine).get_columns("projects")]
        if "author_id" not in columns:
            db.session.execute(text("ALTER TABLE projects ADD COLUMN author_id INTEGER"))
            author = ensure_default_author()
            db.session.execute(
                text("UPDATE projects SET author_id = :author_id WHERE author_id IS NULL"),
                {"author_id": author.id},
            )
            db.session.commit()
        if "summary" not in columns:
            db.session.execute(
                text("ALTER TABLE projects ADD COLUMN summary TEXT NOT NULL DEFAULT ''")
            )
        if "technologies" not in columns:
            db.session.execute(
                text("ALTER TABLE projects ADD COLUMN technologies TEXT NOT NULL DEFAULT ''")
            )
        db.session.commit()

    if Author.query.first() is None:
        ensure_default_author()

    projects_missing_author = Project.query.filter(Project.author_id.is_(None)).all()
    if projects_missing_author:
        default_author = ensure_default_author()
        for project in projects_missing_author:
            project.author_id = default_author.id
        db.session.commit()


def init_seed_data():
    if Project.query.first() is not None:
        return

    author = ensure_default_author()
    seed_path = Path(__file__).resolve().parent / "projects_seed.json"
    with seed_path.open(encoding="utf-8") as seed_file:
        seed_projects = json.load(seed_file)

    for project_data in seed_projects:
        project = Project(
            title=project_data["title"],
            description=project_data.get("description", ""),
            likes=int(project_data.get("likes", 0)),
            author_id=author.id,
        )
        db.session.add(project)

    db.session.commit()


with app.app_context():
    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    ensure_schema()
    init_seed_data()


@app.get("/")
def index():
    projects = Project.query.order_by(Project.id).all()
    return render_template("index.html", projects=projects)


@app.get("/api/projects")
def list_projects():
    projects = Project.query.order_by(Project.id).all()
    return jsonify([project.to_dict() for project in projects]), 200


@app.post("/api/projects")
def create_project():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="A project title is required."), 400

    title = data.get("title")
    if not isinstance(title, str):
        return jsonify(error="A project title is required."), 400

    trimmed_title = title.strip()
    if not trimmed_title:
        return jsonify(error="A project title is required."), 400

    author = ensure_default_author()
    project = Project(title=trimmed_title, description="", likes=0, author_id=author.id)
    try:
        db.session.add(project)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Project title already exists."), 400

    return jsonify(project.to_dict()), 201


@app.post("/api/projects/smart")
def smart_create_project():
    data = request.get_json(silent=True)
    notes = data.get("notes") if isinstance(data, dict) else None
    if not isinstance(notes, str) or len(notes.strip()) < 20:
        return jsonify(error="Project notes must be at least 20 characters long."), 400

    try:
        details = extract_project_details(notes.strip())
    except ModelRefusalError:
        return jsonify(error="The project notes could not be processed."), 422
    except ProviderUnavailableError:
        return jsonify(error="The AI service is currently unavailable."), 503

    title = details.title.strip()
    summary = details.summary.strip()
    technologies = [
        technology.strip()
        for technology in details.technologies
        if technology.strip()
    ]
    if not title or not summary:
        return jsonify(error="The AI service returned incomplete project details."), 502

    author = ensure_default_author()
    project = Project(
        title=title,
        description="",
        likes=0,
        summary=summary,
        technologies=", ".join(technologies),
        author_id=author.id,
    )

    try:
        db.session.add(project)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Project title already exists."), 400

    return jsonify(project.to_dict()), 201


@app.post("/api/projects/<int:project_id>/upvote")
def upvote_project(project_id):
    project = db.session.get(Project, project_id)
    if project is None:
        return jsonify(error="Project not found"), 404

    project.likes += 1
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Unable to update likes."), 400

    return jsonify(likes=project.likes)


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(Path(app.static_folder) / "assets", filename)


if __name__ == "__main__":
    app.run(debug=True)
