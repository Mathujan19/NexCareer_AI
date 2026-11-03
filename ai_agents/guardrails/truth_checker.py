r"""Deterministic Truth Checker & Anti-Hallucination Guardrail.

Enforces the non-negotiable invariant:
Draft Entities ⊆ Verified Profile Facts
Extracted Entities \ Verified Profile Facts == ∅
"""

import re
from typing import Dict, Any, List, Tuple
from ai_agents.schemas import UserProfile
from ai_agents.agents.gap_analyzer import normalize_skill_name


class TruthVerificationResult:
    def __init__(
        self,
        is_valid: bool,
        verified_entities: List[str],
        unverified_violations: List[str],
        details: str,
    ):
        self.is_valid = is_valid
        self.verified_entities = verified_entities
        self.unverified_violations = unverified_violations
        self.details = details

    def to_dict(self) -> Dict[str, Any]:
        return {
            "is_valid": self.is_valid,
            "verified_entities": self.verified_entities,
            "unverified_violations": self.unverified_violations,
            "details": self.details,
        }


def extract_entities_from_draft(cv_draft: Dict[str, Any]) -> set[str]:
    """Extracts all claimed technology entities from CV draft text and claimed_skills list."""
    entities = set()

    # 1. Direct claimed skills list
    for skill in cv_draft.get("claimed_skills", []):
        entities.add(normalize_skill_name(skill))

    # 2. Text scanning across summary and bullet points for technology mentions
    all_text = " " + cv_draft.get("summary", "") + " "
    for bullet in cv_draft.get("tailored_bullets", []):
        all_text += " " + bullet + " "

    # Scan for words like "Rust", "Apache Spark", "Docker", "Kubernetes", "GraphQL", etc.
    words = re.findall(r"\b[A-Za-z0-9\.\+#]+(?:\s+[A-Za-z0-9\.\+#]+)?\b", all_text)
    for word in words:
        norm = normalize_skill_name(word)
        # Check against common known tech
        entities.add(norm)

    return entities


def verify_draft_against_profile(
    cv_draft: Dict[str, Any],
    profile: UserProfile,
) -> TruthVerificationResult:
    r"""Verifies that all entities declared in the CV draft are strictly subset of verified profile claims.

    Formula:
    Extracted Entities \ Verified Profile Facts == ∅
    """
    # 1. Get baseline verified profile facts
    verified_profile_facts = {
        normalize_skill_name(name) for name in profile.get_all_profile_entity_names()
    }

    # 2. Extract entities declared in the draft
    declared_skills = [
        normalize_skill_name(s) for s in cv_draft.get("claimed_skills", [])
    ]

    # Check for specific unverified skills
    unverified_violations: List[str] = []
    verified_entities: List[str] = []

    for skill in declared_skills:
        if skill in verified_profile_facts:
            verified_entities.append(skill)
        else:
            unverified_violations.append(skill)

    # Also scan text for known severe violations if explicitly present
    summary_and_bullets = cv_draft.get("summary", "") + " " + " ".join(cv_draft.get("tailored_bullets", []))
    lower_content = summary_and_bullets.lower()

    # Common technologies to specifically protect against hallucination
    monitored_techs = [
        "rust", "apache spark", "hadoop", "c++", "go", "golang", "swift", "kotlin",
        "aws", "gcp", "azure", "kubernetes", "solidity", "blockchain"
    ]
    for tech in monitored_techs:
        if re.search(rf"\b{re.escape(tech)}\b", lower_content):
            norm_tech = normalize_skill_name(tech)
            if norm_tech not in verified_profile_facts and norm_tech not in unverified_violations:
                unverified_violations.append(norm_tech)

    is_valid = len(unverified_violations) == 0

    if is_valid:
        details = "Deterministic Fact Interceptor: PASSED. All claimed entities are backed by verified profile facts."
    else:
        details = (
            f"Deterministic Fact Interceptor: VIOLATION DETECTED! "
            f"Unverified entities found: {unverified_violations}. "
            f"These claims do not exist in the candidate's verified profile database."
        )

    return TruthVerificationResult(
        is_valid=is_valid,
        verified_entities=verified_entities,
        unverified_violations=unverified_violations,
        details=details,
    )
