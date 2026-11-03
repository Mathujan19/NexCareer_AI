"""API Endpoint integration tests for the NexCareer AI Agent Orchestrator."""

from fastapi.testclient import TestClient
from ai_agents.main import app

client = TestClient(app)


def test_api_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "LangGraph StateGraph" in data["framework"]


def test_api_golden_path_flow():
    user_profile = {
        "user_id": "usr_mathujan_01",
        "full_name": "Mathujan Vimalarajah",
        "email": "vimalarajahmathujan@gmail.com",
        "skills": [
            {
                "name": "React",
                "category": "FRONTEND",
                "proficiency": "ADVANCED",
                "status": "DEMONSTRATED",
                "source": "GITHUB_ANALYZED",
                "confidence_score": 0.95,
                "evidence": [
                    {
                        "evidence_type": "GITHUB_REPO",
                        "title": "NexCareer AI",
                        "reference_url": "https://github.com/Mathujan19/NexCareer_AI",
                    }
                ],
            },
            {
                "name": "NestJS",
                "category": "BACKEND",
                "proficiency": "INTERMEDIATE",
                "status": "DEMONSTRATED",
                "source": "CV_PARSED",
                "confidence_score": 0.85,
                "evidence": [],
            },
        ],
        "experiences": [
            {
                "company": "Tech Odyssey",
                "role": "Full Stack Intern",
                "bullets": ["Engineered frontend features using React."],
            }
        ],
        "projects": [],
        "education": [],
    }

    target_job = {
        "id": "job_wso2_01",
        "title": "Frontend Engineer",
        "company": "WSO2",
        "mandatory_requirements": ["React"],
        "preferred_requirements": ["Docker"],
        "raw_text": "Seeking Frontend Engineer with React.",
    }

    # Step 1: Start workflow -> should execute until Checkpoint H2 interrupt
    res = client.post(
        "/api/agents/analyze-and-tailor",
        json={"user_profile": user_profile, "target_job": target_job},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["is_interrupted"] is True
    assert data["approval_payload"]["checkpoint"] == "H2_DOCUMENT_APPROVAL"
    assert data["approval_payload"]["company"] == "WSO2"
    assert data["state_values"]["truth_check_passed"] is True
    assert data["state_values"]["final_document_locked"] is False

    thread_id = data["thread_id"]

    # Step 2: Human signs off via Checkpoint H2 approval endpoint
    approve_res = client.post(
        "/api/agents/approve-cv",
        json={"thread_id": thread_id, "approved": True, "user_feedback": "Approved by candidate."},
    )
    assert approve_res.status_code == 200
    approve_data = approve_res.json()

    assert approve_data["status"] == "APPROVED_AND_LOCKED"
    assert approve_data["final_document_locked"] is True


def test_api_truth_checker_blocking():
    user_profile = {
        "user_id": "usr_01",
        "full_name": "Test User",
        "email": "test@example.com",
        "skills": [{"name": "React", "category": "FRONTEND", "status": "DEMONSTRATED"}],
        "experiences": [],
        "projects": [],
        "education": [],
    }

    # CV draft claiming Rust which candidate never possessed
    fake_cv_draft = {
        "claimed_skills": ["React", "Rust"],
        "summary": "Full stack engineer with Rust experience.",
        "tailored_bullets": ["Built high-performance systems with Rust."],
    }

    res = client.post(
        "/api/agents/verify-truth",
        json={"user_profile": user_profile, "cv_draft": fake_cv_draft},
    )
    assert res.status_code == 200
    data = res.json()

    assert data["is_valid"] is False
    assert "rust" in data["unverified_violations"]
    assert "VIOLATION DETECTED" in data["details"]
