"""CurriculumAgent (Agent #07 / Team B) — Learning Path Generator."""
from datetime import datetime, UTC
from typing import Dict, Any, List

LEARNING_RESOURCES = {
    "docker": [{"title": "Docker Getting Started", "url": "https://docs.docker.com/get-started/", "type": "DOCS", "hours": 4}, {"title": "Docker & Kubernetes: The Practical Guide (Udemy)", "url": "https://udemy.com/course/docker-kubernetes-the-practical-guide/", "type": "COURSE", "hours": 23}],
    "kubernetes": [{"title": "Kubernetes Basics (k8s.io)", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "type": "DOCS", "hours": 6}],
    "jest": [{"title": "Jest Official Docs", "url": "https://jestjs.io/docs/getting-started", "type": "DOCS", "hours": 3}, {"title": "Testing JavaScript with Jest (freeCodeCamp)", "url": "https://freecodecamp.org/news/how-to-test-javascript-with-jest/", "type": "ARTICLE", "hours": 2}],
    "postgresql": [{"title": "PostgreSQL Tutorial", "url": "https://www.postgresqltutorial.com/", "type": "TUTORIAL", "hours": 8}],
    "python": [{"title": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "DOCS", "hours": 10}],
    "fastapi": [{"title": "FastAPI Official Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "type": "DOCS", "hours": 6}],
    "default": [{"title": "MDN Web Docs", "url": "https://developer.mozilla.org/", "type": "DOCS", "hours": 3}],
}

CAPSTONE_TEMPLATES = {
    "docker": "Containerize your existing NexCareer API using a multi-stage Dockerfile and docker-compose.yml. Add a PostgreSQL service and document in README.",
    "jest": "Write 10 Jest + Supertest integration tests for your NestJS API covering happy paths and error cases. Target 80% coverage.",
    "kubernetes": "Deploy your Dockerized app to a local minikube cluster with 2 replicas. Write a K8s deployment YAML.",
    "default": "Build a focused mini-project demonstrating the skill and push to GitHub with a detailed README.",
}


def generate_learning_path(confirmed_gaps: List[str], weekly_hours: int = 10) -> Dict[str, Any]:
    """Generates a sequenced learning roadmap for identified skill gaps."""
    roadmap = []
    total_hours = 0
    
    for gap in confirmed_gaps[:5]:
        gap_lower = gap.lower()
        resources = LEARNING_RESOURCES.get(gap_lower, LEARNING_RESOURCES["default"])
        capstone = CAPSTONE_TEMPLATES.get(gap_lower, CAPSTONE_TEMPLATES["default"])
        gap_hours = sum(r["hours"] for r in resources)
        total_hours += gap_hours
        
        roadmap.append({
            "skill": gap,
            "priority": "HIGH" if gap_lower in ["docker", "jest", "kubernetes"] else "MEDIUM",
            "estimated_hours": gap_hours,
            "estimated_weeks": max(1, round(gap_hours / weekly_hours)),
            "resources": resources,
            "capstone_project": capstone,
        })
    
    roadmap.sort(key=lambda x: (x["priority"] != "HIGH", x["estimated_hours"]))
    
    return {
        "roadmap": roadmap,
        "total_gaps_addressed": len(roadmap),
        "total_estimated_hours": total_hours,
        "total_estimated_weeks": max(1, round(total_hours / weekly_hours)),
        "generated_at": datetime.now(UTC).isoformat(),
        "agent": "CurriculumAgent",
    }
