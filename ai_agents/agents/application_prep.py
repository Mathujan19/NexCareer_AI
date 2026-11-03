"""ApplicationPrepAgent (Agent #08 / Team C) — Application Bundle Assembler."""
from datetime import datetime, UTC
from typing import Dict, Any, Optional
import hashlib, json


def prepare_application_bundle(
    profile_data: Dict[str, Any],
    job_data: Dict[str, Any],
    tailored_cv: Dict[str, Any],
    cover_note: Optional[str] = None,
) -> Dict[str, Any]:
    """Assembles the full application package and raises H2/H3 approval flags."""
    payload = {
        "applicant": profile_data.get("full_name"),
        "job_title": job_data.get("title"),
        "company": job_data.get("company"),
        "cv_version": tailored_cv.get("version_tag"),
    }
    payload_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    
    return {
        "bundle_id": f"bundle_{job_data.get('id', 'unknown')}_{datetime.now(UTC).strftime('%Y%m%d')}",
        "applicant_name": profile_data.get("full_name"),
        "target_company": job_data.get("company"),
        "target_role": job_data.get("title"),
        "cv_snapshot": tailored_cv,
        "cover_note": cover_note or f"I am excited to apply for the {job_data.get('title')} role at {job_data.get('company')}.",
        "payload_sha256": payload_hash,
        "status": "AWAITING_H3_APPROVAL",
        "checkpoint": "H3_DISPATCH_GATE",
        "requires_human_approval": True,
        "prepared_at": datetime.now(UTC).isoformat(),
        "agent": "ApplicationPrepAgent",
    }
