"""PortfolioBuilderAgent (Agent #04 / Team A) — Static Portfolio Site Generator."""
from datetime import datetime, UTC
from typing import Dict, Any
from ai_agents.schemas import UserProfile


THEMES = {
    "cyber": {"primary": "#6366f1", "bg": "#020617", "surface": "#0f172a"},
    "slate": {"primary": "#94a3b8", "bg": "#1e293b", "surface": "#334155"},
    "emerald": {"primary": "#10b981", "bg": "#022c22", "surface": "#064e3b"},
}


def build_portfolio(profile_data: Dict[str, Any], theme: str = "cyber") -> Dict[str, Any]:
    """Generates a portfolio spec from verified profile data."""
    profile = UserProfile(**profile_data)
    colors = THEMES.get(theme, THEMES["cyber"])
    
    sections = []
    sections.append({"type": "hero", "name": profile.full_name, "headline": profile.headline or "Software Engineer"})
    if profile.skills:
        sections.append({"type": "skills", "items": [{"name": s.name, "category": s.category, "status": s.status} for s in profile.skills]})
    if profile.projects:
        sections.append({"type": "projects", "items": [{"name": p.name, "summary": p.summary, "tech": p.technologies, "repo": p.repo_url, "demo": p.live_demo_url} for p in profile.projects]})
    if profile.experiences:
        sections.append({"type": "experience", "items": [{"company": e.company, "role": e.role, "bullets": e.bullets} for e in profile.experiences]})

    return {
        "status": "READY_FOR_PREVIEW",
        "theme": theme,
        "colors": colors,
        "sections": sections,
        "subdomain": f"{profile.user_id.replace('_', '-')}.nexcareer.lk",
        "generated_at": datetime.now(UTC).isoformat(),
        "agent": "PortfolioBuilderAgent",
        "checkpoint": "H4_PUBLISH_APPROVAL_REQUIRED",
    }
