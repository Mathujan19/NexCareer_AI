# NexCareer AI 🚀

> A supervised multi-agent career management platform that perceives career-relevant changes, reasons over verified evidence, acts through real tools, and loops until the user approves the result.

Developed by **Team Odyssey** (Sabaragamuwa University of Sri Lanka) for **InnovaX 1.0** — *Domain B: Education & Human Capability*.

---

## 📌 Overview
**NexCareer AI** brings the entire job search and career development journey into a single, evidence-backed workspace. Instead of hallucinating unverified skills, the platform builds a **Unified Career Profile** from verified sources (CVs, GitHub repositories, Google Drive files, and user confirmations) and enforces a **Deterministic Truth Checker** along with **Human-in-the-Loop Approval Gates (H1–H4)** before any document or action is finalized.

### Localization Support 🇱🇰
Designed for the Sri Lankan tech and graduate ecosystem (LKR salary alignment, local qualification standards) with multilingual support (**English, Tamil, and Sinhala**) in the AI chat assistant and learning roadmap recommendations.

---

## 🤖 Multi-Agent Architecture
Coordinated by a central **LangGraph Supervisor** powered by **Gemma**, the platform operates across four specialized agent teams:

* **Team A — Profile & Portfolio:** `Career Profile`, `Profile Monitor`, `Portfolio Builder` (Maintains unified profile, syncs GitHub/Drive updates, recommends portfolio improvements).
* **Team B — Job & Skill Intelligence:** `Job Finder`, `Skill Gap Analyzer`, `Learning Assistant` (Compares job requirements against verified evidence and builds targeted learning roadmaps).
* **Team C — Document Studio:** `CV Builder`, `CV Optimizer`, `Application Assistant` (Generates ATS-friendly, tailored CVs and cover letters strictly grounded in verified user data).
* **Team D — Outreach & Tracking:** `Email Assistant`, `Career Tracker`, `Career Advisor` (Tracks applications, deadlines, follow-ups, and drafts recruiter communications).

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, DnD Kit
* **Backend / API:** Node.js, NestJS, Prisma ORM, JWT Auth, Zod Validation
* **AI & Orchestration:** LangGraph, Gemma 4-e4b
* **Database:** PostgreSQL with `pgvector`
* **Queue & Background Jobs:** BullMQ with Redis
* **Storage:** AWS S3 Compatible Storage
* **Integrations:** GitHub OAuth, Google Drive API, Gmail API
* **Deployment:** Docker

---

## 🛡️ Human-in-the-Loop Checkpoints
* **H1:** Confirm profile facts imported from external sources or suggested by AI.
* **H2:** Review and lock final tailored CVs and cover letters.
* **H3:** Approve job application submissions or recruiter emails via payload hash verification.
* **H4:** Approve portfolio updates prior to publishing.

---

## 👥 Team Odyssey
* **V. Mathujan**
* **E. Mayoori**
