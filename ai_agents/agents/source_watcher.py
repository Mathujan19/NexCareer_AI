"""SourceWatcherAgent (Agent #11 / Team A) — GitHub & Drive Profile Monitor."""
from datetime import datetime, UTC, timedelta
from typing import Dict, Any, List


def check_profile_staleness(user_id: str, last_updated_iso: str, github_username: str = "") -> Dict[str, Any]:
    """Checks if profile needs updating based on last sync time. In production, polls GitHub API."""
    last_updated = datetime.fromisoformat(last_updated_iso.replace("Z", "+00:00"))
    days_stale = (datetime.now(UTC) - last_updated).days
    
    recommendations: List[str] = []
    if days_stale > 30:
        recommendations.append("Profile not updated in 30+ days. Sync GitHub commits.")
    if github_username:
        recommendations.append(f"Scan {github_username}'s recent repositories for new technologies.")
    
    return {
        "user_id": user_id,
        "days_since_update": days_stale,
        "is_stale": days_stale > 14,
        "staleness_level": "HIGH" if days_stale > 30 else "MEDIUM" if days_stale > 14 else "LOW",
        "recommendations": recommendations,
        "checked_at": datetime.now(UTC).isoformat(),
        "agent": "SourceWatcherAgent",
    }
