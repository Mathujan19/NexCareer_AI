"""Pydantic schemas and domain models for NexCareer AI."""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SkillVerificationStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    PARTIALLY_DEMONSTRATED = "PARTIALLY_DEMONSTRATED"
    DEMONSTRATED = "DEMONSTRATED"
    CERTIFIED = "CERTIFIED"


class ClaimSource(str, Enum):
    USER_INPUT = "USER_INPUT"
    CV_PARSED = "CV_PARSED"
    GITHUB_ANALYZED = "GITHUB_ANALYZED"
    ASSESSMENT_PASSED = "ASSESSMENT_PASSED"


class SkillEvidenceItem(BaseModel):
    evidence_type: str  # GITHUB_REPO, CERTIFICATE, ACADEMIC_PROJECT
    title: str
    reference_url: Optional[str] = None
    raw_snippet: Optional[str] = None
    verified_at: Optional[str] = None


class SkillRecord(BaseModel):
    name: str
    category: str  # LANGUAGE, FRAMEWORK, DATABASE, DEVOPS, SOFT_SKILL
    proficiency: str = "INTERMEDIATE"
    status: SkillVerificationStatus = SkillVerificationStatus.UNVERIFIED
    source: ClaimSource = ClaimSource.USER_INPUT
    confidence_score: float = 0.50
    evidence: List[SkillEvidenceItem] = Field(default_factory=list)


class ExperienceRecord(BaseModel):
    company: str
    role: str
    bullets: List[str] = Field(default_factory=list)
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False


class EducationRecord(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_year: int
    end_year: Optional[int] = None


class ProjectRecord(BaseModel):
    name: str
    summary: str
    technologies: List[str] = Field(default_factory=list)
    repo_url: Optional[str] = None
    live_demo_url: Optional[str] = None


class UserProfile(BaseModel):
    user_id: str
    full_name: str
    email: str
    headline: Optional[str] = None
    skills: List[SkillRecord] = Field(default_factory=list)
    experiences: List[ExperienceRecord] = Field(default_factory=list)
    education: List[EducationRecord] = Field(default_factory=list)
    projects: List[ProjectRecord] = Field(default_factory=list)

    def get_verified_skill_names(self) -> set[str]:
        """Returns lowercase set of verified or demonstrated skill names."""
        verified = set()
        for s in self.skills:
            if s.status in (
                SkillVerificationStatus.DEMONSTRATED,
                SkillVerificationStatus.CERTIFIED,
            ):
                verified.add(s.name.strip().lower())
            elif s.evidence:
                verified.add(s.name.strip().lower())
        return verified

    def get_all_profile_entity_names(self) -> set[str]:
        """Returns all claimed entities from user profile (skills + project technologies)."""
        entities = set()
        for s in self.skills:
            entities.add(s.name.strip().lower())
        for p in self.projects:
            for tech in p.technologies:
                entities.add(tech.strip().lower())
        return entities


class JobTarget(BaseModel):
    id: str
    title: str
    company: str
    mandatory_requirements: List[str] = Field(default_factory=list)
    preferred_requirements: List[str] = Field(default_factory=list)
    raw_text: str


class SkillGapResult(BaseModel):
    match_score: float
    demonstrated: List[str]
    partially_demonstrated: List[str] = Field(default_factory=list)
    confirmed_gaps: List[str]
    missing_mandatory: List[str] = Field(default_factory=list)
    analysis_rationale: Dict[str, Any] = Field(default_factory=dict)


class TailoredCVDraft(BaseModel):
    version_tag: str
    summary: str
    tailored_bullets: List[str]
    claimed_skills: List[str]
    keyword_matches: List[str]
    fact_verification_passed: bool = False
    verification_errors: List[str] = Field(default_factory=list)


class H2ReviewPayload(BaseModel):
    application_id: str
    company: str
    job_title: str
    tailored_cv: Dict[str, Any]
    detected_gaps: List[str]
    checkpoint: str = "H2_DOCUMENT_APPROVAL"
    requires_approval: bool = True
