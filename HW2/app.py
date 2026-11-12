import json
from pathlib import Path
from urllib.parse import urlsplit

from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError


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
    technologies = db.Column(db.String(255), nullable=False, default="")
    github_url = db.Column(db.String(255), nullable=False, default="")
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
            "technologies": self.technologies,
            "github_url": self.github_url,
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
        columns = {
            column["name"] for column in inspect(db.engine).get_columns("projects")
        }
        if "author_id" not in columns:
            db.session.execute(text("ALTER TABLE projects ADD COLUMN author_id INTEGER"))
            author = ensure_default_author()
            db.session.execute(
                text("UPDATE projects SET author_id = :author_id WHERE author_id IS NULL"),
                {"author_id": author.id},
            )
            db.session.commit()

        new_columns = {
            "technologies": "VARCHAR(255)",
            "github_url": "VARCHAR(255)",
        }
        for column_name, column_type in new_columns.items():
            if column_name not in columns:
                db.session.execute(
                    text(
                        f"ALTER TABLE projects ADD COLUMN {column_name} "
                        f"{column_type} NOT NULL DEFAULT ''"
                    )
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
            technologies=project_data.get("technologies", ""),
            github_url=project_data.get("github_url", ""),
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
        return jsonify(error="Project data must be a JSON object."), 400

    field_limits = {
        "title": 120,
        "description": 255,
        "technologies": 255,
        "github_url": 255,
    }
    project_data = {}
    for field_name, max_length in field_limits.items():
        value = data.get(field_name)
        if not isinstance(value, str) or not value.strip():
            return jsonify(error=f"A non-empty {field_name} is required."), 400

        value = value.strip()
        if len(value) > max_length:
            return (
                jsonify(error=f"{field_name} must be {max_length} characters or fewer."),
                400,
            )
        project_data[field_name] = value

    try:
        github_url = urlsplit(project_data["github_url"])
        valid_github_url = (
            github_url.scheme == "https"
            and github_url.hostname == "github.com"
            and bool(github_url.path.strip("/"))
        )
    except ValueError:
        valid_github_url = False

    if not valid_github_url:
        return jsonify(error="github_url must be a valid https://github.com/ URL."), 400

    author = ensure_default_author()
    project = Project(**project_data, author_id=author.id)
    try:
        db.session.add(project)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify(error="Project title already exists."), 400

    return jsonify(project.to_dict()), 201


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(Path(app.static_folder) / "assets", filename)


if __name__ == "__main__":
    app.run(debug=True)
