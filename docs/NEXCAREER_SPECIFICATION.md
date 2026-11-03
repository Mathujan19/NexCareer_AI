# NexCareer AI — Complete Architecture & System Specification

> **Project:** NexCareer AI — Supervised Multi-Agent Career Management Platform  
> **Competition:** InnovaX 1.0 — *Domain B: Education & Human Capability*  
> **Institution:** Sabaragamuwa University of Sri Lanka  
> **Team:** Odyssey  
> **Team Members:**  
> • **V. Mathujan** (Lead) — `200225000215` — `Vimalarajahmathujan@gmail.com` — `+94 75 491 8124`  
> • **E. Mayoori** — `200283600024` — `mayooriekanthan12@gmail.com` — `+94 77 152 2504`  
> **Repository:** `https://github.com/Mathujan19/NexCareer_AI.git`  
> **Target Branch:** `feature/base-layer`

---

## 1. Executive Summary & Problem Statement

### The Problem
Undergraduate students and fresh graduates in Sri Lanka struggle to manage their career journeys because data and workflows are scattered across fragmented platforms (CVs in Word/Canva, code on GitHub, certificates in Google Drive, job applications in email/spreadsheets, and learning resources on YouTube/Coursera).

### Three Critical Vulnerabilities in Current Tools
1. **Unverified Skill Claims:** Candidates are unsure which skills a job requires and whether they possess credible evidence.
2. **AI Hallucinations in CV Builders:** Existing AI CV tools invent qualifications, tools, or metrics the user never had, destroying applicant credibility with technical recruiters.
3. **No Centralized Application & Deadline Tracking:** Job seekers lack a unified system to monitor application statuses, deadlines, and follow-ups.

### The NexCareer AI Solution
NexCareer AI creates a **Single Source of Truth (SSOT)** called the **Unified Career Profile**, where every skill is tied to verified evidence (GitHub commits, certificates, or passed platform assessments). A central **LangGraph Multi-Agent Supervisor** coordinates specialized agent teams, enforces **Deterministic Truth Guardrails**, and pauses execution at **Human-in-the-Loop Approval Gates (H1–H4)** before any document or external action is finalized.

### Sri Lankan Ecosystem Localization 🇱🇰
- **Local Salary Expectations:** Built-in compensation benchmarking in Sri Lankan Rupees (**LKR**).
- **Target Job Hubs:** Colombo, Kandy, Jaffna, Galle, and Global Remote.
- **Multilingual Support:** English, Sinhala, and Tamil support for the AI Career Chat Assistant and curated learning video recommendations.

---

## 2. The Three Non-Negotiable Engineering Invariants

| # | Invariant | Enforcement Principle |
|---|---|---|
| **1** | **Single Source of Truth (SSOT) & Provenance** | No AI agent may assume, infer, or fabricate user qualifications. Every credential, project, and skill is tagged with strict database provenance (`USER_INPUT`, `CV_PARSED`, `GITHUB_ANALYZED`, or `ASSESSMENT_PASSED`). |
| **2** | **Deterministic Code First, Cognitive LLM Second** | Predictable operations (token refreshes, schema validations, duplicate detection, DB CRUD, rule checks) run in pure deterministic code. LLMs are invoked strictly for cognitive tasks (semantic gap synthesis, STAR bullet formulation). |
| **3** | **Hard Human-in-the-Loop (HITL) Checkpoints** | No irreversible external action (dispatching applications, emailing recruiters, or publishing portfolios) can occur without an explicit, cryptographically verified user approval token. |

---

## 3. Human-in-the-Loop (HITL) Checkpoints

```
[External Ingestion] ──► [H1: Profile Fact Confirmation] ──► Stored in Unified Profile
                                                                   │
                                                                   ▼
[Job Description]   ──► [Skill Gap & CV Tailoring]      ──► [H2: CV Review & Lock Modal]
                                                                   │
                                                                   ▼
[Application Prep]  ──► [Outreach & Mail Draft]         ──► [H3: Dispatch Approval Gate]
                                                                   │
                                                                   ▼
[Portfolio Builder] ──► [Static Site Generator]         ──► [H4: Public Publish Sign-off]
```

- **H1 (Profile Confirmation):** Facts imported from external files or suggested by AI remain `UNVERIFIED` until explicitly confirmed by the user.
- **H2 (Document Review & Lock):** Tailored CVs and cover letters pause graph execution via LangGraph `interrupt()`; documents are locked only after user review.
- **H3 (Dispatch Gate):** Outbound emails or portal submissions require a signed approval record with SHA-256 payload verification before worker execution.
- **H4 (Portfolio Publishing):** Web portfolios are held in staging/preview mode until the user clicks approve to deploy live.

---

## 4. The 4 Agent Teams & 12 Specialized Core Functions

```
                             ┌─────────────────────────────────┐
                             │    LangGraph Supervisor FSM     │
                             │  (Central Intent Orchestrator)  │
                             └────────────────┬────────────────┘
                                              │
         ┌───────────────────┬────────────────┴────────────────┬───────────────────┐
         ▼                   ▼                                 ▼                   ▼
   ┌───────────┐       ┌───────────┐                     ┌───────────┐       ┌───────────┐
   │  Team A   │       │  Team B   │                     │  Team C   │       │  Team D   │
   │ Profile & │       │Job & Skill│                     │ Document  │       │Outreach & │
   │ Portfolio │       │Intelligence                     │  Studio   │       │ Tracking  │
   └───────────┘       └───────────┘                     └───────────┘       └───────────┘
```

### Team A — Profile & Portfolio (Identity & Monitoring)
1. **01. AI Career Profile (`ProfileMasterAgent`):** Ingests raw inputs, normalizes entities, tracks provenance, and maintains baseline skills.
2. **04. AI Portfolio Builder (`PortfolioBuilderAgent`):** Compiles verified projects, GitHub stats, and credentials into customizable static web templates with live preview and custom subdomain hosting (`username.nexcareer.lk`).
3. **11. AI Profile Monitor (`SourceWatcherAgent`):** Watches authorized GitHub repos (commits, PRs) and Google Drive folders to recommend profile and portfolio updates. Never claims mastery solely from a library appearing in a repository.

### Team B — Job & Skill Intelligence (Market & Gap Analysis)
4. **05. AI Job Finder (`JobDiscoveryAgent`):** Ingests listings from local feeds (Rooster.lk, TopJobs, XpressJobs), LinkedIn, and remote platforms. Computes SHA-256 deduplication and transparent 4-pillar match scoring:
   - *Skill Alignment:* 40%
   - *Eligibility/Degree:* 25%
   - *Experience Level:* 20%
   - *Location / Remote Preference:* 15%
5. **06. AI Skill Gap Analyzer (`GapAnalyzerAgent`):** Performs matrix comparisons classifying requirements into 5 statuses: `DEMONSTRATED`, `PARTIALLY_DEMONSTRATED`, `NEEDS_VERIFICATION`, `LEARNING_IN_PROGRESS`, or `CONFIRMED_GAP`. Distinguishes Mandatory from Preferred requirements.
6. **07. AI Learning Assistant (`CurriculumAgent`):** Sequences prerequisite learning paths, schedules weekly study hours, recommends vetted free resources, and generates capstone project briefs and quizzes.
7. **12. AI Career Advisor (`StrategicAdvisorAgent`):** Natural-language conversational interface supporting English, Sinhala, and Tamil. Breaks down user career queries and outlines actionable next steps.

### Team C — Document Studio (Paperwork & Tailoring)
8. **02. AI CV Builder (`CVSynthesisAgent`):** Compiles standard, ATS-compliant single-column JSON ASTs strictly from verified profile records.
9. **03. AI CV Optimizer (`CVOptimizerAgent`):** Aligns experience and project bullets to target job descriptions using the **STAR methodology** (Situation, Task, Action, Result).
10. **08. AI Application Assistant (`ApplicationPrepAgent`):** Bundles tailored CVs, answers application questions, verifies required fields, and triggers the Checkpoint H2/H3 review modal.

### Team D — Outreach & Tracking (Follow-Through & Telemetry)
11. **09. AI Email Assistant (`OutreachMailAgent`):** Drafts cover emails, parses recruiter responses and interview invites, and prepares context-aware follow-ups for user approval.
12. **10. AI Career Tracker (`TelemetryTrackerAgent`):** Manages the 12-stage Kanban state machine:
    $$\text{DISCOVERED} \to \text{SAVED} \to \text{ANALYZING} \to \text{TAILORED} \to \text{AWAITING\_USER\_APPROVAL} \to \text{APPROVED} \to \text{SUBMITTED} \to \text{INTERVIEW} \to \text{OFFER} / \text{REJECTED}$$

---

## 5. Deterministic Anti-Hallucination Guardrails

To protect student and graduate credibility, the system enforces mathematical set-difference checking:

```
                  [ Draft Bullet / AST Generated by LLM ]
                                     │
                                     ▼
                        [ Entity Extraction Pass ]
              (Pulls all tools, companies, metrics, and degrees)
                                     │
                                     ▼
            ┌──────────────────────────────────────────────────┐
            │         Deterministic Intersection Check         │
            │  Extracted Entities ⊆ Verified Profile DB Claims  │
            └─────────┬──────────────────────────────┬─────────┘
                      │ YES                          │ NO
                      ▼                              ▼
             [ Allow Generation ]           [ REJECT & INTERCEPT ]
                      │                              │
                      ▼                              ▼
            [ Route to H2 Modal ]         [ Log Audit Error & Abort ]
```

$$\text{Extracted Entities} \setminus \text{Verified Profile Facts} = \emptyset$$

If any claimed tool, framework, or degree in the draft is missing from the candidate's verified profile, the generation is **aborted** and logged as an audit failure.

---

## 6. 5-Tier Production Architecture Stack

| Tier | Technology Stack | Responsibility |
|---|---|---|
| **Tier 1: Client** | React 19, TypeScript, Vite, Tailwind CSS, DnD Kit, Lucide Icons | Responsive Kanban board, portfolio editor, CV diff viewer, H1–H4 approval modals |
| **Tier 2: API Gateway** | NestJS / Node.js, Zod, Helmet, Argon2id, JWT | Route guarding, tenant isolation, rate limiting, and schema validation |
| **Tier 3: Asynchronous Workers** | BullMQ + Redis 7 | Scheduled scrapers, background delta syncs, and email parsing jobs |
| **Tier 4: AI & Orchestrator** | LangGraph StateGraph, Gemini 2.5 / Gemma, FastAPI | Stateful agent execution, structured JSON outputs, and `interrupt()` checkpoints |
| **Tier 5: Persistence & Vector** | PostgreSQL 16 + `pgvector` + S3 / Cloudflare R2 | Relational state, 768-dim embeddings, encrypted OAuth secrets, and PDF storage |

---

## 7. PostgreSQL Normalized Database Schema

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(32),
    location_country VARCHAR(64) DEFAULT 'Sri Lanka',
    location_city VARCHAR(64) DEFAULT 'Colombo',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills with Strict Source Tracking & Evidence
CREATE TYPE skill_verification_status AS ENUM (
    'UNVERIFIED', 'PARTIALLY_DEMONSTRATED', 'DEMONSTRATED', 'CERTIFIED'
);
CREATE TYPE claim_source AS ENUM (
    'USER_INPUT', 'CV_PARSED', 'GITHUB_ANALYZED', 'ASSESSMENT_PASSED'
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(64) NOT NULL,
    proficiency VARCHAR(32) DEFAULT 'INTERMEDIATE',
    status skill_verification_status DEFAULT 'UNVERIFIED',
    source claim_source DEFAULT 'USER_INPUT',
    confidence_score NUMERIC(3, 2) DEFAULT 0.50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE TABLE skill_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    evidence_type VARCHAR(64) NOT NULL,
    reference_url TEXT,
    title VARCHAR(255) NOT NULL,
    raw_snippet TEXT,
    verified_at TIMESTAMPTZ
);

-- 3. Job Listings
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(64) NOT NULL,
    external_id VARCHAR(255),
    company_name VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    is_remote BOOLEAN DEFAULT FALSE,
    employment_type VARCHAR(64) DEFAULT 'FULL_TIME',
    raw_description TEXT NOT NULL,
    normalized_skills TEXT[] DEFAULT '{}',
    deadline TIMESTAMPTZ,
    url TEXT,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source, external_id)
);

-- 4. Applications & State Machine
CREATE TYPE app_status_enum AS ENUM (
    'DISCOVERED', 'SAVED', 'ANALYZING', 'TAILORED', 
    'AWAITING_USER_APPROVAL', 'APPROVED', 'SUBMITTED', 
    'SUBMISSION_FAILED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED', 'WITHDRAWN'
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    cv_version_id UUID,
    status app_status_enum DEFAULT 'DISCOVERED',
    submission_channel VARCHAR(64) DEFAULT 'MANUAL',
    submitted_at TIMESTAMPTZ,
    last_agent_action VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Human-in-the-Loop Approval Ledger
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    payload_sha256 CHAR(64),
    is_approved BOOLEAN DEFAULT FALSE,
    is_rejected BOOLEAN DEFAULT FALSE,
    user_rejection_reason TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Collaborator Setup & Runbook

### Prerequisites
1. **Git**
2. **Node.js** (v20+ or v22.x) with npm
3. **Python** (v3.10+) with `python.exe` added to PATH
4. **PostgreSQL** (v15/v16)

### Installation Commands

```bash
# 1. Clone & Switch to Feature Branch
git clone https://github.com/Mathujan19/NexCareer_AI.git
cd NexCareer_AI
git checkout feature/base-layer

# 2. Install Node.js Workspaces (Frontend + Backend)
npm install

# 3. Setup Python Virtual Environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# 4. Configure Environment Variables
Copy-Item backend\.env.example .env
Copy-Item backend\.env.example backend\.env

# 5. Generate Prisma ORM Client
npm run prisma:generate

# 6. Run Test Suite (8/8 Tests Must Pass)
.\venv\Scripts\pytest.exe -o pythonpath=. -v tests/
```

### Launching Local Services

| Service | Port | Local URL | Launch Command |
|---|---|---|---|
| **AI Agent Orchestrator** | `8000` | `http://127.0.0.1:8000` | `.\venv\Scripts\uvicorn.exe ai_agents.main:app --port 8000 --reload` |
| **React 19 Frontend** | `5173` | `http://localhost:5173` | `npm run dev:frontend` |
| **NestJS Backend Gateway** | `3000` | `http://localhost:3000` | `npm run dev:backend` |

---

## 9. Team Git Branching & Commit Standards

- **Branch Naming**:
  - `feature/<feature-name>` (e.g., `feature/cv-editor`, `feature/job-scraper`)
  - `fix/<bug-name>`
  - `chore/<task-name>`
- **Commit Convention**:
  ```text
  [NEXCAREER_AI] YYYY-MM-DD | <Type>: <Description>
  ```
  *Example:*
  ```bash
  git commit -m "[NEXCAREER_AI] 2026-11-03 | Feat: Setup base layer monorepo, Prisma schema, and LangGraph Golden Path"
  ```
