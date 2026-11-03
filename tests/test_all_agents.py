"""Comprehensive unit test suite for all 11 NexCareer AI Agents across Teams A, B, C, and D."""

import pytest
from ai_agents.schemas import UserProfile, SkillRecord, SkillVerificationStatus, ClaimSource, JobTarget
from ai_agents.agents.profile_master import ingest_and_normalize_profile
from ai_agents.agents.portfolio_builder import build_portfolio
from ai_agents.agents.source_watcher import check_profile_staleness
from ai_agents.agents.job_discovery import discover_jobs
from ai_agents.agents.gap_analyzer import run_skill_gap_analysis
from ai_agents.agents.learning_assistant import generate_learning_path
from ai_agents.agents.career_advisor import advise
from ai_agents.agents.cv_tailoring import tailor_cv_for_job
from ai_agents.guardrails.truth_checker import verify_draft_against_profile
from ai_agents.agents.application_prep import prepare_application_bundle
from ai_agents.agents.outreach_mail import draft_outreach_email
from ai_agents.agents.career_tracker import transition_application_status, get_kanban_board


@pytest.fixture
def mock_profile_data():
    return {
        "user_id": "usr_test_01",
        "full_name": "Mathujan Vimalarajah",
        "email": "vimalarajahmathujan@gmail.com",
        "headline": "Full-Stack Engineer Undergraduate",
        "skills": [
            {"name": "React", "category": "FRONTEND", "proficiency": "ADVANCED", "status": "DEMONSTRATED", "source": "GITHUB_ANALYZED", "confidence_score": 0.9, "evidence": []},
            {"name": "TypeScript", "category": "LANGUAGE", "proficiency": "INTERMEDIATE", "status": "DEMONSTRATED", "source": "GITHUB_ANALYZED", "confidence_score": 0.85, "evidence": []},
            {"name": "NestJS", "category": "BACKEND", "proficiency": "INTERMEDIATE", "status": "DEMONSTRATED", "source": "CV_PARSED", "confidence_score": 0.80, "evidence": []},
        ],
        "experiences": [
            {"company": "Tech Corp", "role": "Intern", "bullets": ["Built microservices in NestJS."], "location": "Colombo", "start_date": "2025-01", "is_current": False}
        ],
        "education": [
            {"institution": "SUSL", "degree": "B.Sc.", "start_year": 2022}
        ],
        "projects": [
            {"name": "NexCareer AI", "summary": "Multi-agent career platform", "technologies": ["React", "TypeScript", "NestJS"]}
        ]
    }


@pytest.fixture
def mock_job_data():
    return {
        "id": "job_wso2_01",
        "title": "Software Engineering Intern",
        "company": "WSO2",
        "mandatory_requirements": ["React", "TypeScript", "NestJS"],
        "preferred_requirements": ["Docker", "Kubernetes"],
        "raw_text": "Software Engineering Intern at WSO2 with React and NestJS."
    }


def test_agent_01_profile_master(mock_profile_data):
    """Team A: ProfileMasterAgent normalizes profile and calculates completeness score."""
    result = ingest_and_normalize_profile(mock_profile_data)
    assert result["status"] == "NORMALIZED"
    assert result["user_id"] == "usr_test_01"
    assert result["verified_skills_count"] == 3
    assert result["completeness_score"] == 100.0


def test_agent_04_portfolio_builder(mock_profile_data):
    """Team A: PortfolioBuilderAgent compiles verified credentials into static portfolio schema."""
    result = build_portfolio(mock_profile_data, theme="cyber")
    assert result["status"] == "READY_FOR_PREVIEW"
    assert result["theme"] == "cyber"
    assert "nexcareer.lk" in result["subdomain"]
    assert len(result["sections"]) >= 3


def test_agent_11_source_watcher():
    """Team A: SourceWatcherAgent monitors GitHub commits and profile staleness."""
    stale_date = "2025-01-01T00:00:00Z"
    result = check_profile_staleness("usr_test_01", stale_date, "Mathujan19")
    assert result["is_stale"] is True
    assert result["staleness_level"] == "HIGH"
    assert len(result["recommendations"]) >= 1


def test_agent_05_job_discovery(mock_profile_data):
    """Team B: JobDiscoveryAgent scores and ranks discovered listings."""
    result = discover_jobs(mock_profile_data, limit=5)
    assert result["total_found"] > 0
    assert "jobs" in result
    assert result["jobs"][0]["match_score"] >= 60.0
    assert "dedup_hash" in result["jobs"][0]


def test_agent_06_gap_analyzer(mock_profile_data, mock_job_data):
    """Team B: GapAnalyzerAgent identifies demonstrated skills vs confirmed gaps."""
    profile = UserProfile(**mock_profile_data)
    job = JobTarget(**mock_job_data)
    result = run_skill_gap_analysis(profile, job)
    assert "React" in result["demonstrated"]
    assert "Docker" in result["confirmed_gaps"]
    assert result["match_score"] == 60.0


def test_agent_07_learning_assistant():
    """Team B: CurriculumAgent generates a structured learning roadmap for gaps."""
    gaps = ["Docker", "Kubernetes", "Jest"]
    result = generate_learning_path(gaps, weekly_hours=10)
    assert result["total_gaps_addressed"] == 3
    assert result["total_estimated_hours"] > 0
    assert len(result["roadmap"]) == 3
    assert result["roadmap"][0]["capstone_project"] is not None


def test_agent_12_career_advisor():
    """Team B: StrategicAdvisorAgent provides localized career advice."""
    res_salary = advise("What is the average internship salary in Colombo?", "usr_01")
    assert "LKR" in res_salary["reply"]

    res_gap = advise("What are my skill gaps?", "usr_01", context={"gaps": ["Docker", "Jest"]})
    assert "Docker" in res_gap["reply"]


def test_agent_02_03_cv_tailoring_and_truth_guardrail(mock_profile_data, mock_job_data):
    """Team C: CVSynthesisAgent & CVOptimizerAgent craft STAR bullets verified by Truth Checker."""
    profile = UserProfile(**mock_profile_data)
    job = JobTarget(**mock_job_data)
    gap_report = run_skill_gap_analysis(profile, job)
    cv_draft = tailor_cv_for_job(profile, job, gap_report)
    assert "WSO2" in cv_draft["company"]

    # Truth checker verification
    truth = verify_draft_against_profile(cv_draft, profile)
    assert truth.is_valid is True


def test_agent_08_application_prep(mock_profile_data, mock_job_data):
    """Team C: ApplicationPrepAgent bundles application with SHA-256 payload verification."""
    tailored_cv = {"version_tag": "v1.0-wso2", "summary": "Tailored CV"}
    bundle = prepare_application_bundle(mock_profile_data, mock_job_data, tailored_cv)
    assert bundle["status"] == "AWAITING_H3_APPROVAL"
    assert len(bundle["payload_sha256"]) == 64
    assert bundle["requires_human_approval"] is True


def test_agent_09_outreach_mail(mock_profile_data, mock_job_data):
    """Team D: OutreachMailAgent drafts personalized recruiter emails."""
    result = draft_outreach_email(mock_profile_data, mock_job_data, email_type="APPLICATION")
    assert "WSO2" in result["subject"]
    assert "Mathujan Vimalarajah" in result["body"]
    assert result["status"] == "DRAFT_READY_FOR_H3_APPROVAL"


def test_agent_10_career_tracker():
    """Team D: TelemetryTrackerAgent manages 12-stage state machine transitions & Kanban."""
    transition = transition_application_status("app_01", "SAVED", "TAILORED", "usr_01")
    assert transition["is_forward_transition"] is True
    assert transition["new_status"] == "TAILORED"

    # Terminal state protection
    terminal = transition_application_status("app_01", "REJECTED", "SUBMITTED", "usr_01")
    assert "error" in terminal

    # Kanban board aggregation
    sample_apps = [
        {"id": "a1", "company": "WSO2", "status": "TAILORED"},
        {"id": "a2", "company": "Sysco", "status": "DISCOVERED"},
    ]
    board = get_kanban_board(sample_apps)
    assert len(board["board"]["TAILORED"]) == 1
    assert len(board["board"]["DISCOVERED"]) == 1
    assert board["active_applications"] == 2
