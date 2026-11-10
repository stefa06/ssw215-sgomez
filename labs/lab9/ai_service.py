import os
from pathlib import Path

from dotenv import load_dotenv
from openai import APIConnectionError, APIStatusError, OpenAI
from pydantic import BaseModel, Field


load_dotenv(Path(__file__).resolve().parent / ".env")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ProjectDetails(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=120,
        description="A short, clear project title.",
    )
    summary: str = Field(
        min_length=1,
        description="A concise summary in one or two sentences.",
    )
    technologies: list[str] = Field(
        description="The technologies explicitly mentioned or clearly implied."
    )


class ModelRefusalError(Exception):
    pass


class ProviderUnavailableError(Exception):
    pass


def extract_project_details(notes: str) -> ProjectDetails:
    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            temperature=0.1,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract project details from the user's notes. Return a short "
                        "title, a one- or two-sentence summary, and a list of relevant "
                        "technologies. Do not invent technologies that are not supported "
                        "by the notes."
                    ),
                },
                {"role": "user", "content": notes},
            ],
            response_format=ProjectDetails,
        )
    except APIConnectionError as error:
        raise ProviderUnavailableError from error
    except APIStatusError as error:
        if error.status_code >= 500:
            raise ProviderUnavailableError from error
        raise

    message = completion.choices[0].message
    if message.refusal:
        raise ModelRefusalError
    if message.parsed is None:
        raise ValueError("The AI service returned no structured project details.")

    return message.parsed
