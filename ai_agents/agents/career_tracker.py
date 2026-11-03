"""TelemetryTrackerAgent (Agent #10 / Team D) — 12-Stage Kanban Application Tracker."""
from datetime import datetime, UTC
from typing import Dict, Any, List, Optional

APP_STATUS_MACHINE = [
    "DISCOVERED", "SAVED", "ANALYZING", "TAILORED",
    "AWAITING_USER_APPROVAL", "APPROVED", "SUBMITTED",
    "SUBMISSION_FAILED", "INTERVIEW_SCHEDULED", "OFFERED", "REJECTED", "WITHDRAWN",
]

TERMINAL_STATES = {"OFFERED", "REJECTED", "WITHDRAWN", "SUBMISSION_FAILED"}


def transition_application_status(
    application_id: str,
    current_status: str,
    new_status: str,
    user_id: str,
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Validates and records a state machine transition for a job application."""
    if new_status not in APP_STATUS_MACHINE:
        return {"error": f"Invalid status: {new_status}", "valid_statuses": APP_STATUS_MACHINE}
    
    if current_status in TERMINAL_STATES:
        return {"error": f"Application is in terminal state: {current_status}. Cannot transition.", "application_id": application_id}
    
    current_idx = APP_STATUS_MACHINE.index(current_status) if current_status in APP_STATUS_MACHINE else -1
    new_idx = APP_STATUS_MACHINE.index(new_status)
    
    return {
        "application_id": application_id,
        "user_id": user_id,
        "previous_status": current_status,
        "new_status": new_status,
        "is_forward_transition": new_idx > current_idx,
        "is_terminal": new_status in TERMINAL_STATES,
        "notes": notes,
        "transition_requires_approval": new_status in {"APPROVED", "SUBMITTED"},
        "transitioned_at": datetime.now(UTC).isoformat(),
        "agent": "TelemetryTrackerAgent",
    }


def get_kanban_board(applications: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Groups applications into Kanban columns by status."""
    board = {status: [] for status in APP_STATUS_MACHINE}
    for app in applications:
        status = app.get("status", "DISCOVERED")
        if status in board:
            board[status].append(app)
    return {
        "board": board,
        "total_applications": len(applications),
        "active_applications": sum(1 for a in applications if a.get("status") not in TERMINAL_STATES),
        "generated_at": datetime.now(UTC).isoformat(),
        "agent": "TelemetryTrackerAgent",
    }
