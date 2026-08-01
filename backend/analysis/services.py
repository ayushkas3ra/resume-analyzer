import re
from .skills import TECH_SKILLS
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
from .groq_client import GroqClient

_model = None


def get_model():
    global _model

    if _model is None:
        print("Loading SentenceTransformer...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")

    return _model


class AnalysisService:

    @staticmethod
    def extract_skills(text):
        words = set(re.findall(r"\b\w+\b", text.lower()))
        return words.intersection(TECH_SKILLS)

    @staticmethod
    def analyze_resume(resume, job_description):

        model = get_model()

        resume_embedding = model.encode(resume)

        job_embedding = model.encode(job_description)

        similarity = cos_sim(resume_embedding, job_embedding).item()

        semantic_score = round(similarity * 100)

        resume_skills = AnalysisService.extract_skills(resume)

        job_skills = AnalysisService.extract_skills(job_description)

        matching_skills = sorted(list(resume_skills.intersection(job_skills)))

        missing_skills = sorted(list(job_skills - resume_skills))

        if len(job_skills) == 0:
            skill_score = 0
        else:
            skill_score = round((len(matching_skills) / len(job_skills)) * 100)

        resume_info = GroqClient.extract_information(resume, "resume")
        job_info = GroqClient.extract_information(job_description, "job")

        experience_score = AnalysisService.calculate_experience_score(
            resume_info["years_of_experience"], job_info["minimum_years_experience"]
        )

        final_score = round(
            0.47 * semantic_score + 0.35 * skill_score + 0.18 * experience_score
        )

        try:
            feedback = GroqClient.generate_resume_feedback(
                final_score=final_score,
                semantic_score=semantic_score,
                skill_score=skill_score,
                experience_score=experience_score,
                matching_skills=matching_skills,
                missing_skills=missing_skills,
            )
        except Exception:
            feedback = {
                "strengths": [],
                "weaknesses": [],
                "skills_to_learn": [],
                "resume_improvements": [],
            }

        return {
            "semantic_score": semantic_score,
            "skill_score": skill_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "experience_score": experience_score,
            "final_score": final_score,
            "feedback": feedback,
        }

    @staticmethod
    def calculate_experience_score(resume_years, required_years):
        if required_years <= 0:
            return 100
        if resume_years >= required_years:
            return 100
        return round((resume_years / required_years) * 100)
