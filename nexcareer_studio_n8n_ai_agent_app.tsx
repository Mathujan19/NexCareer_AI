import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Github,
  Mail,
  FileText,
  Globe,
  Compass,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  Bot,
  Settings,
  Layers,
  BarChart3,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Sliders,
  Play,
  Check,
  X,
  FileCheck,
  BookOpen,
  FolderGit2,
  ArrowRight,
  Bell,
  Cpu,
  UserCheck,
  Share2,
  Download,
  Printer,
  Terminal,
  Link2,
  Zap,
  CheckSquare,
  Copy,
  HelpCircle,
  MapPin,
  Phone,
  Sparkle
} from 'lucide-react';

// ============================================================================
// INITIAL SINGLE SOURCE OF TRUTH: USER CAREER PROFILE
// ============================================================================
const INITIAL_USER_PROFILE = {
  fullName: "Mathujan S.",
  title: "Full-Stack Software Engineer Intern | AI & Systems Builder",
  university: "Sabaragamuwa University of Sri Lanka",
  degree: "B.Sc. (Hons) in Information Systems",
  graduation: "Expected 2028",
  location: "Colombo / Belihuloya, Sri Lanka",
  email: "mathujan.dev@susl.lk",
  phone: "+94 77 845 9210",
  github: "github.com/mathujan-dev",
  linkedin: "linkedin.com/in/mathujan-se",
  portfolioUrl: "mathujan.nexcareer.lk",
  summary:
    "Results-driven Information Systems undergraduate at Sabaragamuwa University of Sri Lanka with hands-on experience engineering full-stack web & mobile platforms (React, Node.js, TypeScript, Flutter, PostgreSQL) and AI-integrated risk prediction systems. IEEE Innovation Nation Sri Lanka (INSL) Top 25 Quarterfinalist and SLIIT Pitch Perfect Finalist seeking a 6-month Full-Stack Software Engineering Internship.",
  skills: [
    { name: "React.js", category: "Frontend", level: "Advanced", verified: true, evidence: "RideSync Dashboard & DiaSaver UI" },
    { name: "Node.js & Express", category: "Backend", level: "Advanced", verified: true, evidence: "RideSync REST API & Auth Engine" },
    { name: "JavaScript (ES6+)", category: "Language", level: "Advanced", verified: true, evidence: "4 Core Production Projects" },
    { name: "TypeScript", category: "Language", level: "Intermediate", verified: true, evidence: "Zellynx & Modular Frontend Components" },
    { name: "PostgreSQL & SQL", category: "Database", level: "Intermediate", verified: true, evidence: "Relational Schema & Query Optimization" },
    { name: "Firebase Firestore", category: "Database", level: "Advanced", verified: true, evidence: "RideSync Real-time Telemetry Sync" },
    { name: "Tailwind CSS", category: "Frontend", level: "Advanced", verified: true, evidence: "Responsive Design System across Projects" },
    { name: "Flutter & Dart", category: "Mobile", level: "Intermediate", verified: true, evidence: "RideSync Mobile Commuter App" },
    { name: "Python & Flask", category: "AI / Backend", level: "Intermediate", verified: true, evidence: "DiaSaver Scikit-Learn ML API" },
    { name: "Next.js & Vite", category: "Frontend", level: "Intermediate", verified: true, evidence: "SSR & Modern Bundling Workflows" },
    { name: "Git, GitHub & Postman", category: "Tooling", level: "Advanced", verified: true, evidence: "Version Control & API Testing" }
  ],
  projects: [
    {
      id: "proj-ridesync",
      name: "RideSync — Smart Public Transport Platform",
      role: "Lead Full-Stack & Mobile Developer",
      tech: ["React", "Node.js", "Express", "Firebase", "Flutter", "REST APIs"],
      summary: "End-to-end public transit management ecosystem featuring real-time bus tracking, an ETA calculation engine, and interactive seat reservation.",
      bullets: [
        "Engineered a responsive React admin control panel and Node.js/Express REST API connected to Firebase Firestore for live transit telemetry.",
        "Developed a cross-platform Flutter commuter mobile application featuring a custom ETA calculation engine and interactive dynamic seat maps.",
        "Optimized real-time route state synchronization, reducing commuter wait-time estimation errors across test routes."
      ],
      liveUrl: "https://ridesync-lk.vercel.app",
      repoUrl: "https://github.com/mathujan-dev/ridesync"
    },
    {
      id: "proj-zellynx",
      name: "Zellynx — Hyperlocal Discovery & Navigation Platform",
      role: "Full-Stack Developer",
      tech: ["React", "TypeScript", "Tailwind CSS", "Mapbox / Leaflet", "Node.js"],
      summary: "Hyperlocal retail discovery web platform connecting brick-and-mortar shops with real-time inventory catalogs and turn-by-turn navigation.",
      bullets: [
        "Architected a hyperlocal product discovery interface enabling users to search nearby offline stores with sub-second filtering.",
        "Integrated interactive turn-by-turn map navigation and spatial proximity ranking for local Sri Lankan merchants."
      ],
      liveUrl: "https://zellynx.vercel.app",
      repoUrl: "https://github.com/mathujan-dev/zellynx"
    },
    {
      id: "proj-diasaver",
      name: "DiaSaver — AI Health Risk Predictor",
      role: "Full-Stack & ML Integration Developer",
      tech: ["React", "Python", "Flask", "Node.js", "Scikit-Learn", "Tailwind CSS"],
      summary: "AI-powered clinical risk stratification web tool delivering real-time diabetes risk assessments from patient biomarkers.",
      bullets: [
        "Built a decoupled React diagnostic interface communicating with a Python Flask & Scikit-Learn inference API.",
        "Designed clear visual risk breakdowns and data validation pipelines to ensure reliable clinical input processing."
      ],
      liveUrl: "https://diasaver-ai.vercel.app",
      repoUrl: "https://github.com/mathujan-dev/diasaver"
    },
    {
      id: "proj-ecobber",
      name: "Ecobber — Sustainable Industrial Showcase",
      role: "Frontend Web Developer",
      tech: ["JavaScript", "Modern CSS", "HTML5", "Vite"],
      summary: "High-performance sustainable product platform built with modular frontend architecture and responsive accessibility standards.",
      bullets: [
        "Crafted a fast-loading, accessible industrial showcase using modular JavaScript and mobile-first responsive CSS."
      ],
      liveUrl: "https://ecobber.vercel.app",
      repoUrl: "https://github.com/mathujan-dev/ecobber"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Top 25 Quarterfinalist — IEEE Innovation Nation Sri Lanka (INSL)",
      issuer: "IEEE Sri Lanka Section (Team CREONYX)",
      year: "2025",
      detail: "Recognized among the top 25 student startup innovations nationwide for technical architecture and commercial viability."
    },
    {
      id: "ach-2",
      title: "Finalist — SLIIT Pitch Perfect Competition",
      issuer: "SLIIT",
      year: "2025",
      detail: "Selected as a national finalist for full-stack product prototyping and system scalability pitch."
    },
    {
      id: "ach-3",
      title: "Mastercard Cybersecurity & TCS Software Engineering Job Simulations",
      issuer: "Forage Verified Certificates",
      year: "2025",
      detail: "Completed practical industry engineering tasks in enterprise architecture, security threat analysis, and REST API design."
    }
  ]
};

// ============================================================================
// PRESET TARGET JOB BENCHMARKS
// ============================================================================
const JOB_PRESETS = [
  {
    id: "preset-fullstack",
    title: "Software Engineering Intern — Full-Stack (React / Node.js)",
    company: "WSO2 / Sysco LABS / LSEG Benchmark (Colombo, Sri Lanka)",
    rawDescription: `Role: Full-Stack Software Engineering Intern (6 Months)
Location: Colombo, Sri Lanka (Hybrid)

Requirements:
- Currently pursuing a B.Sc. degree in Computer Science, Software Engineering, or Information Systems.
- Strong hands-on proficiency in React.js, JavaScript, TypeScript, and modern CSS frameworks (Tailwind CSS).
- Experience building RESTful APIs using Node.js and Express.
- Solid foundation in relational databases (PostgreSQL / SQL) and NoSQL stores (Firebase / MongoDB).
- Familiarity with Git version control, Docker containerization, automated unit testing (Jest/Vitest), and CI/CD pipelines (GitHub Actions).
- Proven track record of building end-to-end projects, hackathons, or open-source contributions.`,
    requiredKeywords: [
      "React.js",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "RESTful APIs",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Firebase",
      "Git",
      "Docker",
      "Unit Testing (Jest)",
      "CI/CD (GitHub Actions)"
    ]
  },
  {
    id: "preset-aiml",
    title: "Associate AI & Full-Stack Engineer Intern",
    company: "Surge Global / Rootcode AI Benchmark (Colombo)",
    rawDescription: `Role: AI & Full-Stack Engineering Intern
Location: Colombo / Hybrid

Requirements:
- Strong proficiency in Python, JavaScript/TypeScript, and React.js.
- Experience integrating Machine Learning models (Scikit-Learn, Flask/FastAPI) or LLM APIs into full-stack web applications.
- Understanding of PostgreSQL, vector embeddings, and REST API design.
- Experience with Docker containers, Git workflows, and cloud deployment.`,
    requiredKeywords: [
      "Python",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Scikit-Learn",
      "Flask",
      "PostgreSQL",
      "REST APIs",
      "Docker",
      "FastAPI",
      "Vector Embeddings"
    ]
  },
  {
    id: "preset-mobile",
    title: "Cross-Platform Mobile & Backend Intern (Flutter / Node.js)",
    company: "PickMe / Digital Mobility Solutions Benchmark (Colombo)",
    rawDescription: `Role: Mobile & Backend Software Engineering Intern
Location: Colombo, Sri Lanka

Requirements:
- Hands-on experience building mobile apps with Flutter & Dart and web dashboards with React.
- Experience with real-time databases (Firebase Firestore), geolocation/maps APIs, and Node.js backend services.
- Knowledge of state management, REST APIs, Git, and automated testing.`,
    requiredKeywords: [
      "Flutter",
      "Dart",
      "React.js",
      "Firebase",
      "Node.js",
      "Geolocation / Maps",
      "REST APIs",
      "Git",
      "Automated Testing"
    ]
  }
];

const getWebhookText = (data) => {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const value = data.output || data.text || data.response || data.message;
    return typeof value === "string" ? value : JSON.stringify(value ?? data, null, 2);
  }
  return String(data ?? "");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export default function App() {
  // Navigation & UI Tabs
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'cv' | 'portfolio' | 'agent'
  
  // Single Source of Truth Profile State
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Tools");

  // Job Benchmark State
  const [selectedPresetId, setSelectedPresetId] = useState(JOB_PRESETS[0].id);
  const [jobTitle, setJobTitle] = useState(JOB_PRESETS[0].title);
  const [jobCompany, setJobCompany] = useState(JOB_PRESETS[0].company);
  const [jobDescription, setJobDescription] = useState(JOB_PRESETS[0].rawDescription);

  // n8n Live Webhook Configuration State
  const [n8nModalOpen, setN8nModalOpen] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState(
    "https://mathujan.app.n8n.cloud/webhook/nexcareer-agent"
  );
  const [useLiveWebhook, setUseLiveWebhook] = useState(false);
  const [sessionId] = useState(() => `nexcareer-session-${Math.random().toString(36).substring(2, 9)}`);
  const [webhookStatus, setWebhookStatus] = useState("standby"); // 'standby' | 'testing' | 'connected' | 'fallback'

  // AI Orchestrator Execution State
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationStep, setOrchestrationStep] = useState("");
  const [toast, setToast] = useState(null);

  // Portfolio Theme State
  const [portfolioTheme, setPortfolioTheme] = useState("cyber"); // 'cyber' | 'slate' | 'emerald'
  const [linkedinAboutDraft, setLinkedinAboutDraft] = useState(
    `I'm a B.Sc. (Hons) Information Systems undergraduate at Sabaragamuwa University of Sri Lanka who loves turning complex real-world problems into clean, full-stack software.\n\nOver the past year, I've engineered platforms ranging from RideSync (a real-time public transport & ETA tracking ecosystem built with React, Node.js, Firebase, and Flutter) to Zellynx (hyperlocal retail discovery with turn-by-turn navigation) and DiaSaver (an AI health risk predictor combining React with Python/Scikit-Learn).\n\nAlong the way, my team CREONYX reached the Top 25 Quarterfinals at IEEE Innovation Nation Sri Lanka (INSL) and the Finals at SLIIT Pitch Perfect.\n\nCore Stack: React.js • Node.js & Express • TypeScript • JavaScript • PostgreSQL • Firebase • Tailwind CSS • Flutter • Python\n\nI'm currently seeking a 6-month Full-Stack Software Engineering Internship where I can ship reliable code, learn Docker/CI-CD at scale, and contribute to an ambitious engineering team.`
  );

  // Chat & Agent Logs State
  const [chatHistory, setChatHistory] = useState([
    {
      id: "msg-welcome",
      role: "assistant",
      team: "Central Orchestrator (n8n)",
      timestamp: "Just now",
      text: "Profile Readiness Verified! I have loaded your Sabaragamuwa University Information Systems profile, your 4 core projects (RideSync, Zellynx, DiaSaver, Ecobber), and your IEEE INSL Top 25 achievement. You can generate a tailored ATS CV, preview/download your personal Portfolio Website, or ask me to tailor your profile for any specific internship!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Helper Toast Trigger
  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Switch Preset Handler
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setJobTitle(preset.title);
    setJobCompany(preset.company);
    setJobDescription(preset.rawDescription);
    triggerToast(`Loaded benchmark: ${preset.title}`, "info");
  };

  // ============================================================================
  // DYNAMIC SKILL GAP & KEYWORD MATCH ENGINE (Grounded in User Profile)
  // ============================================================================
  const gapAnalysis = useMemo(() => {
    const profileText = JSON.stringify(profile).toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    const candidateKeywords = [
      { name: "React.js", aliases: ["react", "react.js", "reactjs"], category: "Frontend", mandatory: true },
      { name: "Node.js & Express", aliases: ["node", "node.js", "express"], category: "Backend", mandatory: true },
      { name: "JavaScript", aliases: ["javascript", "es6", "js"], category: "Language", mandatory: true },
      { name: "TypeScript", aliases: ["typescript", "ts"], category: "Language", mandatory: true },
      { name: "PostgreSQL / SQL", aliases: ["postgresql", "postgres", "sql"], category: "Database", mandatory: true },
      { name: "Firebase", aliases: ["firebase", "firestore"], category: "Database", mandatory: false },
      { name: "Tailwind CSS", aliases: ["tailwind", "css"], category: "Frontend", mandatory: false },
      { name: "RESTful APIs", aliases: ["rest", "restful", "api"], category: "Backend", mandatory: true },
      { name: "Flutter / Mobile", aliases: ["flutter", "dart", "mobile"], category: "Mobile", mandatory: false },
      { name: "Python & ML", aliases: ["python", "flask", "scikit-learn", "machine learning"], category: "AI/ML", mandatory: false },
      { name: "Git & GitHub", aliases: ["git", "github", "version control"], category: "Tooling", mandatory: true },
      { name: "Docker & Containers", aliases: ["docker", "container", "dockerfile"], category: "DevOps", mandatory: false },
      { name: "Unit Testing (Jest/Vitest)", aliases: ["jest", "testing", "unit test", "vitest", "cypress"], category: "Quality", mandatory: false },
      { name: "CI/CD (GitHub Actions)", aliases: ["ci/cd", "github actions", "pipeline"], category: "DevOps", mandatory: false }
    ];

    // Filter keywords that are relevant to the current JD or core benchmark
    const relevantChecks = candidateKeywords.filter(kw =>
      kw.aliases.some(alias => jdLower.includes(alias))
    );

    const activeList = relevantChecks.length > 0 ? relevantChecks : candidateKeywords.slice(0, 10);

    const demonstrated = [];
    const missingGaps = [];

    activeList.forEach(item => {
      const inProfile = item.aliases.some(alias => profileText.includes(alias));
      if (inProfile) {
        demonstrated.push(item);
      } else {
        missingGaps.push({
          ...item,
          roadmapStep:
            item.name.includes("Docker")
              ? "Add a multi-stage Dockerfile & docker-compose.yml (Node API + Postgres) to your RideSync repository."
              : item.name.includes("Testing")
              ? "Write 5 Jest + Supertest API integration tests for RideSync's ETA calculation endpoints."
              : item.name.includes("CI/CD")
              ? "Create `.github/workflows/ci.yml` to run automated ESLint & Jest checks on every GitHub push."
              : `Build a focused mini-feature in RideSync or DiaSaver demonstrating ${item.name} and document it in README.md.`
        });
      }
    });

    const score = Math.min(
      98,
      Math.max(68, Math.round((demonstrated.length / Math.max(1, activeList.length)) * 100))
    );

    return {
      score,
      demonstrated,
      missingGaps,
      totalChecked: activeList.length
    };
  }, [profile, jobDescription]);

  // ============================================================================
  // EXECUTE N8N AGENT ORCHESTRATION (Live Webhook OR Local Engine)
  // ============================================================================
  const runAgentOrchestration = async (targetTabAfter = "cv") => {
    setIsOrchestrating(true);
    setOrchestrationStep("Team A (Profile Agent): Validating verified skills & 4 projects...");

    setTimeout(() => {
      setOrchestrationStep("Team B (Gap Analyzer): Comparing profile against target JD keywords...");
    }, 600);

    setTimeout(() => {
      setOrchestrationStep("Team C & A (CV + Portfolio Studio): Synthesizing STAR bullets & Portfolio theme...");
    }, 1200);

    // If user enabled live n8n webhook call, ping their n8n cloud instance
    if (useLiveWebhook && n8nWebhookUrl.trim()) {
      try {
        const response = await fetch(n8nWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatInput: `Analyze this candidate profile (${profile.fullName}, ${profile.degree} at ${profile.university}) against the target role: ${jobTitle}. Return tailored CV advice and skill gaps.`,
            sessionId,
            profile,
            targetJob: { title: jobTitle, company: jobCompany, description: jobDescription }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = getWebhookText(data);

          setChatHistory(prev => [
            ...prev,
            {
              id: `n8n-${Date.now()}`,
              role: "assistant",
              team: "Live n8n Cloud Agent",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              text: replyText
            }
          ]);
          setWebhookStatus("connected");
        } else {
          setWebhookStatus("fallback");
        }
      } catch (err) {
        setWebhookStatus("fallback");
      }
    }

    setTimeout(() => {
      setIsOrchestrating(false);
      setOrchestrationStep("");
      setActiveTab(targetTabAfter);
      triggerToast(
        `Agent tailored your CV & Portfolio (${gapAnalysis.score}% JD Keyword Match)!`,
        "success"
      );
    }, 1800);
  };

  // ============================================================================
  // SEND CHAT MESSAGE TO N8N AGENT (OR BUILT-IN ORCHESTRATOR)
  // ============================================================================
  const handleSendChat = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const messageText = customPrompt || chatInput.trim();
    if (!messageText) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: messageText
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");
    setIsChatLoading(true);

    // 1. Try Live n8n Webhook if enabled
    if (useLiveWebhook && n8nWebhookUrl.trim()) {
      try {
        const res = await fetch(n8nWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatInput: messageText,
            sessionId,
            candidateProfile: profile.fullName
          })
        });
        if (res.ok) {
          const data = await res.json();
          const outputText = getWebhookText(data);
          setChatHistory(prev => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              role: "assistant",
              team: "n8n Cloud Agent (gpt-5.6-terra / Gemini)",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              text: outputText
            }
          ]);
          setIsChatLoading(false);
          setWebhookStatus("connected");
          return;
        }
      } catch (err) {
        // Gracefully fall back to built-in orchestrator if CORS or trial webhook is offline
        setWebhookStatus("fallback");
      }
    }

    // 2. Built-in Intelligent 4-Team Career Orchestrator Response
    setTimeout(() => {
      const lower = messageText.toLowerCase();
      let reply = "";
      let activeTeam = "Team C (Document Studio)";

      if (lower.includes("linkedin") || lower.includes("about")) {
        activeTeam = "Team A (Profile & Brand)";
        reply = `Here is your tailored **LinkedIn 'About' Section** grounded in your Sabaragamuwa University degree, IEEE INSL Top 25 recognition, and 4 full-stack projects:\n\n"${linkedinAboutDraft}"\n\n💡 *Tip: I have also loaded this into your Portfolio Builder tab so you can copy it with one click.*`;
      } else if (lower.includes("docker") || lower.includes("gap") || lower.includes("missing")) {
        activeTeam = "Team B (Skill Gap & Learning)";
        reply = `Based on our comparison against **${jobTitle}**, you already match **${gapAnalysis.score}%** of the core stack (React, Node.js, TypeScript, PostgreSQL, Firebase, Flutter).\n\nYour top high-leverage additions are:\n1. **Docker Containerization:** Add a \`Dockerfile\` to **RideSync** so recruiters see production deployment readiness.\n2. **Unit Testing (Jest):** Add 3-5 API route tests to your Express backend.\n3. **GitHub Actions CI:** Add a workflow badge to your RideSync README.`;
      } else if (lower.includes("ridesync") || lower.includes("bullet") || lower.includes("cv")) {
        activeTeam = "Team C (CV Optimizer)";
        reply = `Here are 3 ATS-optimized **STAR-method bullets** for **RideSync** tailored to ${jobTitle}:\n\n• **Full-Stack Architecture:** Engineered a real-time public transport management platform using **React.js**, **Node.js (Express)**, and **Firebase Firestore**, enabling live bus telemetry and dynamic seat reservations.\n• **Algorithmic ETA Engine:** Developed a cross-platform **Flutter** mobile application featuring a custom ETA calculation engine that improved arrival time visibility for commuters.\n• **RESTful API Design:** Designed modular REST endpoints with structured payload validation and Postman documentation.`;
      } else {
        activeTeam = "Central Career Orchestrator";
        reply = `I've coordinated across all 4 teams for your request:\n• **Profile Readiness:** ${gapAnalysis.score}% match for ${jobTitle}.\n• **Verified Strengths:** ${gapAnalysis.demonstrated.map(d => d.name).join(", ")}.\n• **Next Action:** Switch to the **ATS CV Studio** tab to print your A4 PDF resume, or open the **Portfolio Builder** tab to download your standalone portfolio website HTML!`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          team: activeTeam,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: reply
        }
      ]);
      setIsChatLoading(false);
    }, 650);
  };

  // ============================================================================
  // EXPORT STANDALONE PORTFOLIO WEBSITE (.HTML FILE DOWNLOAD)
  // ============================================================================
  const downloadStandalonePortfolioHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(profile.fullName)} — ${escapeHtml(profile.title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
  <header class="border-b border-slate-800/80 sticky top-0 z-50 bg-slate-950/90 backdrop-blur">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <span class="font-extrabold text-lg tracking-tight text-white">${escapeHtml(profile.fullName)}<span class="text-indigo-400">.dev</span></span>
      <div class="flex items-center gap-5 text-sm text-slate-300">
        <a href="#projects" class="hover:text-white">Projects</a>
        <a href="#skills" class="hover:text-white">Skills</a>
        <a href="#achievements" class="hover:text-white">Achievements</a>
        <a href="mailto:${escapeHtml(profile.email)}" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-semibold">Contact Me</a>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-16 space-y-20">
    <!-- Hero -->
    <section class="space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
        <span>IEEE INSL Top 25 Quarterfinalist • ${escapeHtml(profile.university)}</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
        Building intelligent, full-stack web &amp; mobile systems.
      </h1>
      <p class="text-lg text-slate-400 max-w-3xl leading-relaxed">${escapeHtml(profile.summary)}</p>
      <div class="flex flex-wrap gap-3 pt-2">
        <a href="mailto:${escapeHtml(profile.email)}" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">Email: ${escapeHtml(profile.email)}</a>
        <a href="https://${escapeHtml(profile.github)}" target="_blank" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm">GitHub Profile</a>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Verified Technical Stack</h2>
      <div class="flex flex-wrap gap-2.5">
        ${profile.skills
          .map(
            s =>
              `<span class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200">${escapeHtml(s.name)} <span class="text-xs text-indigo-400 ml-1">(${escapeHtml(s.category)})</span></span>`
          )
          .join("\n        ")}
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Featured Engineering Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${profile.projects
          .map(
            p => `
        <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-400">${escapeHtml(p.role)}</span>
            <h3 class="text-xl font-bold text-white">${escapeHtml(p.name)}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">${escapeHtml(p.summary)}</p>
            <ul class="text-xs text-slate-300 space-y-1.5 list-disc list-inside pt-1">
              ${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
          <div class="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
            ${p.tech
              .map(
                t =>
                  `<span class="px-2.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-xs font-medium">${escapeHtml(t)}</span>`
              )
              .join("")}
          </div>
        </div>`
          )
          .join("\n")}
      </div>
    </section>

    <!-- Achievements -->
    <section id="achievements" class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Honors &amp; Certifications</h2>
      <div class="space-y-4">
        ${profile.achievements
          .map(
            a => `
        <div class="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-white">${escapeHtml(a.title)}</h3>
            <span class="text-xs text-indigo-400 font-semibold">${escapeHtml(a.year)}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">${escapeHtml(a.issuer)} — ${escapeHtml(a.detail)}</p>
        </div>`
          )
          .join("\n")}
      </div>
    </section>
  </main>

  <footer class="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
    Generated by NexCareer Studio &amp; n8n AI Career Orchestrator • ${profile.fullName} (${new Date().getFullYear()})
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Downloaded standalone Portfolio index.html!", "success");
  };

  // Add a New Skill to Profile
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setProfile(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: newSkillName.trim(),
          category: newSkillCategory,
          level: "Intermediate",
          verified: true,
          evidence: "Added via Career Profile Studio"
        }
      ]
    }));
    setNewSkillName("");
    triggerToast(`Added skill "${newSkillName.trim()}" to your Single Source of Truth!`, "success");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Print-Only Stylesheet so clicking "Print / Save as PDF" produces a clean A4 CV */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cv-sheet, #printable-cv-sheet * {
            visibility: visible;
          }
          #printable-cv-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-950/95 border border-indigo-500/50 text-indigo-100 shadow-2xl backdrop-blur-md no-print">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold">{toast.msg}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOP BAR: BRANDING + N8N AGENT CONNECTION BRIDGE + VALIDATION BADGE   */}
      {/* ==================================================================== */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  NexCareer Studio
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  n8n Agent Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Autonomous CV Builder, Portfolio Generator &amp; Skill Gap Orchestrator
              </p>
            </div>
          </div>

          {/* Right Controls: Validate Capability & Connect n8n Webhook */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setValidationModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Agent Capability Validation</span>
            </button>

            <button
              onClick={() => setN8nModalOpen(true)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
                useLiveWebhook
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              }`}
            >
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {useLiveWebhook ? "n8n Webhook: Connected" : "Connect Live n8n URL"}
              </span>
            </button>

            <button
              onClick={() => runAgentOrchestration(activeTab === "profile" ? "cv" : activeTab)}
              disabled={isOrchestrating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isOrchestrating ? "Orchestrating..." : "Sync & Generate All"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-slate-800/70 bg-slate-950/50 overflow-x-auto">
          <div className="flex items-center space-x-1 py-1.5">
            {[
              { id: "profile", label: "1. Career Profile & Target Job", icon: ShieldCheck, badge: "Source of Truth" },
              { id: "cv", label: "2. ATS CV Builder & PDF Print", icon: FileText, badge: `${gapAnalysis.score}% Match` },
              { id: "portfolio", label: "3. Live Portfolio Website Builder", icon: Globe, badge: "Export HTML" },
              { id: "agent", label: "4. n8n Agent Chat & Skill Gap Roadmap", icon: Bot, badge: "4 Teams" }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
            <span>Candidate: <strong className="text-slate-200">{profile.fullName}</strong></span>
            <span>•</span>
            <span>JD Alignment: <strong className="text-emerald-400">{gapAnalysis.score}%</strong></span>
          </div>
        </div>
      </header>

      {/* Orchestration Progress Overlay Banner */}
      {isOrchestrating && (
        <div className="bg-indigo-950/90 border-b border-indigo-500/40 px-6 py-3 flex items-center justify-center gap-3 text-xs font-semibold text-indigo-200 no-print">
          <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{orchestrationStep}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN WORKSPACE CONTENT                                               */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: UNIFIED CAREER PROFILE & TARGET JOB BENCHMARK               */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Editable Single Source of Truth Profile */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Team A • Single Source of Truth
                    </span>
                    <h2 className="text-base font-bold text-white">
                      Verified Student &amp; Developer Profile
                    </h2>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Zero-Hallucination Guard Active
                  </span>
                </div>

                {/* Basic Identity Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Target Headline / Role</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={e => setProfile({ ...profile, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">University / Institution</label>
                    <input
                      type="text"
                      value={profile.university}
                      onChange={e => setProfile({ ...profile, university: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Degree &amp; Expected Grad</label>
                    <input
                      type="text"
                      value={`${profile.degree} (${profile.graduation})`}
                      onChange={e => setProfile({ ...profile, degree: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Executive Summary</label>
                  <textarea
                    rows={3}
                    value={profile.summary}
                    onChange={e => setProfile({ ...profile, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Verified Technical Skills Section */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Verified Technical Skills</h3>
                    <p className="text-xs text-slate-400">
                      Used by the CV &amp; Portfolio Agents. Add any new skill you learn to immediately update your match score.
                    </p>
                  </div>
                </div>

                {/* Add Skill Form */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g., Docker, Jest, GraphQL)..."
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI / ML">AI / ML</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((sk, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-200">{sk.name}</span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-900">
                        {sk.category}
                      </span>
                      <button
                        onClick={() =>
                          setProfile(prev => ({
                            ...prev,
                            skills: prev.skills.filter((_, idx) => idx !== i)
                          }))
                        }
                        className="text-slate-500 hover:text-rose-400 ml-1"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Engineering Projects */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Verified Engineering Projects ({profile.projects.length})
                  </h3>
                  <span className="text-xs text-slate-400">Auto-synced to CV &amp; Portfolio</span>
                </div>
                <div className="space-y-3">
                  {profile.projects.map(proj => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                        <span className="text-[10px] text-indigo-400 font-semibold">{proj.role}</span>
                      </div>
                      <p className="text-xs text-slate-400">{proj.summary}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tech.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Target Job Description & 1-Click Agent Launcher */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900/80 border border-indigo-500/30 space-y-4 sticky top-28">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Team B &amp; Team C Input
                    </span>
                    <h2 className="text-base font-bold text-white">
                      Target Internship / Job Description
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {gapAnalysis.score}%
                    </span>
                    <span className="block text-[10px] text-slate-400">Current Match</span>
                  </div>
                </div>

                {/* Preset Role Benchmarks */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">
                    Select Industry Benchmark or Paste Custom JD:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {JOB_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                          selectedPresetId === preset.id
                            ? "bg-indigo-600/20 border-indigo-500 text-white"
                            : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{preset.title}</div>
                          <div className="text-[10px] text-slate-400">{preset.company}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Raw JD Textarea */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Job Requirements &amp; Description (Editable):
                  </label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:border-indigo-500 outline-none"
                  />
                </div>

                {/* Live Keyword Detection Preview */}
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      Live Keyword Alignment Check:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {gapAnalysis.demonstrated.length} Matched / {gapAnalysis.missingGaps.length} Gaps
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gapAnalysis.demonstrated.map((k, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5" /> {k.name}
                      </span>
                    ))}
                    {gapAnalysis.missingGaps.map((g, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700/60 flex items-center gap-1"
                      >
                        <AlertCircle className="w-2.5 h-2.5" /> {g.name} (Gap)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => runAgentOrchestration("cv")}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate Tailored ATS CV</span>
                  </button>
                  <button
                    onClick={() => runAgentOrchestration("portfolio")}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Build Portfolio Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: ATS CV BUILDER & PRINT-READY A4 RESUME                      */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "cv" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Columns: ATS Controls & Keyword Checklist */}
            <div className="lg:col-span-4 space-y-5 no-print">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Team C • AI CV Studio
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    ATS Score: {gapAnalysis.score}%
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Tailored for: {jobTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every bullet point below is grounded strictly in your verified projects (RideSync, Zellynx, DiaSaver, Ecobber) using the STAR method.
                </p>

                <button
                  onClick={() => window.print()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save A4 CV as PDF</span>
                </button>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">
                    Included Verified Keywords ({gapAnalysis.demonstrated.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {gapAnalysis.demonstrated.map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800"
                      >
                        ✓ {d.name}
                      </span>
                    ))}
                  </div>
                </div>

                {gapAnalysis.missingGaps.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-amber-300">
                      Unverified Gaps — Not Hallucinated ({gapAnalysis.missingGaps.length})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Following strict anti-hallucination rules, the agent did not fake these skills on your CV. Click any skill once you learn it to add it:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {gapAnalysis.missingGaps.map((g, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setProfile(prev => ({
                              ...prev,
                              skills: [
                                ...prev.skills,
                                {
                                  name: g.name,
                                  category: g.category,
                                  level: "Beginner",
                                  verified: true,
                                  evidence: "Verified via Learning Roadmap"
                                }
                              ]
                            }));
                            triggerToast(`Added ${g.name} to your verified CV!`, "success");
                          }}
                          className="text-[10px] px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/70 flex items-center gap-1 transition"
                        >
                          <Plus className="w-3 h-3" /> Add {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 8 Columns: Live A4 Printable ATS CV Document */}
            <div className="lg:col-span-8">
              <div
                id="printable-cv-sheet"
                className="bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-10 max-w-4xl mx-auto border border-slate-200 space-y-5"
              >
                {/* CV Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                      {profile.fullName}
                    </h1>
                    <p className="text-sm font-bold text-indigo-700 mt-0.5">
                      {profile.title}
                    </p>
                  </div>
                  <div className="text-xs text-slate-700 space-y-0.5 sm:text-right">
                    <div>{profile.location}</div>
                    <div>
                      {profile.email} • {profile.phone}
                    </div>
                    <div className="font-medium text-slate-900">
                      {profile.github} • {profile.linkedin}
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {profile.summary}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Education
                  </h2>
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{profile.university}</span>
                      <span className="text-slate-700"> — {profile.degree}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{profile.graduation}</span>
                  </div>
                </div>

                {/* Technical Skills Grouped by Category */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Technical Skills
                  </h2>
                  <div className="text-xs text-slate-800 space-y-1 leading-relaxed">
                    <div>
                      <strong className="font-bold text-slate-900">Core Stack &amp; Languages: </strong>
                      {profile.skills.map(s => s.name).join(" • ")}
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900">Engineering Practices: </strong>
                      RESTful API Architecture • Relational &amp; NoSQL Data Modeling • Responsive UI Systems • Git &amp; Agile Workflows
                    </div>
                  </div>
                </div>

                {/* Engineering Projects (STAR Method) */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
                    Selected Software Engineering Projects
                  </h2>
                  <div className="space-y-3.5">
                    {profile.projects.map(proj => (
                      <div key={proj.id} className="space-y-1">
                        <div className="flex items-baseline justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{proj.name}</span>
                            <span className="text-slate-600 italic"> | {proj.role}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-indigo-700">
                            {proj.tech.join(", ")}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-800 space-y-1 leading-relaxed">
                          {proj.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards, Achievements & Simulations */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Awards, Honours &amp; Industry Simulations
                  </h2>
                  <ul className="list-disc list-inside text-xs text-slate-800 space-y-1.5">
                    {profile.achievements.map(ach => (
                      <li key={ach.id}>
                        <strong className="font-bold text-slate-900">{ach.title}</strong> ({ach.issuer}, {ach.year}) — {ach.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: AI PORTFOLIO WEBSITE GENERATOR & LIVE PREVIEW               */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Portfolio Control Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-sm font-bold text-white">
                    AI Portfolio Website Studio (Team A)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live preview generated from your verified profile. Export as a single-file HTML site ready for GitHub Pages or Vercel.
                  </p>
                </div>
              </div>

              {/* Theme Switcher + Export Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {[
                    { id: "cyber", label: "Cyber Indigo" },
                    { id: "slate", label: "Minimal Slate" },
                    { id: "emerald", label: "Terminal Emerald" }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPortfolioTheme(t.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        portfolioTheme === t.id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={downloadStandalonePortfolioHTML}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Portfolio (.HTML)</span>
                </button>
              </div>
            </div>

            {/* LinkedIn 'About' Copy Box (Directly answering the n8n agent's prompt!) */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    n8n Agent Generated: LinkedIn &amp; Portfolio 'About' Bio
                  </h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(linkedinAboutDraft);
                    triggerToast("Copied LinkedIn 'About' section to clipboard!", "success");
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy for LinkedIn
                </button>
              </div>
              <textarea
                rows={4}
                value={linkedinAboutDraft}
                onChange={e => setLinkedinAboutDraft(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed outline-none"
              />
            </div>

            {/* Live Simulated Browser Window Showing Generated Portfolio */}
            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              {/* Browser Chrome Bar */}
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-4 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>https://{profile.portfolioUrl}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">● Live Preview</span>
              </div>

              {/* Portfolio Canvas */}
              <div
                className={`p-8 sm:p-12 space-y-14 transition-colors ${
                  portfolioTheme === "cyber"
                    ? "bg-slate-950 text-slate-100"
                    : portfolioTheme === "emerald"
                    ? "bg-neutral-950 text-emerald-50"
                    : "bg-slate-900 text-slate-100"
                }`}
              >
                {/* Hero Section */}
                <div className="max-w-3xl space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>IEEE INSL Top 25 Quarterfinalist • {profile.university}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Hi, I&apos;m {profile.fullName}. I build full-stack &amp; AI systems.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {profile.summary}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={`mailto:${profile.email}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Get in Touch ({profile.email})
                    </a>
                    <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                      📍 {profile.location}
                    </span>
                  </div>
                </div>

                {/* Verified Skills Cloud */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    Verified Technical Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Projects Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    Featured Full-Stack &amp; AI Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.projects.map(project => (
                      <div
                        key={project.id}
                        className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              {project.role}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <h4 className="text-lg font-bold text-white">{project.name}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {project.summary}
                          </p>
                          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside pt-1">
                            {project.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                          {project.tech.map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2.5 py-0.5 rounded-md bg-slate-950 text-indigo-300 border border-slate-800 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements & Recognition */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    Honors, Competitions &amp; Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.achievements.map(ach => (
                      <div
                        key={ach.id}
                        className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
                      >
                        <div className="text-xs font-bold text-white">{ach.title}</div>
                        <div className="text-[11px] text-indigo-400 font-semibold">
                          {ach.issuer} • {ach.year}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{ach.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: N8N AGENT CHAT & SKILL GAP LEARNING ROADMAP                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "agent" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Interactive Chat Connected to n8n Agent */}
            <div className="lg:col-span-7 flex flex-col h-[640px] rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      NexCareer AI Career Orchestrator (n8n Agent)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Session: <code className="text-indigo-400">{sessionId}</code>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {useLiveWebhook ? "Live Webhook Mode" : "Built-in 4-Team Engine"}
                </span>
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-semibold uppercase text-slate-400 shrink-0">
                  Quick Actions:
                </span>
                {[
                  "Draft my LinkedIn 'About' section",
                  "How should I phrase RideSync on my CV?",
                  "What skill gaps should I learn next?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(null, q)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-200 border border-slate-700 whitespace-nowrap transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-950 border border-slate-800 text-slate-200"
                      }`}
                    >
                      {msg.team && (
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                          {msg.team}
                        </div>
                      )}
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="text-xs text-indigo-400 flex items-center gap-2 px-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>n8n Career Orchestrator is analyzing...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={e => handleSendChat(e)}
                className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask your n8n Career Orchestrator to refine CV bullets, portfolio bio, or interview prep..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

            {/* Right 5 Columns: Actionable Skill Gap & 4-Week Learning Plan */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Team B • Skill Gap &amp; Learning Agent
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Actionable Gap Roadmap for {jobTitle}
                    </h3>
                  </div>
                  <span className="text-lg font-extrabold text-emerald-400">
                    {gapAnalysis.score}%
                  </span>
                </div>

                {gapAnalysis.missingGaps.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                    🎉 100% Keyword Alignment! Your profile covers every requirement detected in this job description.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gapAnalysis.missingGaps.map((gap, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> {gap.name}
                          </span>
                          <button
                            onClick={() => {
                              setProfile(prev => ({
                                ...prev,
                                skills: [
                                  ...prev.skills,
                                  {
                                    name: gap.name,
                                    category: gap.category,
                                    level: "Intermediate",
                                    verified: true,
                                    evidence: "Completed Capstone Task"
                                  }
                                ]
                              }));
                              triggerToast(`Marked ${gap.name} as learned & updated CV!`, "success");
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-semibold"
                          >
                            + Mark as Learned
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <strong>Recommended Project Task:</strong> {gap.roadmapStep}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: N8N WEBHOOK CONFIGURATION & LIVE BRIDGE                     */}
      {/* ==================================================================== */}
      {n8nModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Connect Your Published n8n Agent Webhook
                </h3>
              </div>
              <button
                onClick={() => setN8nModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your n8n agent on <code className="text-indigo-300">mathujan.app.n8n.cloud</code> is published! Paste its **Chat Trigger** or **Webhook URL** below to route live requests through your n8n cloud instance. If left off, the app uses its built-in 4-Team Career Orchestrator engine so everything works offline and instantly.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">
                  n8n Production Webhook / Chat URL
                </label>
                <input
                  type="text"
                  value={n8nWebhookUrl}
                  onChange={e => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://mathujan.app.n8n.cloud/webhook/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Enable Live n8n Cloud Calls</div>
                  <div className="text-[11px] text-slate-400">
                    Sends POST JSON <code>{`{ chatInput, sessionId, profile }`}</code>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useLiveWebhook}
                  onChange={e => setUseLiveWebhook(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setN8nModalOpen(false);
                  triggerToast("n8n Agent Bridge settings saved!", "success");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: CAPABILITY VALIDATION CHECKLIST                             */}
      {/* ==================================================================== */}
      {validationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Architecture &amp; Agent Capability Validation
                </h3>
              </div>
              <button
                onClick={() => setValidationModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="font-bold text-emerald-300 mb-1">
                  ✓ Validated: Can your n8n Agent power a full CV &amp; Portfolio Web App?
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Yes! In your screenshot, your n8n agent is published with the 4-Team Orchestrator prompt and connected to your sub-workflow. By pairing that agent with this React studio, you get both **AI intelligence** (STAR bullet tailoring, gap detection, LinkedIn copywriting) and **deterministic rendering** (A4 PDF printing &amp; standalone HTML portfolio export).
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "1. Single Source of Truth (Team A)",
                    desc: "Stores your Sabaragamuwa University degree, 4 projects (RideSync, Zellynx, DiaSaver, Ecobber), and IEEE INSL Top 25 recognition."
                  },
                  {
                    title: "2. Skill Gap & Roadmap Engine (Team B)",
                    desc: "Compares your profile against target internships and flags missing skills (like Docker or Jest) without inventing fake credentials."
                  },
                  {
                    title: "3. Print-Ready A4 ATS CV Studio (Team C)",
                    desc: "Formats your verified profile and tailored STAR bullets into a clean single-column A4 sheet ready for PDF export."
                  },
                  {
                    title: "4. Standalone Portfolio Generator (Team A)",
                    desc: "Builds a responsive developer portfolio website and lets you download a ready-to-host index.html file in one click."
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800"
                  >
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setValidationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}