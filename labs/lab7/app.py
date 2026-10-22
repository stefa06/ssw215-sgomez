from pathlib import Path

from flask import Flask, jsonify, render_template, send_from_directory


app = Flask(__name__)

projects_db = [
    {
        "id": 1,
        "title": "make video games",
        "description": "Create interactive games and bring playful ideas to life.",
        "likes": 0,
    },
    {
        "id": 2,
        "title": "make websites",
        "description": "Design and build useful, welcoming websites.",
        "likes": 0,
    },
        # hand-edited by SG
    {
        "id": 3,
        "title": "build mobile apps",
        "description": "Create helpful apps for phones and tablets.",
        "likes": 0
    },
    # hand-edited by SG
    {
        "id": 4,
        "title": "design helpful apps",
        "description": "Turn creative ideas into useful digital tools.",
        "likes": 0
    }

]


@app.get("/")
def index():
    return render_template("index.html", projects=projects_db)


@app.post("/api/projects/<int:project_id>/upvote")
def upvote_project(project_id):
    project = next((item for item in projects_db if item["id"] == project_id), None)
    if project is None:
        return jsonify(error="Project not found"), 404

    project["likes"] += 1
    return jsonify(likes=project["likes"])


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(Path(app.static_folder) / "assets", filename)


if __name__ == "__main__":
    app.run(debug=True)
