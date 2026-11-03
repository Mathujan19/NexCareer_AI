"""ProfileMasterAgent (Agent #01 / Team A) — Career Profile Ingestion & Normalization."""
from datetime import datetime, UTC
from typing import Dict, Any
from ai_agents.schemas import UserProfile


def ingest_and_normalize_profile(raw_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Validates, normalizes and enriches raw profile input into a verified UserProfile."""
    profile = UserProfile(**raw_profile)
    verified_count = len(profile.get_verified_skill_names())
    total_skills = len(profile.skills)
    
    return {
        "status": "NORMALIZED",
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "verified_skills_count": verified_count,
        "total_skills": total_skills,
        "projects_count": len(profile.projects),
        "experiences_count": len(profile.experiences),
        "completeness_score": round((verified_count / max(total_skills, 1)) * 100, 1),
        "processed_at": datetime.now(UTC).isoformat(),
        "agent": "ProfileMasterAgent",
    }
