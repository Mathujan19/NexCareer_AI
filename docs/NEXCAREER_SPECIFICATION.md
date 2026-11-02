# NexCareer AI — Complete Architecture & System Specification

> Master Reference Document synthesized from the InnovaX 1.0 Proposal and NexCareer AI Platform Specification.
> **Team:** Odyssey (Sabaragamuwa University of Sri Lanka)  
> **Team Members:** V. Mathujan (Lead) & E. Mayoori  
> **Domain:** Domain B: Education & Human Capability

---

## 1. Core Mission & Invariants

**NexCareer AI** is an intelligent, supervised agentic career management platform designed for undergraduates, fresh graduates, internship seekers, and early-career professionals in Sri Lanka and globally.

### Three Non-Negotiable Engineering Invariants
1. **Single Source of Truth (SSOT) & Provenance:**  
   No AI agent may assume, infer, or hallucinate credentials. Every skill, project, metric, and degree is tied to database provenance (`USER_INPUT`, `CV_PARSED`, `GITHUB_ANALYZED`, or `ASSESSMENT_PASSED`).
2. **Deterministic Code First, Cognitive LLM Second:**  
   Standard operations (token refresh, schema validation, deduplication, CRUD, rule verification) run in pure deterministic code. LLMs are invoked strictly for cognitive reasoning (parsing, semantic gap analysis, STAR rewrites).
3. **Hard Human-in-the-Loop (HITL) Checkpoints (H1–H4):**  
   No external mutation (dispatching applications, sending recruiter emails, publishing live portfolios) can execute without an explicit cryptographic user approval token.

---

## 2. The 4 HITL Checkpoints

| Checkpoint | Scope | User Interface / Trigger | Enforcement Mechanism |
|---|---|---|---|
| **H1** | Profile Fact Ingestion | Ingestion from CV, GitHub, or Drive | Items remain `UNVERIFIED` until confirmed by user |
| **H2** | Document Locking | Final Tailored CV & Cover Letter | Documents locked only after explicit user approval |
| **H3** | External Dispatch | Application submission / Recruiter email | State machine halts at LangGraph `interrupt()`; worker validates payload hash before dispatch |
| **H4** | Public Portfolio | Portfolio updates & publishing | No public deployment without user sign-off |

---

## 3. The 12 Core Functions & 4 Agent Teams

Coordinated by the **LangGraph Central Supervisor**:

### Team A — Profile & Portfolio (Identity & Monitoring)
* **01. AI Career Profile (`ProfileMasterAgent`):** Central SSOT profile, confidence scoring, provenance tracking.
* **04. AI Portfolio Builder (`PortfolioBuilderAgent`):** Static site generation, custom domains (`username.nexcareer.lk`), live preview, theme switching, rollback.
* **11. AI Profile Monitor (`SourceWatcherAgent`):** Webhook/delta polling for GitHub commits/repos, Google Drive files, and non-intrusive update recommendations.

### Team B — Job & Skill Intelligence (Market & Gap Analysis)
* **05. AI Job Finder (`JobDiscoveryAgent`):** Ingestion from local feeds (Rooster.lk, TopJobs, XpressJobs), LinkedIn, remote boards. SHA-256 deduplication, 768-dim vector embeddings, transparent 4-factor scoring (Skills 40%, Degree 25%, Experience 20%, Location 15%).
* **06. AI Skill Gap Analyzer (`GapAnalyzerAgent`):** Compares JDs against profile evidence. Classifies into `DEMONSTRATED`, `PARTIALLY_DEMONSTRATED`, `NEEDS_VERIFICATION`, `LEARNING_IN_PROGRESS`, `CONFIRMED_GAP`.
* **07. AI Learning Assistant (`CurriculumAgent`):** Generates step-by-step learning roadmaps, schedules, curated free tutorials, quizzes, and capstone project briefs.
* **12. AI Career Advisor (`StrategicAdvisorAgent`):** Conversational chat interface (multilingual: English, Tamil, Sinhala), career trajectory planning, market demand insights.

### Team C — Document Studio (Paperwork & Tailoring)
* **02. AI CV Builder (`CVSynthesisAgent`):** Generates clean, ATS-compliant JSON resume ASTs from scratch using only verified claims.
* **03. AI CV Optimizer (`CVOptimizerAgent`):** Tailors bullet points to specific JDs using the STAR methodology (Situation, Task, Action, Result). Enforces $\text{Draft Entities} \subseteq \text{Verified Profile Facts}$.
* **08. AI Application Assistant (`ApplicationPrepAgent`):** Bundles tailored CVs, answers application questions, validates form payloads, triggers H3 review modal.

### Team D — Outreach & Tracking (Follow-Through & Telemetry)
* **09. AI Email Assistant (`OutreachMailAgent`):** Drafts recruiter emails, parses incoming interview invites/confirmations, context-aware reply drafting.
* **10. AI Career Tracker (`TelemetryTrackerAgent`):** 12-stage Kanban pipeline (`DISCOVERED` → `SAVED` → `ANALYZING` → `TAILORED` → `AWAITING_USER_APPROVAL` → `APPROVED` → `SUBMITTED` → `SUBMISSION_FAILED` → `INTERVIEW_SCHEDULED` → `OFFERED` → `REJECTED` → `WITHDRAWN`).

---

## 4. Full Technology Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, DnD Kit (Kanban)
* **Backend:** Node.js, NestJS, Prisma ORM, BullMQ (Redis 7 queues), Zod validation, Helmet, Argon2id, JWT
* **Database & Vector:** PostgreSQL 16 + `pgvector` extension (768-dim embeddings)
* **AI & Orchestration:** LangGraph (StateGraph FSM + `interrupt()`), Gemini 2.5 Pro / Flash & Gemma
* **Storage:** S3-compatible object storage (AWS S3 / Cloudflare R2)
* **Integrations:** GitHub OAuth, Google Drive API, Gmail / Microsoft Graph API, Job scraping pipelines

---

## 5. Security & Anti-Hallucination Guardrails

1. **Prompt Injection Defense:** Untrusted text (uploaded CVs, scraped JDs, emails) wrapped in strict `<untrusted_content>` delimiters with zero tool-calling privileges.
2. **Deterministic Post-Generation Linting:** AST parser extracts all claimed companies, degrees, metrics, and tools. If $\text{Extracted Entities} \setminus \text{Verified Profile Facts} \neq \emptyset$, the draft is rejected and regenerated.
3. **Cryptographic Approval Protocol:** DB status `SUBMITTED` requires a signed approval record with SHA-256 payload hash verification.
