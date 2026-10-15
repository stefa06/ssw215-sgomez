from pathlib import Path

from flask import Flask, render_template, send_from_directory


app = Flask(__name__)

projects_db = [
    {
        "id": 1,
        "title": "My amazing Video Game Project.",
        "description": "Create interactive games and bring playful ideas to life.",
        "likes": 0,
    },
    {
        "id": 2,
        "title": "make websites",
        "description": "Design and build useful, welcoming websites.",
        "likes": 0,
    },
    {
        "id": 3,
        "title": "make apps",
        "description": "Design and build useful, welcoming apps.",
        "likes": 0,
    },#hand-edited by SG
    
    {
        "id": 4,
        "title": "design helpful apps",
        "description": "Turn creative ideas into useful digital tools.",
        "likes": 0,
    },  # hand-edited by SG

]


@app.get("/")
def index():
    return render_template("index.html", projects=projects_db)


@app.get("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(Path(app.static_folder) / "assets", filename)


if __name__ == "__main__":
    app.run(debug=True)
