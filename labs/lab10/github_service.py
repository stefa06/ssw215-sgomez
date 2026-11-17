import os
from pathlib import Path
from urllib.parse import quote

import requests
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parent / ".env")

README_CHARACTER_LIMIT = 4000


class RepositoryNotFoundError(Exception):
    pass


class GitHubUnavailableError(Exception):
    pass


def fetch_readme(owner: str, repo: str) -> str:
    url = (
        "https://api.github.com/repos/"
        f"{quote(owner, safe='')}/{quote(repo, safe='')}/readme"
    )
    headers = {
        "Accept": "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.RequestException as error:
        raise GitHubUnavailableError from error

    if response.status_code == 404:
        raise RepositoryNotFoundError
    if response.status_code >= 400:
        raise GitHubUnavailableError
    response.raise_for_status()
    return response.text[:README_CHARACTER_LIMIT]
