"""State definitions for the LangGraph Orchestrator."""

from typing import TypedDict, Optional, List, Dict, Any


class CareerOrchestratorState(TypedDict, total=False):
    thread_id: str
    user_id: str
    active_intent: str

    # Single Source of Truth Profile
    user_profile: Dict[str, Any]

    # Target Job Context
    target_job: Dict[str, Any]

    # Intermediate Artifacts
    skill_gap_report: Optional[Dict[str, Any]]
    tailored_cv_draft: Optional[Dict[str, Any]]

    # Deterministic Truth Guardrail State
    truth_check_passed: bool
    truth_violations: List[str]

    # Human-in-the-Loop Gate (H2)
    approval_pending: bool
    user_approval_decision: Optional[Dict[str, Any]]
    final_document_locked: bool

    # Auditable Execution Traceability
    audit_trail: List[Dict[str, Any]]
