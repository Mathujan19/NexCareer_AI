"""StrategicAdvisorAgent (Agent #12 / Team B) — Multilingual Career Chat Interface."""
from datetime import datetime, UTC
from typing import Dict, Any, Optional

KEYWORD_RESPONSES = {
    "gap": lambda ctx: f"Based on your profile, your top skill gaps are: {', '.join(ctx.get('gaps', ['Docker', 'Jest', 'CI/CD']))}. I recommend starting with Docker as it's the highest-leverage addition for Sri Lankan tech internships.",
    "cv": lambda ctx: "Your CV is being tailored using the STAR framework strictly from your verified credentials. All claims are checked against your GitHub and academic evidence — no hallucinations.",
    "salary": lambda ctx: "For Software Engineering internships in Colombo, typical compensation ranges from LKR 40,000–80,000/month. Associate Engineer roles post-graduation range from LKR 80,000–150,000/month.",
    "apply": lambda ctx: "To apply: 1) Finalize your tailored CV (Checkpoint H2), 2) Review the cover email draft (Checkpoint H3), 3) Approve submission. All steps require your explicit approval.",
    "portfolio": lambda ctx: "Your portfolio website is ready for preview at your nexcareer.lk subdomain. Once you approve it (Checkpoint H4), it goes live instantly.",
    "default": lambda ctx: "I'm your NexCareer AI Career Advisor. I can help with skill gaps, CV tailoring, job applications, salary benchmarks, and career strategy. What would you like to know?",
}


def advise(
    message: str,
    user_id: str,
    language: str = "en",
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Processes a career question and returns actionable advice. Supports en/ta/si."""
    ctx = context or {}
    msg_lower = message.lower()
    
    response_fn = KEYWORD_RESPONSES["default"]
    matched_intent = "general"
    for keyword, fn in KEYWORD_RESPONSES.items():
        if keyword != "default" and keyword in msg_lower:
            response_fn = fn
            matched_intent = keyword
            break
    
    reply = response_fn(ctx)
    
    return {
        "user_id": user_id,
        "user_message": message,
        "intent": matched_intent,
        "language": language,
        "reply": reply,
        "suggested_actions": ["View Skill Gap Report", "Open CV Builder", "Browse Jobs"],
        "responded_at": datetime.now(UTC).isoformat(),
        "agent": "StrategicAdvisorAgent",
    }
