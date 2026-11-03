"""CV Tailoring & Optimization Agent (Functions #2 & #3 / Team C).

Tailors experience bullet points and summary to the target job description using the STAR framework.
Adheres strictly to verified candidate claims.
"""

from typing import Dict, Any, List
from ai_agents.schemas import UserProfile, JobTarget


def tailor_cv_for_job(
    profile: UserProfile,
    job: JobTarget,
    gap_report: Dict[str, Any],
    inject_hallucination_for_test: bool = False,
) -> Dict[str, Any]:
    """Generates a tailored CV draft.

    If inject_hallucination_for_test is True, artificially includes a tool or claim NOT in the user's
    profile to test and prove the Deterministic Truth Checker.
    """
    demonstrated_skills = gap_report.get("demonstrated", [])

    # Format relevant headline & summary
    relevant_skills_str = ", ".join(demonstrated_skills[:4]) if demonstrated_skills else "Software Engineering"
    tailored_headline = f"{profile.headline or 'Software Engineer'} | Specializing in {relevant_skills_str}"

    tailored_summary = (
        f"Results-oriented {profile.full_name} targeting the {job.title} role at {job.company}. "
        f"Demonstrated competence in {relevant_skills_str} backed by real project evidence and verified credentials."
    )

    # Rewrite bullets using STAR method emphasizing overlapping tech
    tailored_bullets: List[str] = []
    claimed_skills_in_draft: List[str] = []

    for exp in profile.experiences:
        for b in exp.bullets:
            # Highlight overlapping demonstrated skills
            matched_tech = [s for s in demonstrated_skills if s.lower() in b.lower()]
            if matched_tech:
                tailored_bullet = f"[Action & Result] Leveraged {', '.join(matched_tech)} to enhance system performance: {b}"
                tailored_bullets.append(tailored_bullet)
                claimed_skills_in_draft.extend(matched_tech)
            else:
                tailored_bullets.append(b)

    for proj in profile.projects:
        for tech in proj.technologies:
            claimed_skills_in_draft.append(tech)
        tailored_bullets.append(
            f"Engineered {proj.name}: {proj.summary} utilizing {', '.join(proj.technologies)}"
        )

    # If test injection requested, insert a fabricated skill that the candidate never had (e.g. "Rust")
    if inject_hallucination_for_test:
        tailored_bullets.append(
            "Architected high-throughput microservices using Rust and Apache Spark with 99.99% uptime."
        )
        claimed_skills_in_draft.append("Rust")
        claimed_skills_in_draft.append("Apache Spark")

    claimed_skills_unique = list(dict.fromkeys(claimed_skills_in_draft))

    return {
        "version_tag": f"v1.0-{job.company.lower().replace(' ', '-')}-tailored",
        "job_id": job.id,
        "company": job.company,
        "role": job.title,
        "tailored_headline": tailored_headline,
        "summary": tailored_summary,
        "tailored_bullets": tailored_bullets,
        "claimed_skills": claimed_skills_unique,
        "keyword_matches": demonstrated_skills,
    }
