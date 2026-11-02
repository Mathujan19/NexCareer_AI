"""FastAPI Service exposing the NexCareer LangGraph Multi-Agent Orchestrator."""

import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.types import Command
from langgraph.checkpoint.memory import MemorySaver

from ai_agents.graph import create_career_graph
from ai_agents.schemas import UserProfile, JobTarget
from ai_agents.guardrails.truth_checker import verify_draft_against_profile

app = FastAPI(
    title="NexCareer AI - Multi-Agent Orchestrator",
    version="1.0.0",
    description="Supervised Agentic Career Management Platform API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory checkpointer for active threads
shared_checkpointer = MemorySaver()
career_graph = create_career_graph(checkpointer=shared_checkpointer)


class AnalyzeAndTailorRequest(BaseModel):
    user_profile: Dict[str, Any]
    target_job: Dict[str, Any]
    thread_id: Optional[str] = None


class ApproveCVRequest(BaseModel):
    thread_id: str
    approved: bool = True
    user_feedback: Optional[str] = None


class VerifyTruthRequest(BaseModel):
    user_profile: Dict[str, Any]
    cv_draft: Dict[str, Any]


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "NexCareer AI Multi-Agent Orchestrator",
        "framework": "LangGraph StateGraph",
        "checkpoints": ["H1", "H2", "H3", "H4"],
    }


@app.post("/api/agents/analyze-and-tailor")
def analyze_and_tailor(req: AnalyzeAndTailorRequest):
    """Executes the pipeline up to Checkpoint H2 (Human Review Modal).

    Halts at interrupt() awaiting user confirmation.
    """
    thread_id = req.thread_id or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "thread_id": thread_id,
        "user_id": req.user_profile.get("user_id", "guest-user"),
        "active_intent": "TAILOR_DOCS",
        "user_profile": req.user_profile,
        "target_job": req.target_job,
        "audit_trail": [],
    }

    try:
        # Run graph until interrupt or end
        events = list(career_graph.stream(initial_state, config=config))
        snapshot = career_graph.get_state(config)

        # Check if halted at interrupt (human approval gate)
        interrupt_value = None
        if snapshot.tasks and snapshot.tasks[0].interrupts:
            interrupt_value = snapshot.tasks[0].interrupts[0].value

        return {
            "thread_id": thread_id,
            "next_nodes": snapshot.next,
            "is_interrupted": len(snapshot.next) > 0,
            "approval_payload": interrupt_value,
            "state_values": {
                "skill_gap_report": snapshot.values.get("skill_gap_report"),
                "tailored_cv_draft": snapshot.values.get("tailored_cv_draft"),
                "truth_check_passed": snapshot.values.get("truth_check_passed"),
                "truth_violations": snapshot.values.get("truth_violations", []),
                "final_document_locked": snapshot.values.get("final_document_locked", False),
            },
            "audit_trail": snapshot.values.get("audit_trail", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/approve-cv")
def approve_cv(req: ApproveCVRequest):
    """Resumes the interrupted LangGraph execution with user approval decision (Checkpoint H2)."""
    config = {"configurable": {"thread_id": req.thread_id}}

    try:
        # Resume graph with Command(resume=decision)
        resume_command = Command(resume={"approved": req.approved, "feedback": req.user_feedback})
        events = list(career_graph.stream(resume_command, config=config))
        snapshot = career_graph.get_state(config)

        return {
            "thread_id": req.thread_id,
            "status": "APPROVED_AND_LOCKED" if snapshot.values.get("final_document_locked") else "HALTED",
            "final_document_locked": snapshot.values.get("final_document_locked", False),
            "tailored_cv": snapshot.values.get("tailored_cv_draft"),
            "audit_trail": snapshot.values.get("audit_trail", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/verify-truth")
def verify_truth(req: VerifyTruthRequest):
    """Direct standalone API to run the Deterministic Fact Interceptor on any draft."""
    profile = UserProfile(**req.user_profile)
    res = verify_draft_against_profile(req.cv_draft, profile)
    return res.to_dict()
