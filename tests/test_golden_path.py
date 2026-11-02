"""Comprehensive automated tests for Phase 1 Golden Path:

1. User Profile schema (Skills + Evidence verification)
2. Skill Gap Analyzer agent
3. CV Tailoring agent via STAR framework
4. Deterministic Truth Checker (anti-hallucination guardrail)
5. LangGraph interrupt() breakpoint for Checkpoint H2 (Human Approval Gate)
"""

import pytest
from langgraph.types import Command
from langgraph.checkpoint.memory import MemorySaver

from ai_agents.schemas import (
    UserProfile,
    SkillRecord,
    SkillEvidenceItem,
    SkillVerificationStatus,
    ClaimSource,
    JobTarget,
    ExperienceRecord,
    ProjectRecord,
)
from ai_agents.agents.gap_analyzer import run_skill_gap_analysis
from ai_agents.agents.cv_tailoring import tailor_cv_for_job
from ai_agents.guardrails.truth_checker import verify_draft_against_profile
from ai_agents.graph import create_career_graph


@pytest.fixture
def sample_user_profile() -> UserProfile:
    """Fixture providing a verified student/graduate profile from Sabaragamuwa University."""
    return UserProfile(
        user_id="usr_odyssey_01",
        full_name="Mathujan Vimalarajah",
        email="vimalarajahmathujan@gmail.com",
        headline="Full Stack & AI Engineer Undergraduate",
        skills=[
            SkillRecord(
                name="React",
                category="FRONTEND",
                proficiency="ADVANCED",
                status=SkillVerificationStatus.DEMONSTRATED,
                source=ClaimSource.GITHUB_ANALYZED,
                confidence_score=0.90,
                evidence=[
                    SkillEvidenceItem(
                        evidence_type="GITHUB_REPO",
                        title="NexCareer_AI Frontend",
                        reference_url="https://github.com/Mathujan19/NexCareer_AI",
                    )
                ],
            ),
            SkillRecord(
                name="TypeScript",
                category="LANGUAGE",
                proficiency="INTERMEDIATE",
                status=SkillVerificationStatus.DEMONSTRATED,
                source=ClaimSource.GITHUB_ANALYZED,
                confidence_score=0.85,
            ),
            SkillRecord(
                name="NestJS",
                category="BACKEND",
                proficiency="INTERMEDIATE",
                status=SkillVerificationStatus.DEMONSTRATED,
                source=ClaimSource.CV_PARSED,
                confidence_score=0.80,
            ),
            SkillRecord(
                name="PostgreSQL",
                category="DATABASE",
                proficiency="INTERMEDIATE",
                status=SkillVerificationStatus.DEMONSTRATED,
                source=ClaimSource.USER_INPUT,
                confidence_score=0.75,
            ),
            SkillRecord(
                name="GraphQL",
                category="BACKEND",
                proficiency="BEGINNER",
                status=SkillVerificationStatus.UNVERIFIED,
                source=ClaimSource.USER_INPUT,
                confidence_score=0.50,
            ),
        ],
        experiences=[
            ExperienceRecord(
                company="Tech Innovators Sri Lanka",
                role="Software Engineering Intern",
                bullets=[
                    "Developed backend microservices using NestJS and PostgreSQL.",
                    "Built reactive interfaces with React and TypeScript.",
                ],
            )
        ],
        projects=[
            ProjectRecord(
                name="NexCareer AI",
                summary="Supervised multi-agent career platform.",
                technologies=["React", "TypeScript", "NestJS", "PostgreSQL"],
                repoUrl="https://github.com/Mathujan19/NexCareer_AI",
            )
        ],
        education=[],
    )


@pytest.fixture
def sample_job_target() -> JobTarget:
    """Target job: Software Engineering Internship at WSO2 Colombo."""
    return JobTarget(
        id="job_wso2_intern_01",
        title="Software Engineering Intern",
        company="WSO2",
        mandatory_requirements=["React", "TypeScript", "NestJS"],
        preferred_requirements=["Docker", "Kubernetes", "PostgreSQL"],
        raw_text="Looking for a passionate Software Engineering Intern with React, TypeScript, NestJS, and Docker experience.",
    )


def test_1_user_profile_schema_verification(sample_user_profile: UserProfile):
    """Verify User Profile schema, provenance tags, and evidence extraction."""
    verified_skills = sample_user_profile.get_verified_skill_names()

    assert "react" in verified_skills
    assert "typescript" in verified_skills
    assert "nestjs" in verified_skills
    assert "postgresql" in verified_skills
    # GraphQL is UNVERIFIED without evidence, so it is not in verified skills set
    assert "graphql" not in verified_skills

    all_entities = sample_user_profile.get_all_profile_entity_names()
    assert "react" in all_entities
    assert "graphql" in all_entities


def test_2_skill_gap_analyzer(sample_user_profile: UserProfile, sample_job_target: JobTarget):
    """Verify Skill Gap Analyzer correctly classifies demonstrated skills and identifies missing gaps."""
    report = run_skill_gap_analysis(sample_user_profile, sample_job_target)

    assert "React" in report["demonstrated"]
    assert "TypeScript" in report["demonstrated"]
    assert "NestJS" in report["demonstrated"]
    assert "PostgreSQL" in report["demonstrated"]

    # Docker and Kubernetes are not in candidate profile, so they must be confirmed gaps
    assert "Docker" in report["confirmed_gaps"]
    assert "Kubernetes" in report["confirmed_gaps"]

    # Docker was preferred, mandatory skills were all demonstrated
    assert len(report["missing_mandatory"]) == 0
    assert report["match_score"] > 60.0


def test_3_cv_tailoring_agent(sample_user_profile: UserProfile, sample_job_target: JobTarget):
    """Verify CV Tailoring agent crafts STAR bullets using only verified profile claims."""
    gap_report = run_skill_gap_analysis(sample_user_profile, sample_job_target)
    cv_draft = tailor_cv_for_job(sample_user_profile, sample_job_target, gap_report)

    assert "WSO2" in cv_draft["company"]
    assert len(cv_draft["tailored_bullets"]) > 0
    assert "React" in cv_draft["claimed_skills"]

    # Verify that clean draft passes the Deterministic Truth Checker
    truth_result = verify_draft_against_profile(cv_draft, sample_user_profile)
    assert truth_result.is_valid is True
    assert len(truth_result.unverified_violations) == 0


def test_4_deterministic_truth_checker_intercepts_hallucinations(
    sample_user_profile: UserProfile, sample_job_target: JobTarget
):
    """Crucial Test: Verifies that if an LLM hallucinates unverified claims (e.g. Rust / Apache Spark),

    the Deterministic Truth Checker INTERCEPTS and REJECTS the draft.
    """
    gap_report = run_skill_gap_analysis(sample_user_profile, sample_job_target)

    # Artificially inject an unverified hallucination
    hallucinated_draft = tailor_cv_for_job(
        sample_user_profile,
        sample_job_target,
        gap_report,
        inject_hallucination_for_test=True,
    )

    truth_result = verify_draft_against_profile(hallucinated_draft, sample_user_profile)

    # Must be BLOCKED!
    assert truth_result.is_valid is False
    assert "rust" in truth_result.unverified_violations or "apache spark" in truth_result.unverified_violations
    assert "VIOLATION DETECTED" in truth_result.details


def test_5_langgraph_workflow_interrupt_and_human_approval(
    sample_user_profile: UserProfile, sample_job_target: JobTarget
):
    """End-to-End Test:

    1. Executes LangGraph StateGraph
    2. Automatically reaches Checkpoint H2 (Human Approval Gate)
    3. Verifies that LangGraph interrupts execution awaiting human decision
    4. Resumes graph with approval command and confirms document locking.
    """
    checkpointer = MemorySaver()
    graph = create_career_graph(checkpointer=checkpointer)

    thread_id = "test_thread_wso2_001"
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "thread_id": thread_id,
        "user_id": sample_user_profile.user_id,
        "active_intent": "TAILOR_DOCS",
        "user_profile": sample_user_profile.model_dump(),
        "target_job": sample_job_target.model_dump(),
        "audit_trail": [],
    }

    # Step 1: Run graph - it should process Gap Analysis -> CV Tailoring -> Truth Check -> INTERRUPT at H2
    events = list(graph.stream(initial_state, config=config))
    snapshot = graph.get_state(config)

    # Verify execution paused at H2
    assert snapshot.next == ("human_approval_node",)
    assert snapshot.values["truth_check_passed"] is True
    assert snapshot.values["tailored_cv_draft"] is not None
    assert snapshot.values.get("final_document_locked", False) is False

    # Check the interrupt payload presented to the human reviewer
    interrupt_payload = snapshot.tasks[0].interrupts[0].value
    assert interrupt_payload["checkpoint"] == "H2_DOCUMENT_APPROVAL"
    assert interrupt_payload["company"] == "WSO2"
    assert interrupt_payload["requires_human_approval"] is True

    # Step 2: Human signs off and approves the document
    resume_command = Command(resume={"approved": True, "feedback": "Looks great, approved for submission."})
    resume_events = list(graph.stream(resume_command, config=config))
    final_snapshot = graph.get_state(config)

    # Verify graph completed and document is locked
    assert final_snapshot.next == ()
    assert final_snapshot.values["final_document_locked"] is True
    assert final_snapshot.values["user_approval_decision"]["approved"] is True

    # Verify audit trail contains complete provenance log
    agent_names = [entry["agent"] for entry in final_snapshot.values["audit_trail"]]
    assert "GapAnalyzerAgent" in agent_names
    assert "CVOptimizerAgent" in agent_names
    assert "DeterministicTruthChecker" in agent_names
    assert "HumanApprovalGate" in agent_names
    assert "CVSynthesisAgent" in agent_names
