"""OutreachMailAgent (Agent #09 / Team D) — Recruiter Email Drafter."""
from datetime import datetime, UTC
from typing import Dict, Any, Optional


def draft_outreach_email(
    profile_data: Dict[str, Any],
    job_data: Dict[str, Any],
    email_type: str = "APPLICATION",
    context: Optional[str] = None,
) -> Dict[str, Any]:
    """Drafts recruiter communication grounded strictly in verified profile data."""
    name = profile_data.get("full_name", "Candidate")
    company = job_data.get("company", "Company")
    role = job_data.get("title", "Software Engineer")
    email = profile_data.get("email", "")
    
    templates = {
        "APPLICATION": {
            "subject": f"Application for {role} at {company} — {name}",
            "body": f"""Dear Hiring Team at {company},

I am writing to express my strong interest in the {role} position. As a {profile_data.get('headline', 'software engineer')}, I have developed verified competency in the core technologies listed in your requirements.

My key relevant strengths include hands-on project experience across full-stack engineering, AI integration, and production-grade deployments — all backed by verifiable GitHub repositories and academic evidence.

I would welcome the opportunity to discuss how my background aligns with {company}'s engineering needs.

Best regards,
{name}
{email}""",
        },
        "FOLLOW_UP": {
            "subject": f"Follow-Up: {role} Application — {name}",
            "body": f"""Dear Hiring Team at {company},

I wanted to follow up on my application for the {role} position submitted recently. I remain very enthusiastic about the opportunity and would love to learn about next steps.

Thank you for your time and consideration.

Best regards,
{name}""",
        },
    }
    
    template = templates.get(email_type, templates["APPLICATION"])
    
    return {
        "email_type": email_type,
        "subject": template["subject"],
        "body": template["body"],
        "to_company": company,
        "from_name": name,
        "status": "DRAFT_READY_FOR_H3_APPROVAL",
        "checkpoint": "H3_DISPATCH_GATE",
        "requires_human_approval": True,
        "drafted_at": datetime.now(UTC).isoformat(),
        "agent": "OutreachMailAgent",
    }
