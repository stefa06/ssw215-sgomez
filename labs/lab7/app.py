import json
from pathlib import Path

from flask import Flask, jsonify, render_template, send_from_directory


app = Flask(__name__)
PROJECTS_FILE = Path(__file__).resolve().parent / "projects.json"


def load_projects_db():
    with PROJECTS_FILE.open(encoding="utf-8") as projects_file:
        return json.load(projects_file)


def save_projects_db(projects_db):
    with PROJECTS_FILE.open("w", encoding="utf-8") as projects_file:
        json.dump(projects_db, projects_file, indent=2)
        projects_file.write("\n")


@app.get("/")
def index():
    projects_db = load_projects_db()
    return render_template("index.html", projects=projects_db)


@app.post("/api/projects/<int:project_id>/upvote")
def upvote_project(project_id):
    projects_db = load_projects_db()
    project = next((item for item in projects_db if item["id"] == project_id), None)
    if project is None:
        return jsonify(error="Project not found"), 404

    project["likes"] += 1
    save_projects_db(projects_db)
    return jsonify(likes=project["likes"])


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(Path(app.static_folder) / "assets", filename)


if __name__ == "__main__":
    app.run(debug=True)
