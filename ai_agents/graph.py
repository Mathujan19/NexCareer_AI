"""LangGraph Hierarchical Supervisor and Workflow State Machine for NexCareer AI.

Implements the Phase 1 Golden Path:
1. Skill Gap Analysis Node (Team B)
2. CV Tailoring Node (Team C)
3. Deterministic Truth Guardrail Node (Anti-hallucination interceptor)
4. Human Approval Gate Node (H2 checkpoint using langgraph interrupt())
5. Finalize Document Node (Locks approved CV)
"""

from datetime import datetime
from typing import Dict, Any
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command

from ai_agents.state import CareerOrchestratorState
from ai_agents.schemas import UserProfile, JobTarget
from ai_agents.agents.gap_analyzer import run_skill_gap_analysis
from ai_agents.agents.cv_tailoring import tailor_cv_for_job
from ai_agents.guardrails.truth_checker import verify_draft_against_profile


def skill_gap_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Node 1: Evaluates job requirements against verified candidate profile evidence."""
    profile_data = state["user_profile"]
    job_data = state["target_job"]

    profile = UserProfile(**profile_data)
    job = JobTarget(**job_data)

    gap_report = run_skill_gap_analysis(profile, job)

    audit_entry = {
        "agent": "GapAnalyzerAgent",
        "action": "EVALUATE_SKILL_GAPS",
        "timestamp": datetime.utcnow().isoformat(),
        "details": f"Analyzed {gap_report['total_requirements']} requirements. Match score: {gap_report['match_score']}%",
    }

    return {
        "skill_gap_report": gap_report,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def cv_tailoring_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Node 2: Generates tailored CV bullets using the STAR framework."""
    profile_data = state["user_profile"]
    job_data = state["target_job"]
    gap_report = state.get("skill_gap_report", {})

    profile = UserProfile(**profile_data)
    job = JobTarget(**job_data)

    # Check if a synthetic test hallucination was requested in state for testing truth checker
    inject_test = state.get("user_profile", {}).get("_inject_test_hallucination", False)

    tailored_draft = tailor_cv_for_job(profile, job, gap_report, inject_hallucination_for_test=inject_test)

    audit_entry = {
        "agent": "CVOptimizerAgent",
        "action": "TAILOR_CV_DRAFT",
        "timestamp": datetime.utcnow().isoformat(),
        "details": f"Generated tailored draft '{tailored_draft['version_tag']}' with STAR bullet alignments.",
    }

    return {
        "tailored_cv_draft": tailored_draft,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def truth_guardrail_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Node 3: Deterministic Fact Interceptor.

    Asserts: Extracted Entities ⊆ Verified Profile Facts.
    Intercepts and blocks unverified claims.
    """
    profile = UserProfile(**state["user_profile"])
    cv_draft = state.get("tailored_cv_draft", {})

    verification_result = verify_draft_against_profile(cv_draft, profile)

    audit_entry = {
        "agent": "DeterministicTruthChecker",
        "action": "ASSERT_ZERO_HALLUCINATION",
        "timestamp": datetime.utcnow().isoformat(),
        "passed": verification_result.is_valid,
        "details": verification_result.details,
    }

    return {
        "truth_check_passed": verification_result.is_valid,
        "truth_violations": verification_result.unverified_violations,
        "approval_pending": verification_result.is_valid,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def human_approval_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Node 4: Human-in-the-Loop Gateway (Checkpoint H2).

    Pauses graph execution via interrupt() until explicitly approved by the user.
    """
    review_payload = {
        "checkpoint": "H2_DOCUMENT_APPROVAL",
        "job_title": state.get("target_job", {}).get("title"),
        "company": state.get("target_job", {}).get("company"),
        "tailored_cv": state.get("tailored_cv_draft"),
        "skill_gap_report": state.get("skill_gap_report"),
        "truth_check_passed": state.get("truth_check_passed", False),
        "requires_human_approval": True,
    }

    # Halts execution here. When resumed with Command(resume=decision), user_decision receives the payload.
    user_decision = interrupt(review_payload)

    audit_entry = {
        "agent": "HumanApprovalGate",
        "action": "RECORD_USER_DECISION",
        "timestamp": datetime.utcnow().isoformat(),
        "details": f"Received user approval decision: {user_decision}",
    }

    return {
        "approval_pending": False,
        "user_approval_decision": user_decision,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def finalize_document_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Node 5: Locks the final approved CV version into the system."""
    audit_entry = {
        "agent": "CVSynthesisAgent",
        "action": "LOCK_FINAL_DOCUMENT",
        "timestamp": datetime.utcnow().isoformat(),
        "details": "Document successfully approved and locked for application submission.",
    }

    return {
        "final_document_locked": True,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def halt_on_violation_node(state: CareerOrchestratorState) -> Dict[str, Any]:
    """Fallback Node: Intercepts and safely halts workflow when unverified claims are detected."""
    audit_entry = {
        "agent": "DeterministicTruthChecker",
        "action": "ABORT_ON_UNVERIFIED_CLAIM",
        "timestamp": datetime.utcnow().isoformat(),
        "details": f"Execution halted: {state.get('truth_violations')} cannot be verified in candidate database.",
    }

    return {
        "final_document_locked": False,
        "approval_pending": False,
        "audit_trail": state.get("audit_trail", []) + [audit_entry],
    }


def route_after_truth_check(state: CareerOrchestratorState) -> str:
    """Conditional Edge: Only route to Human Approval if Truth Check passed."""
    if not state.get("truth_check_passed", False):
        return "halt_on_violation_node"
    return "human_approval_node"


def route_after_approval(state: CareerOrchestratorState) -> str:
    """Conditional Edge: Only finalize if user explicitly approved."""
    decision = state.get("user_approval_decision", {})
    if decision and decision.get("approved") is True:
        return "finalize_document_node"
    return "halt_on_violation_node"


def create_career_graph(checkpointer: Any = None):
    """Builds and compiles the NexCareer LangGraph workflow."""
    builder = StateGraph(CareerOrchestratorState)

    # Add Nodes
    builder.add_node("skill_gap_node", skill_gap_node)
    builder.add_node("cv_tailoring_node", cv_tailoring_node)
    builder.add_node("truth_guardrail_node", truth_guardrail_node)
    builder.add_node("human_approval_node", human_approval_node)
    builder.add_node("finalize_document_node", finalize_document_node)
    builder.add_node("halt_on_violation_node", halt_on_violation_node)

    # Add Edges
    builder.add_edge(START, "skill_gap_node")
    builder.add_edge("skill_gap_node", "cv_tailoring_node")
    builder.add_edge("cv_tailoring_node", "truth_guardrail_node")

    # Conditional branching
    builder.add_conditional_edges(
        "truth_guardrail_node",
        route_after_truth_check,
        {
            "human_approval_node": "human_approval_node",
            "halt_on_violation_node": "halt_on_violation_node",
        },
    )

    builder.add_conditional_edges(
        "human_approval_node",
        route_after_approval,
        {
            "finalize_document_node": "finalize_document_node",
            "halt_on_violation_node": "halt_on_violation_node",
        },
    )

    builder.add_edge("finalize_document_node", END)
    builder.add_edge("halt_on_violation_node", END)

    if checkpointer is None:
        checkpointer = MemorySaver()

    return builder.compile(checkpointer=checkpointer)
