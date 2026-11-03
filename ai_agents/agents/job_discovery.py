"""JobDiscoveryAgent (Agent #05 / Team B) — Job Listing Discovery & Match Scoring."""
import hashlib
from datetime import datetime, UTC
from typing import Dict, Any, List
from ai_agents.schemas import UserProfile
from ai_agents.agents.gap_analyzer import run_skill_gap_analysis, normalize_skill_name


SAMPLE_JOB_LISTINGS = [
    {"id": "job_wso2_01", "title": "Software Engineering Intern", "company": "WSO2", "location": "Colombo", "is_remote": False, "mandatory_requirements": ["React", "TypeScript", "NestJS"], "preferred_requirements": ["Docker", "PostgreSQL"], "raw_text": "WSO2 seeks a passionate Software Engineering Intern with React and TypeScript.", "url": "https://wso2.com/careers", "source": "company_site"},
    {"id": "job_sysco_01", "title": "Associate Software Engineer", "company": "Sysco LABS", "location": "Colombo", "is_remote": True, "mandatory_requirements": ["React", "Node.js", "PostgreSQL"], "preferred_requirements": ["TypeScript", "Docker", "Jest"], "raw_text": "Sysco LABS is hiring an Associate Software Engineer with React and Node.js skills.", "url": "https://syscolabs.lk/careers", "source": "rooster_lk"},
    {"id": "job_rootcode_01", "title": "AI & Full Stack Engineer Intern", "company": "Rootcode AI", "location": "Colombo", "is_remote": True, "mandatory_requirements": ["Python", "React", "FastAPI"], "preferred_requirements": ["LangChain", "PostgreSQL", "Docker"], "raw_text": "Rootcode AI seeks a full-stack + AI intern experienced in Python and React.", "url": "https://rootcode.io/careers", "source": "linkedin"},
]


def discover_jobs(profile_data: Dict[str, Any], limit: int = 10) -> Dict[str, Any]:
    """Fetches, deduplicates, and scores job listings against the candidate profile."""
    from ai_agents.schemas import JobTarget
    profile = UserProfile(**profile_data)
    scored_jobs = []
    
    for job_raw in SAMPLE_JOB_LISTINGS[:limit]:
        job = JobTarget(
            id=job_raw["id"],
            title=job_raw["title"],
            company=job_raw["company"],
            mandatory_requirements=job_raw["mandatory_requirements"],
            preferred_requirements=job_raw.get("preferred_requirements", []),
            raw_text=job_raw["raw_text"],
        )
        gap_report = run_skill_gap_analysis(profile, job)
        dedup_hash = hashlib.sha256(f"{job.company}:{job.title}".encode()).hexdigest()[:16]
        
        scored_jobs.append({
            **job_raw,
            "match_score": gap_report["match_score"],
            "demonstrated_skills": gap_report["demonstrated"],
            "confirmed_gaps": gap_report["confirmed_gaps"],
            "dedup_hash": dedup_hash,
        })
    
    scored_jobs.sort(key=lambda j: j["match_score"], reverse=True)
    
    return {
        "jobs": scored_jobs,
        "total_found": len(scored_jobs),
        "discovered_at": datetime.now(UTC).isoformat(),
        "agent": "JobDiscoveryAgent",
    }
