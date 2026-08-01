from openai import OpenAI
from django.conf import settings
import json

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


class GroqClient:

    @staticmethod
    def generate_resume_feedback(
        final_score,
        semantic_score,
        skill_score,
        experience_score,
        matching_skills,
        missing_skills,
    ):

        prompt = f"""
           Overall Resume Score:
            {final_score:.1f}

            Semantic Score:
            {semantic_score}

            Skill Score:
            {skill_score}

            Experience Score:
            {experience_score}

            Matching Skills:
            {", ".join(matching_skills) if matching_skills else "None"}

            Missing Skills:
            {", ".join(missing_skills) if missing_skills else "None"}


            Return ONLY valid JSON.

            {{
                "strengths": [
                    "...",
                    "..."
                ],
                "weaknesses": [
                    "...",
                    "..."
                ],
                "skills_to_learn": [
                     "...",
                     "..."
                ],
                "resume_improvements": [
                     "...",
                    "..."
                ]
            }}

            Rules:
            - Do not write markdown.
            - Do not use ```json.
            - Do not explain anything.
            - Return only JSON.
            """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        content = response.choices[0].message.content

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "strengths": [],
                "weaknesses": [],
                "skills_to_learn": [],
                "resume_improvements": [],
                "error": "Failed to parse AI response.",
            }

    @staticmethod
    def extract_information(text, document_type):

        if document_type == "resume":
            prompt = f"""
            You are an expert resume parser.

            Extract information from the following resume.

            Return ONLY valid JSON in this format:

            {{
                "skills": [],
                "experience_summary": "",
                "years_of_experience": 0,
                "projects": [],
                "education": "",
                "certifications": []
            }}

            Rules:

            1. years_of_experience must be a number.
            2. If experience isn't mentioned, return 0.
            3. projects should contain only project names.
            4. skills should contain only technical skills.
            5. Return only JSON.

            Resume:

            {text}
            """
        else:
            prompt = f"""
            You are an expert job description parser.

            Return ONLY valid JSON.

            {{
                "required_skills": [],
                "preferred_skills": [],
                "minimum_years_experience": 0,
                "education_requirement": "",
                "responsibilities": []
            }}

            Rules:

            1. minimum_years_experience must be a number.
            2. responsibilities should be short strings.
            3. required_skills should contain only mandatory technical skills.
            4. preferred_skills should contain optional technical skills.
            5. Return only JSON.

            Job Description:

            {text}
            """
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )
        content = response.choices[0].message.content
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "required_skills": [],
                "preferred_skills": [],
                "minimum_years_experience": 0,
                "education_requirement": "",
                "responsibilities": [],
            }
