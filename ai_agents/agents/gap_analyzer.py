"""Skill Gap Analyzer Agent (Function #6 / Team B).

Performs matrix comparison between target job requirements and verified profile evidence.
"""

from datetime import datetime
from typing import Dict, Any, List
from ai_agents.schemas import UserProfile, JobTarget, SkillVerificationStatus


# Common technology synonym mappings (Deterministic alias dictionary)
TECH_ALIASES = {
    "react": "react",
    "react.js": "react",
    "reactjs": "react",
    "node": "nodejs",
    "node.js": "nodejs",
    "nodejs": "nodejs",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "ts": "typescript",
    "typescript": "typescript",
    "js": "javascript",
    "javascript": "javascript",
    "py": "python",
    "python": "python",
    "docker": "docker",
    "containerization": "docker",
    "k8s": "kubernetes",
    "kubernetes": "kubernetes",
    "nest": "nestjs",
    "nestjs": "nestjs",
}


def normalize_skill_name(name: str) -> str:
    cleaned = name.strip().lower()
    return TECH_ALIASES.get(cleaned, cleaned)


def run_skill_gap_analysis(profile: UserProfile, job: JobTarget) -> Dict[str, Any]:
    """Analyzes skills matching and gap identification between candidate profile and target job."""
    # Map verified skills and evidence
    verified_skills = set()
    unverified_skills = set()

    for s in profile.skills:
        norm = normalize_skill_name(s.name)
        if s.status in (SkillVerificationStatus.DEMONSTRATED, SkillVerificationStatus.CERTIFIED) or s.evidence:
            verified_skills.add(norm)
        else:
            unverified_skills.add(norm)

    # Add project technologies
    for p in profile.projects:
        for t in p.technologies:
            verified_skills.add(normalize_skill_name(t))

    demonstrated: List[str] = []
    partially_demonstrated: List[str] = []
    confirmed_gaps: List[str] = []
    missing_mandatory: List[str] = []

    all_reqs = []
    for req in job.mandatory_requirements:
        all_reqs.append((req, True))
    for req in job.preferred_requirements:
        all_reqs.append((req, False))

    for req, is_mandatory in all_reqs:
        norm_req = normalize_skill_name(req)
        if norm_req in verified_skills:
            demonstrated.append(req)
        elif norm_req in unverified_skills:
            partially_demonstrated.append(req)
        else:
            confirmed_gaps.append(req)
            if is_mandatory:
                missing_mandatory.append(req)

    total_reqs = len(all_reqs)
    if total_reqs > 0:
        # Match percentage calculation: demonstrated = 1.0, partially = 0.5
        score = ((len(demonstrated) * 1.0) + (len(partially_demonstrated) * 0.5)) / total_reqs
        match_score = round(score * 100.0, 1)
    else:
        match_score = 100.0

    return {
        "match_score": match_score,
        "demonstrated": demonstrated,
        "partially_demonstrated": partially_demonstrated,
        "confirmed_gaps": confirmed_gaps,
        "missing_mandatory": missing_mandatory,
        "analyzed_at": datetime.utcnow().isoformat(),
        "total_requirements": total_reqs,
        "rationale": {
            "demonstrated_count": len(demonstrated),
            "partial_count": len(partially_demonstrated),
            "gap_count": len(confirmed_gaps),
            "missing_mandatory_count": len(missing_mandatory),
        },
    }
