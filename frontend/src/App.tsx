import { useState, useCallback } from 'react'
import {
  User, Briefcase, FileText, Globe, Bot, BarChart3,
  Mail, Kanban, BookOpen, ShieldCheck, Zap, CheckCircle,
  AlertCircle, Clock, Send, Sparkles, ChevronRight,
  RefreshCw, Lock, FolderGit2,
  ExternalLink, Plus, TrendingUp,
  XCircle, CheckSquare, ArrowRight, Cpu, Search
} from 'lucide-react'
import './App.css'

// ─── API CONFIG ──────────────────────────────────────────────────────────────
const API = 'http://localhost:3000/api/agents'

async function callAgent(path: string, body: object) {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch {
    return { error: 'Agent offline — running in demo mode' }
  }
}

// ─── DEMO PROFILE ────────────────────────────────────────────────────────────
const DEMO_PROFILE = {
  user_id: 'usr_odyssey_01',
  full_name: 'Mathujan Vimalarajah',
  email: 'vimalarajahmathujan@gmail.com',
  headline: 'Full-Stack & AI Engineer Undergraduate',
  skills: [
    { name: 'React', category: 'FRONTEND', proficiency: 'ADVANCED', status: 'DEMONSTRATED', source: 'GITHUB_ANALYZED', confidence_score: 0.9, evidence: [{ evidence_type: 'GITHUB_REPO', title: 'NexCareer_AI Frontend', reference_url: 'https://github.com/Mathujan19/NexCareer_AI' }] },
    { name: 'TypeScript', category: 'LANGUAGE', proficiency: 'INTERMEDIATE', status: 'DEMONSTRATED', source: 'GITHUB_ANALYZED', confidence_score: 0.85, evidence: [] },
    { name: 'NestJS', category: 'BACKEND', proficiency: 'INTERMEDIATE', status: 'DEMONSTRATED', source: 'CV_PARSED', confidence_score: 0.80, evidence: [] },
    { name: 'PostgreSQL', category: 'DATABASE', proficiency: 'INTERMEDIATE', status: 'DEMONSTRATED', source: 'USER_INPUT', confidence_score: 0.75, evidence: [] },
    { name: 'Python', category: 'LANGUAGE', proficiency: 'INTERMEDIATE', status: 'DEMONSTRATED', source: 'GITHUB_ANALYZED', confidence_score: 0.78, evidence: [] },
    { name: 'LangGraph', category: 'AI', proficiency: 'INTERMEDIATE', status: 'DEMONSTRATED', source: 'GITHUB_ANALYZED', confidence_score: 0.72, evidence: [] },
    { name: 'GraphQL', category: 'BACKEND', proficiency: 'BEGINNER', status: 'UNVERIFIED', source: 'USER_INPUT', confidence_score: 0.5, evidence: [] },
  ],
  experiences: [
    { company: 'Tech Innovators Sri Lanka', role: 'Software Engineering Intern', bullets: ['Developed backend microservices using NestJS and PostgreSQL.', 'Built reactive interfaces with React and TypeScript.'], location: 'Colombo', start_date: '2025-06', end_date: '2025-12', is_current: false },
  ],
  education: [
    { institution: 'Sabaragamuwa University of Sri Lanka', degree: 'B.Sc. (Hons) Information Systems', field_of_study: 'Information Systems', start_year: 2022, end_year: 2026 }
  ],
  projects: [
    { name: 'NexCareer AI', summary: 'Supervised multi-agent career platform with LangGraph orchestration and Human-in-the-Loop approval gates.', technologies: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'Python', 'LangGraph'], repo_url: 'https://github.com/Mathujan19/NexCareer_AI', live_demo_url: null },
    { name: 'RideSync', summary: 'Real-time public transport platform with ETA engine and mobile commuter app.', technologies: ['React', 'Node.js', 'Firebase', 'Flutter'], repo_url: 'https://github.com/mathujan-dev/ridesync', live_demo_url: 'https://ridesync-lk.vercel.app' },
    { name: 'DiaSaver', summary: 'AI-powered diabetes risk predictor with Python/Scikit-Learn inference API.', technologies: ['React', 'Python', 'Flask', 'Scikit-Learn'], repo_url: 'https://github.com/mathujan-dev/diasaver', live_demo_url: 'https://diasaver-ai.vercel.app' },
  ],
}

const DEMO_JOB = {
  id: 'job_wso2_01',
  title: 'Software Engineering Intern',
  company: 'WSO2',
  mandatory_requirements: ['React', 'TypeScript', 'NestJS'],
  preferred_requirements: ['Docker', 'Kubernetes', 'PostgreSQL'],
  raw_text: 'WSO2 seeks a passionate Software Engineering Intern with React, TypeScript, NestJS, and Docker experience.',
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  DEMONSTRATED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CERTIFIED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PARTIALLY_DEMONSTRATED: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  UNVERIFIED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

function Badge({ label, variant = 'default' }: { label: string; variant?: string }) {
  const cls = STATUS_COLORS[variant] || 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${cls}`}>{label}</span>
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, badge }: { icon: any; title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-indigo-400" size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {badge && <Badge label={badge} variant="DEMONSTRATED" />}
    </div>
  )
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── AGENT STATUS PILL ────────────────────────────────────────────────────────
function AgentPill({ name, team, status }: { name: string; team: string; status: 'online' | 'idle' | 'running' }) {
  const dot = status === 'online' ? 'bg-emerald-400' : status === 'running' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
  const label = status === 'online' ? 'Ready' : status === 'running' ? 'Active' : 'Idle'
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/70 hover:border-slate-700 transition group">
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
        <div>
          <p className="text-xs font-semibold text-slate-200">{name}</p>
          <p className="text-[10px] text-slate-500">{team}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400">{label}</span>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'profile' | 'jobs' | 'cv' | 'portfolio' | 'learning' | 'applications' | 'advisor'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [profile] = useState(DEMO_PROFILE)
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: "Hello! I'm your NexCareer AI Career Advisor. I can help with skill gaps, CV tailoring, job matching, salary benchmarks, and career strategy. What would you like to know?" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [gapReport, setGapReport] = useState<any>(null)
  const [tailoredCV, setTailoredCV] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any>(null)
  const [learningPath, setLearningPath] = useState<any>(null)
  const [kanbanApps] = useState([
    { id: 'app_1', company: 'WSO2', role: 'Software Engineering Intern', status: 'TAILORED', match_score: 85 },
    { id: 'app_2', company: 'Sysco LABS', role: 'Associate Software Engineer', status: 'SAVED', match_score: 78 },
    { id: 'app_3', company: 'Rootcode AI', role: 'AI & Full Stack Intern', status: 'ANALYZING', match_score: 72 },
  ])

  const run = useCallback(async (key: string, path: string, body: object, setter?: (d: any) => void) => {
    setLoading(key)
    const data = await callAgent(path, body)
    setResult(data)
    setter?.(data)
    setLoading(null)
    return data
  }, [])

  const sendChat = async () => {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: msg }])
    const data = await callAgent('/advisor/chat', { message: msg, user_id: profile.user_id, language: 'en', context: { gaps: gapReport?.confirmed_gaps || [] } })
    setChatMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error || 'I am processing your request...' }])
  }

  // ── NAV ITEMS ────────────────────────────────────────────────────────────────
  const navItems: Array<{ id: Tab; label: string; icon: any; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Cpu },
    { id: 'profile', label: 'Career Profile', icon: User, badge: 'SSOT' },
    { id: 'jobs', label: 'Job Discovery', icon: Search },
    { id: 'cv', label: 'CV Builder', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'applications', label: 'Applications', icon: Kanban },
    { id: 'advisor', label: 'AI Advisor', icon: Bot },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl sticky top-0 h-screen">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">NexCareer AI</h1>
              <p className="text-[10px] text-indigo-400 font-semibold">Multi-Agent Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setResult(null) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <Icon size={15} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>{item.badge}</span>}
              </button>
            )
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">MV</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
              <p className="text-[10px] text-slate-500 truncate">SUSL · IS Undergraduate</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">

        {/* ══ DASHBOARD ══════════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Good morning, Mathujan 👋</h2>
              <p className="text-sm text-slate-400 mt-1">Your supervised multi-agent career platform is ready. All 11 agents are initialized.</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Verified Skills', value: profile.skills.filter(s => s.status === 'DEMONSTRATED').length, icon: ShieldCheck, color: 'text-emerald-400' },
                { label: 'Active Projects', value: profile.projects.length, icon: FolderGit2, color: 'text-indigo-400' },
                { label: 'Applications', value: kanbanApps.length, icon: Briefcase, color: 'text-amber-400' },
                { label: 'Profile Score', value: '84%', icon: TrendingUp, color: 'text-purple-400' },
              ].map(stat => (
                <Card key={stat.label} className="flex items-center gap-3">
                  <stat.icon size={20} className={stat.color} />
                  <div>
                    <p className="text-xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-[11px] text-slate-400">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* All 11 Agents Status */}
            <Card>
              <SectionHeader icon={Bot} title="11 Agent System Status" subtitle="LangGraph Supervisor — All teams initialized" badge="ONLINE" />
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'ProfileMasterAgent', team: 'Team A — Profile & Portfolio', status: 'online' },
                  { name: 'PortfolioBuilderAgent', team: 'Team A — Profile & Portfolio', status: 'online' },
                  { name: 'SourceWatcherAgent', team: 'Team A — Profile & Portfolio', status: 'idle' },
                  { name: 'JobDiscoveryAgent', team: 'Team B — Job & Skill Intelligence', status: 'online' },
                  { name: 'GapAnalyzerAgent', team: 'Team B — Job & Skill Intelligence', status: 'online' },
                  { name: 'CurriculumAgent', team: 'Team B — Job & Skill Intelligence', status: 'online' },
                  { name: 'StrategicAdvisorAgent', team: 'Team B — Job & Skill Intelligence', status: 'online' },
                  { name: 'CVSynthesisAgent', team: 'Team C — Document Studio', status: 'online' },
                  { name: 'CVOptimizerAgent', team: 'Team C — Document Studio', status: 'online' },
                  { name: 'ApplicationPrepAgent', team: 'Team C — Document Studio', status: 'idle' },
                  { name: 'OutreachMailAgent', team: 'Team D — Outreach & Tracking', status: 'online' },
                  { name: 'TelemetryTrackerAgent', team: 'Team D — Outreach & Tracking', status: 'online' },
                ].map(a => <AgentPill key={a.name} {...(a as any)} />)}
              </div>
            </Card>

            {/* HITL Checkpoints */}
            <Card>
              <SectionHeader icon={Lock} title="Human-in-the-Loop Checkpoints" subtitle="No irreversible action without your approval" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'H1', label: 'Profile Fact Confirmation', desc: 'Confirm imported skills & credentials', status: 'passed' },
                  { id: 'H2', label: 'CV Review & Lock', desc: 'Review tailored CV before it is locked', status: 'pending' },
                  { id: 'H3', label: 'Dispatch Approval Gate', desc: 'Approve emails & applications before sending', status: 'idle' },
                  { id: 'H4', label: 'Portfolio Publish Sign-off', desc: 'Preview & approve before going live', status: 'idle' },
                ].map(cp => (
                  <div key={cp.id} className={`p-3.5 rounded-xl border ${cp.status === 'passed' ? 'bg-emerald-950/30 border-emerald-500/30' : cp.status === 'pending' ? 'bg-amber-950/30 border-amber-500/30' : 'bg-slate-950/50 border-slate-800'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {cp.status === 'passed' ? <CheckCircle size={14} className="text-emerald-400" /> : cp.status === 'pending' ? <Clock size={14} className="text-amber-400" /> : <Lock size={14} className="text-slate-600" />}
                      <span className="text-xs font-bold text-white">{cp.id}: {cp.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">{cp.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ PROFILE ════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Career Profile</h2>
                <p className="text-xs text-slate-400 mt-0.5">Single Source of Truth — all agent decisions are grounded in this data</p>
              </div>
              <button onClick={() => run('profile', '/profile/normalize', { user_profile: profile })}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20">
                {loading === 'profile' ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                Run ProfileMasterAgent
              </button>
            </div>

            {result && loading === null && (
              <Card className="border-emerald-500/30 bg-emerald-950/20">
                <p className="text-xs font-semibold text-emerald-300 mb-1">✓ ProfileMasterAgent Output</p>
                <p className="text-xs text-slate-300">Completeness: <strong className="text-white">{result.completeness_score}%</strong> · Verified Skills: <strong className="text-white">{result.verified_skills_count}</strong> / {result.total_skills} · Projects: <strong className="text-white">{result.projects_count}</strong></p>
              </Card>
            )}

            {/* Identity */}
            <Card>
              <SectionHeader icon={User} title="Identity & Contact" />
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Full Name', value: profile.full_name },
                  { label: 'Email', value: profile.email },
                  { label: 'Headline', value: profile.headline },
                  { label: 'University', value: profile.education[0]?.institution },
                  { label: 'Degree', value: profile.education[0]?.degree },
                  { label: 'Graduation', value: String(profile.education[0]?.end_year) },
                ].map(f => (
                  <div key={f.label} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 mb-0.5">{f.label}</p>
                    <p className="text-white font-medium truncate">{f.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card>
              <SectionHeader icon={Zap} title="Verified Skill Stack" subtitle={`${profile.skills.length} skills · ${profile.skills.filter(s => s.status === 'DEMONSTRATED').length} demonstrated`} />
              <div className="space-y-2">
                {profile.skills.map(skill => (
                  <div key={skill.name} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <Badge label={skill.status} variant={skill.status} />
                      <div>
                        <p className="text-xs font-semibold text-white">{skill.name}</p>
                        <p className="text-[10px] text-slate-500">{skill.category} · {skill.proficiency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skill.confidence_score * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500">{Math.round(skill.confidence_score * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Projects */}
            <Card>
              <SectionHeader icon={FolderGit2} title="Verified Projects" />
              <div className="space-y-3">
                {profile.projects.map(p => (
                  <div key={p.name} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-white">{p.name}</h3>
                      <div className="flex gap-1.5">
                        {p.repo_url && <a href={p.repo_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"><FolderGit2 size={12} className="text-slate-300" /></a>}
                        {p.live_demo_url && <a href={p.live_demo_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"><ExternalLink size={12} className="text-slate-300" /></a>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{p.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map(t => <span key={t} className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-[10px] font-medium rounded">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ JOB DISCOVERY ═══════════════════════════════════════════════════ */}
        {activeTab === 'jobs' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Job Discovery</h2>
                <p className="text-xs text-slate-400 mt-0.5">JobDiscoveryAgent + GapAnalyzerAgent · SHA-256 deduplication · 4-pillar match scoring</p>
              </div>
              <button onClick={() => run('jobs', '/jobs/discover', { user_profile: profile, limit: 10 }, setJobs.bind(null, (d: any) => d?.jobs || []))}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20">
                {loading === 'jobs' ? <RefreshCw size={13} className="animate-spin" /> : <Search size={13} />}
                Discover Jobs
              </button>
            </div>

            {jobs.length === 0 && (
              <Card className="flex flex-col items-center justify-center py-12 border-dashed">
                <Search size={32} className="text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Click <strong className="text-slate-400">Discover Jobs</strong> to run the JobDiscoveryAgent</p>
                <p className="text-xs text-slate-600 mt-1">Scores & ranks jobs from Rooster.lk, LinkedIn, and company sites</p>
              </Card>
            )}

            {jobs.length > 0 && (
              <div className="space-y-3">
                {jobs.map((job: any) => (
                  <Card key={job.id}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">{job.title}</h3>
                        <p className="text-xs text-slate-400">{job.company} · {job.location} {job.is_remote && '· Remote'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-sm font-extrabold ${job.match_score >= 80 ? 'text-emerald-400' : job.match_score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{job.match_score}%</span>
                        <span className="text-[10px] text-slate-500">match</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.demonstrated_skills?.map((s: string) => <span key={s} className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[10px] rounded"><CheckCircle size={9} className="inline mr-1" />{s}</span>)}
                      {job.confirmed_gaps?.map((s: string) => <span key={s} className="px-2 py-0.5 bg-red-950/40 border border-red-800/40 text-red-300 text-[10px] rounded"><AlertCircle size={9} className="inline mr-1" />{s}</span>)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setGapReport({ confirmed_gaps: job.confirmed_gaps }); setActiveTab('cv') }}
                        className="flex-1 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-600/30 text-indigo-300 text-xs font-semibold rounded-lg transition">
                        Tailor CV <ArrowRight size={11} className="inline ml-1" />
                      </button>
                      {job.url && <a href={job.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"><ExternalLink size={12} /></a>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ CV BUILDER ═══════════════════════════════════════════════════════ */}
        {activeTab === 'cv' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">ATS CV Builder</h2>
                <p className="text-xs text-slate-400 mt-0.5">GapAnalyzerAgent + CVOptimizerAgent + DeterministicTruthChecker · STAR framework · Zero hallucination</p>
              </div>
              <button onClick={async () => {
                setLoading('cv')
                const data = await callAgent('/analyze-and-tailor', { user_profile: profile, target_job: DEMO_JOB })
                setGapReport(data?.state_values?.skill_gap_report)
                setTailoredCV(data?.state_values?.tailored_cv_draft)
                setResult(data)
                setLoading(null)
              }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20">
                {loading === 'cv' ? <RefreshCw size={13} className="animate-spin" /> : <FileText size={13} />}
                Run CV Pipeline
              </button>
            </div>

            {/* Target Job */}
            <Card>
              <SectionHeader icon={Briefcase} title="Target Job" subtitle="LangGraph will tailor CV for this role" />
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <p className="text-sm font-bold text-white">{DEMO_JOB.title}</p>
                <p className="text-xs text-slate-400">{DEMO_JOB.company}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {DEMO_JOB.mandatory_requirements.map(r => <span key={r} className="px-2 py-0.5 text-[10px] bg-indigo-950/60 border border-indigo-800/30 text-indigo-300 rounded">Required: {r}</span>)}
                  {DEMO_JOB.preferred_requirements.map(r => <span key={r} className="px-2 py-0.5 text-[10px] bg-slate-800/60 border border-slate-700 text-slate-400 rounded">Preferred: {r}</span>)}
                </div>
              </div>
            </Card>

            {/* Gap Report */}
            {gapReport && (
              <Card>
                <SectionHeader icon={BarChart3} title="Skill Gap Analysis" badge={`${gapReport.match_score}% Match`} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Demonstrated ✓</p>
                    <div className="space-y-1">
                      {gapReport.demonstrated?.map((s: string) => <p key={s} className="flex items-center gap-1.5 text-xs text-slate-300"><CheckCircle size={11} className="text-emerald-400" />{s}</p>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-2">Gaps ✗</p>
                    <div className="space-y-1">
                      {gapReport.confirmed_gaps?.map((s: string) => <p key={s} className="flex items-center gap-1.5 text-xs text-slate-300"><XCircle size={11} className="text-red-400" />{s}</p>)}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Truth Check */}
            {result?.state_values && (
              <Card className={result.state_values.truth_check_passed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-red-500/40 bg-red-950/20'}>
                <div className="flex items-center gap-2">
                  {result.state_values.truth_check_passed
                    ? <><ShieldCheck size={16} className="text-emerald-400" /><p className="text-xs font-bold text-emerald-300">Deterministic Truth Checker: PASSED — Zero hallucinations detected</p></>
                    : <><AlertCircle size={16} className="text-red-400" /><p className="text-xs font-bold text-red-300">Truth Checker: VIOLATION DETECTED — Draft blocked</p></>
                  }
                </div>
              </Card>
            )}

            {/* H2 Approval Gate */}
            {result?.is_interrupted && (
              <Card className="border-amber-500/40 bg-amber-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-amber-400" />
                  <p className="text-sm font-bold text-amber-300">Checkpoint H2 — CV Review & Lock Required</p>
                </div>
                <p className="text-xs text-slate-400 mb-4">The LangGraph supervisor has paused at the Human Approval Gate. Review your tailored CV below and approve to lock it for submission.</p>
                <div className="flex gap-2">
                  <button onClick={() => run('approve', '/approve-cv', { thread_id: result.thread_id, approved: true, user_feedback: 'Approved' })}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
                    <CheckSquare size={13} /> Approve & Lock CV
                  </button>
                  <button className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
                    <XCircle size={13} /> Request Revision
                  </button>
                </div>
              </Card>
            )}

            {/* Tailored CV Preview */}
            {tailoredCV && (
              <Card>
                <SectionHeader icon={FileText} title="Tailored CV Draft" badge={tailoredCV.version_tag} />
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-500 mb-1">Tailored Headline</p>
                    <p className="text-white font-semibold">{tailoredCV.tailored_headline}</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-500 mb-1">Professional Summary</p>
                    <p className="text-slate-300 leading-relaxed">{tailoredCV.summary}</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-500 mb-2">STAR-Method Bullets</p>
                    <ul className="space-y-1.5">
                      {tailoredCV.tailored_bullets?.slice(0, 6).map((b: string, i: number) => (
                        <li key={i} className="flex gap-2 text-slate-300 leading-relaxed"><ChevronRight size={11} className="text-indigo-400 mt-0.5 shrink-0" />{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══ PORTFOLIO ════════════════════════════════════════════════════════ */}
        {activeTab === 'portfolio' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Portfolio Builder</h2>
                <p className="text-xs text-slate-400 mt-0.5">PortfolioBuilderAgent · Static site generator · Custom subdomain at nexcareer.lk</p>
              </div>
              <button onClick={() => run('portfolio', '/portfolio/build', { user_profile: profile, theme: 'cyber' }, setPortfolio)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20">
                {loading === 'portfolio' ? <RefreshCw size={13} className="animate-spin" /> : <Globe size={13} />}
                Build Portfolio
              </button>
            </div>

            {!portfolio ? (
              <Card className="flex flex-col items-center justify-center py-12 border-dashed">
                <Globe size={32} className="text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Click <strong className="text-slate-400">Build Portfolio</strong> to generate your personal site</p>
              </Card>
            ) : (
              <>
                <Card className="border-emerald-500/30 bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <p className="text-xs font-bold text-emerald-300">Portfolio ready for H4 approval</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{portfolio.subdomain}</span>
                  </div>
                </Card>
                {/* Mock Portfolio Preview */}
                <Card>
                  <SectionHeader icon={Globe} title="Live Preview" subtitle={`Theme: ${portfolio.theme} · ${portfolio.sections?.length} sections`} />
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    {/* Fake browser bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border-b border-slate-800">
                      <span className="w-3 h-3 rounded-full bg-red-500/60" /><span className="w-3 h-3 rounded-full bg-amber-500/60" /><span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                      <div className="flex-1 mx-2 bg-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-400 font-mono">{portfolio.subdomain}</div>
                    </div>
                    {/* Hero Section */}
                    <div className="p-6 space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-semibold">
                        <Sparkles size={10} /> IEEE INSL Top 25 Quarterfinalist · SUSL
                      </div>
                      <h1 className="text-2xl font-extrabold text-white leading-tight">Building intelligent,<br />full-stack AI systems.</h1>
                      <p className="text-xs text-slate-400 max-w-sm">{profile.headline}</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg">Contact Me</button>
                        <button className="px-4 py-2 text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 rounded-lg">GitHub</button>
                      </div>
                      {/* Skills preview */}
                      <div className="pt-2">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Verified Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.slice(0, 6).map(s => <span key={s.name} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg">{s.name}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                {/* H4 Gate */}
                <Card className="border-amber-500/40 bg-amber-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock size={14} className="text-amber-400" />
                    <p className="text-xs font-bold text-amber-300">Checkpoint H4 — Portfolio Publish Sign-off</p>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Approve to deploy your portfolio live at <span className="font-mono text-indigo-300">{portfolio.subdomain}</span></p>
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
                    <CheckSquare size={13} /> Approve & Publish Portfolio (H4)
                  </button>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ══ LEARNING PATH ════════════════════════════════════════════════════ */}
        {activeTab === 'learning' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Learning Path</h2>
                <p className="text-xs text-slate-400 mt-0.5">CurriculumAgent · Sequenced roadmap · Vetted free resources · Capstone projects</p>
              </div>
              <button onClick={() => run('learning', '/learning/path', { confirmed_gaps: ['Docker', 'Jest', 'Kubernetes', 'CI/CD'], weekly_hours: 10 }, setLearningPath)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20">
                {loading === 'learning' ? <RefreshCw size={13} className="animate-spin" /> : <BookOpen size={13} />}
                Generate Roadmap
              </button>
            </div>

            {!learningPath ? (
              <Card className="flex flex-col items-center justify-center py-12 border-dashed">
                <BookOpen size={32} className="text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Run the CurriculumAgent to generate your personalized learning roadmap</p>
              </Card>
            ) : (
              <>
                <Card className="border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-300">Total estimated: <strong className="text-white">{learningPath.total_estimated_hours}h</strong> over <strong className="text-white">{learningPath.total_estimated_weeks} weeks</strong> at 10h/week</p>
                    <Badge label={`${learningPath.total_gaps_addressed} gaps`} />
                  </div>
                </Card>
                <div className="space-y-4">
                  {learningPath.roadmap?.map((item: any, i: number) => (
                    <Card key={item.skill}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300">{i + 1}</span>
                        <h3 className="text-sm font-bold text-white">{item.skill}</h3>
                        <Badge label={item.priority} variant={item.priority === 'HIGH' ? 'DEMONSTRATED' : 'PARTIALLY_DEMONSTRATED'} />
                        <span className="ml-auto text-xs text-slate-500">{item.estimated_hours}h · ~{item.estimated_weeks}w</span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {item.resources?.map((r: any) => (
                          <a key={r.title} href={r.url} target="_blank" rel="noreferrer"
                            className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-indigo-500/40 transition group">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${r.type === 'COURSE' ? 'bg-purple-900/60 text-purple-300' : r.type === 'DOCS' ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>{r.type}</span>
                              <span className="text-xs text-slate-300 group-hover:text-white transition">{r.title}</span>
                            </div>
                            <ExternalLink size={11} className="text-slate-600 group-hover:text-indigo-400 transition" />
                          </a>
                        ))}
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40">
                        <p className="text-[10px] font-bold text-amber-300 mb-0.5">🚀 Capstone Project</p>
                        <p className="text-[11px] text-slate-400">{item.capstone_project}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ APPLICATIONS KANBAN ══════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">Application Tracker</h2>
              <p className="text-xs text-slate-400 mt-0.5">TelemetryTrackerAgent · 12-stage Kanban · SHA-256 H3 dispatch verification</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {['SAVED', 'ANALYZING', 'TAILORED', 'AWAITING_USER_APPROVAL', 'APPROVED', 'SUBMITTED', 'INTERVIEW_SCHEDULED', 'OFFERED'].map(status => {
                const apps = kanbanApps.filter(a => a.status === status)
                return (
                  <div key={status} className="shrink-0 w-52">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{status.replace(/_/g, ' ')}</span>
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-bold text-slate-500 flex items-center justify-center">{apps.length}</span>
                    </div>
                    <div className="space-y-2 min-h-16">
                      {apps.map(app => (
                        <div key={app.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/40 transition cursor-pointer">
                          <p className="text-xs font-bold text-white">{app.company}</p>
                          <p className="text-[10px] text-slate-400">{app.role}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-[10px] font-bold ${app.match_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{app.match_score}%</span>
                            <ChevronRight size={10} className="text-slate-600" />
                          </div>
                        </div>
                      ))}
                      {apps.length === 0 && <div className="h-16 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center"><Plus size={14} className="text-slate-700" /></div>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* H3 Gate */}
            <Card className="border-amber-500/40 bg-amber-950/20">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} className="text-amber-400" />
                <p className="text-xs font-bold text-amber-300">Checkpoint H3 — Dispatch Approval Gate</p>
              </div>
              <p className="text-xs text-slate-400 mb-3">No application can be submitted without a cryptographically signed user approval token (SHA-256 payload hash). Move a card to APPROVED to trigger this gate.</p>
              <button onClick={() => run('email', '/outreach/draft-email', { user_profile: profile, job: DEMO_JOB, email_type: 'APPLICATION' }, setResult)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl transition">
                {loading === 'email' ? <RefreshCw size={13} className="animate-spin" /> : <Mail size={13} />}
                Draft Application Email (OutreachMailAgent)
              </button>
              {result?.body && (
                <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-[10px] text-slate-500 mb-1">Subject: {result.subject}</p>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{result.body}</pre>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ══ AI ADVISOR ══════════════════════════════════════════════════════ */}
        {activeTab === 'advisor' && (
          <div className="p-6 flex flex-col h-full" style={{ maxHeight: 'calc(100vh - 0px)' }}>
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-white">AI Career Advisor</h2>
              <p className="text-xs text-slate-400 mt-0.5">StrategicAdvisorAgent · English / Tamil / Sinhala · Powered by Gemma via LM Studio</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-sm px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Quick prompts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['What are my skill gaps?', 'Help me with my CV', 'Sri Lankan salary benchmarks', 'How to apply for jobs?'].map(p => (
                <button key={p} onClick={() => { setChatInput(p) }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-medium rounded-lg transition">
                  {p}
                </button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); sendChat() }} className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about your career, skill gaps, salary, or job applications..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition" />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center gap-1.5 text-xs font-bold">
                <Send size={13} /> Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
