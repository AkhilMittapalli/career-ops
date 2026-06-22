// One-shot generator for Batch 3 tailored CVs.
// Per-role config (summary + competency tags + project order) feeds a shared HTML template.

import { writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const ROLES = [
  {
    slug: 'vapi',
    summary: 'AI Agent Engineer building production voice agents on LiveKit Agents — the platform space Vapi competes in. Architected a 9-phase state machine with sub-coordinators, tool-retry, idempotency, and audit logs at Waxwing Voice. Hand-rolled ITU-pinned G.711 mu-law codec + FIR audio resampling for telephony-grade audio. Owner of the entire voice-agent module across a 4-engineer team. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['AI Agent Platform Engineering','LiveKit Agents · VoicePipelineAgent','Agent Harness & State Machines','Sub-Coordinator Patterns','Tool Retry + Idempotency','G.711 mu-law · FIR Resampling','Voice AI Telephony Pipelines','Production LLM Systems','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  {
    slug: 'bland',
    summary: 'Voice AI Forward Deployed Engineer with end-to-end ownership of a production voice agent. Cross-team embedded engineering across backend / frontend / infra owners with cross-team contracts and ADR-locked decisions. Authored team-adopted Claude Bug Resolution Guide + Bug Design Spec — enablement tooling at scale. ITU-pinned G.711 codec + FIR audio resampling. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Voice AI Forward Deployment','Production Voice Agents (LiveKit Agents)','Cross-Team Embedded Engineering','Customer-Facing Technical Enablement','Tool Retry & Escalation Patterns','Multi-Tenant Safety','Sub-Second Telephony Latency','Python · TypeScript · async','Claude Code Daily','MS Data Science 3.96'],
  },
  {
    slug: 'elevenlabs',
    summary: 'Voice AI Forward Deployed Engineer who runs ElevenLabs Turbo v2.5 in production at Waxwing. Built the real-time pipeline (Deepgram STT → Gemini → ElevenLabs TTS over LiveKit Agents) with sub-second telephony latency budgets. Custom Twilio↔LiveKit G.711 audio bridge with ITU-reference-pinned codec tables. 575 voice-agent tests + 95 backend tests passing. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['ElevenLabs Turbo v2.5 (production user)','Voice AI Pipelines (STT → LLM → TTS)','Forward Deployed Engineering','LiveKit Agents · Twilio Media Streams','G.711 mu-law · FIR Audio Resampling','Sub-Second Telephony Latency','Cross-Team Customer-Facing Work','Production AI Agents','Python (async, primary) · TypeScript','MS Data Science 3.96'],
  },
  {
    slug: 'sierra',
    summary: 'Production AI agent engineer building what Sierra calls the Agent Development Lifecycle. Architected Sigma-Anchored Hybrid Scoring (deterministic σ_score + α-weighted LLM blend) and the Score Convergence Funnel (content-hash → locked score with anchor-version invalidation) at Millennia — the eval substrate for 8 production AI tools. Owner of Waxwing voice agent with 9-phase state machine, 575 tests. Cursor + Claude Code daily. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Agent Development Lifecycle (ADLC parallel)','Production AI Agents (Voice + Text)','Sigma-Anchored Hybrid Scoring','Score Convergence Funnel (content-hash anchored)','Multi-Step Agent Orchestration','Cursor + Claude Code Daily','Customer Obsession + Craftsmanship','Async Python · TypeScript','Multi-Tenant Safety at DB Layer','MS Data Science 3.96'],
  },
  {
    slug: 'cohere',
    summary: 'Applied AI Engineer specializing in agentic workflows. Architected a provider-agnostic LLM engine integrating 4 providers (OpenAI, Anthropic, Google, xAI) at Millennia. Built 2 production conversational AI agents with 4-layer prompt-injection defense and multi-turn memory. Owner of Waxwing voice agent with 9-phase state machine, sub-coordinator patterns, and tool-retry policies. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Applied AI Engineering','Agentic Workflows & Multi-Step Orchestration','Production LLM Systems (4-Provider Engine)','RAG over pgvector + HNSW','Prompt + Context Engineering','Conversational AI with Multi-Turn Memory','Agent Evaluation & Observability','Prompt-Injection Defense (20+ patterns)','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  {
    slug: 'cursor',
    summary: 'Production AI agent engineer who builds agent harnesses — same architectural pattern Cursor builds for the code agent. At Waxwing I own the voice-agent harness: 9-phase state machine, sub-coordinators (booking, email, retrieval, escalation), tool-retry policies, idempotency keys, and audit logs. Daily Cursor + Claude Code user. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Agent Harness Architecture','9-Phase State Machine (Voice Agent)','Sub-Coordinator Patterns','Tool-Retry & Escalation','Idempotency & Audit Logging','Production AI Agents','Cursor + Claude Code Daily','Evaluation Infrastructure','Python (async, primary)','MS Data Science 3.96'],
  },
  {
    slug: 'modal',
    summary: 'Forward Deployed ML Engineer with end-to-end shipping experience. Owned the full ML lifecycle solo at R/SEEK: image data collection → Roboflow annotation → YOLOv8 + CNN training → quantization → edge deployment (25% latency cut). Built production LLM systems at Millennia: provider-agnostic engine, RAG over pgvector + HNSW, content-hash dedup. Voice agent at Waxwing in production. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Forward Deployed ML Engineering','End-to-End ML Lifecycle','Production LLM Systems','Multi-Provider LLM Engines','RAG over pgvector + HNSW','Distributed AI Inference Patterns','Model Quantization · Edge Deployment','Customer-Facing Technical Enablement','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  {
    slug: 'vercel-fde-v0',
    summary: 'Forward Deployed Engineer with end-to-end customer shipping experience. Production AI agent ownership at Waxwing (575 tests) including cross-team embedded engineering, design-doc-driven workflows that Claude Code follows autonomously, and FDE-pattern customer engagement. Daily Cursor + Claude Code + v0 (Vercel) user. Next.js 16 + React 18 from FameWeaver platform work. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Forward Deployed Engineering','End-to-End Customer Shipping','Production AI Agents','Next.js 16 · React 18 · TypeScript','Cursor + v0 Daily','Claude Code-Driven Workflows','Cross-Team Embedded Engineering','Customer-Facing Technical Enablement','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  {
    slug: 'glean',
    summary: 'AI Platform Engineer who builds the eval infrastructure for production AI systems. Architected the Score Convergence Funnel (content-hash → locked score in PostgreSQL ledger with anchor-version invalidation) and Sigma-Anchored Hybrid Scoring (per-tool α-calibrated deterministic + LLM blend) at Millennia — the exact pattern Glean Evals & Observability builds. 575-test scenario suite at Waxwing covering jailbreak / Fair Housing entrapment / barge-in regressions. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['LLM Eval Infrastructure','Eval Runners + Harnesses (local/CI/scheduled)','Score Convergence Funnel (content-hash anchored)','Sigma-Anchored Hybrid Scoring (per-tool α)','Agent Observability & Audit Logging','Regression Tracking & Anchor Versioning','LLM-Powered Judges','Distributed Systems Patterns','Async Python · TypeScript','MS Data Science 3.96'],
  },
];

// Build HTML per role
const baseStyle = readFileSync('templates/cv-template.html', 'utf-8').match(/<style>([\s\S]*?)<\/style>/)[1];

const buildHtml = (role) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Akhil Mittapalli — CV</title>
<style>${baseStyle}</style></head>
<body>
<div class="page">
  <div class="header avoid-break">
    <h1>Akhil Mittapalli</h1>
    <div class="header-gradient"></div>
    <div class="contact-row">
      <span>Austin, TX (open to relocate)</span><span class="separator">|</span>
      <span>mittapalliakhil12@gmail.com</span><span class="separator">|</span>
      <span>(410) 710-3722</span><span class="separator">|</span>
      <a href="https://linkedin.com/in/akhilmittapalli">linkedin.com/in/akhilmittapalli</a><span class="separator">|</span>
      <a href="https://portfolio-delta-ten-gwe38gmdcn.vercel.app/">portfolio</a><span class="separator">|</span>
      <a href="https://github.com/AkhilMittapalli">github.com/AkhilMittapalli</a>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Professional Summary</div>
    <div class="summary-text">${role.summary}</div>
  </div>
  <div class="section">
    <div class="section-title">Core Competencies</div>
    <div class="competencies-grid">
      ${role.competencies.map(c => `<span class="competency-tag">${c}</span>`).join('\n      ')}
    </div>
  </div>
  <div class="section">
    <div class="section-title">Work Experience</div>
    <div class="job avoid-break">
      <div class="job-company">Millennia Ventures, Inc.</div>
      <div class="job-header"><div class="job-role">AI Engineer — FameWeaver Platform</div><div class="job-period">Nov 2025 – Apr 2026</div></div>
      <ul>
        <li>Architected a <strong>provider-agnostic LLM engine</strong> integrating 4 providers (OpenAI, Anthropic, Google, xAI) through a unified API with tier-based routing using Python <code>contextvars</code> for async-safe per-request selection.</li>
        <li>Designed and deployed <strong>2 production conversational AI agents</strong> (Faye, Character Chat) with multi-turn memory, context-aware prompting, and 4-layer security defense (input sanitization, 20+ regex injection patterns, output PII filtering, conversation history hardening).</li>
        <li>Architected the <strong>Sigma-Anchored Hybrid Scoring</strong> engine: <code>final_score = (1−α) · σ_score + α · llm_score</code> with per-tool α calibrated 0.35–0.50 for signal strength. Foundation for repeatable agent evaluation.</li>
        <li>Built the <strong>Score Convergence Funnel</strong>: content-hash → locked score in PostgreSQL ledger with anchor-version invalidation. Zero-deviation guarantee.</li>
        <li>Built a full <strong>RAG pipeline</strong> with token-aware chunking + semantic boundaries, OpenAI text-embedding-3-large (3072-dim), pgvector + HNSW (sub-100ms top-k), reranking, token-budget-aware context packing.</li>
        <li>Shipped <strong>65+ API routers, 120+ endpoints, 45+ backend modules, 8 specialized AI analysis tools</strong> in async Python (FastAPI, SQLAlchemy, asyncpg).</li>
      </ul>
    </div>
    <div class="job avoid-break">
      <div class="job-company">R/SEEK</div>
      <div class="job-header"><div class="job-role">ML Engineer — Autonomous Mobile Robot</div><div class="job-period">Feb 2025 – Oct 2025</div></div>
      <ul>
        <li>Owned the <strong>end-to-end ML lifecycle solo</strong>: image data collection, Roboflow annotation, YOLOv8 + CNN training (TF/Keras), evaluation, edge deployment.</li>
        <li>Model quantization + batch tuning, deployed to embedded edge hardware — <strong>25% end-to-end latency reduction</strong>.</li>
      </ul>
    </div>
    <div class="job avoid-break">
      <div class="job-company">Deloitte</div>
      <div class="job-header"><div class="job-role">Data Analyst — Oracle HCM Cloud Analytics</div><div class="job-period">Sept 2021 – Dec 2023</div></div>
      <ul>
        <li>Delivered workforce analytics; <strong>60% reduction in manual reporting effort</strong> via dashboards (OTBI, Power BI, Tableau).</li>
        <li>Complex SQL + PL/SQL against Oracle HCM data models; data ingestion pipelines via HCM Data Loader, HCM Extracts, Oracle Integration Cloud.</li>
        <li>ML and statistical models for workforce trend forecasting; AI-driven automation in Python, TensorFlow, Docker, AWS.</li>
      </ul>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Projects</div>
    <div class="project">
      <div class="project-title">AI Voice Agent (Waxwing Voice) — Lead voice-agent engineer</div>
      <div class="project-desc">Production AI agent answering inbound phone calls 24/7. <strong>9-phase finite-state conversation machine</strong> with sub-coordinators (booking, email, retrieval, escalation), tool-retry policy with handoff after 3 consecutive failures, idempotency on all durable actions via server-side dedup keys, audit logs on every durable action. <strong>VoicePipelineAgent over LiveKit Agents</strong>: Deepgram nova-2-phonecall STT (~150ms TTFB) → Gemini 2.0 Flash → ElevenLabs Turbo v2.5 TTS (~75ms TTFB). Custom <strong>Twilio↔LiveKit audio bridge</strong> with G.711 mu-law codec tables verified against ITU reference values, FIR-filtered 8 kHz ↔ 16 kHz resampling. <strong>575 voice-agent tests + 95 backend tests</strong> incl. jailbreak / Fair Housing / barge-in / mid-call disconnect.</div>
      <div class="project-tech">Python 3.12 · LiveKit Agents · Deepgram · Gemini · ElevenLabs · Twilio · pgvector · FastAPI · Postgres</div>
    </div>
    <div class="project">
      <div class="project-title">FameWeaver AI Backend (Millennia Ventures)</div>
      <div class="project-desc">AI-powered platform with 8 craft-category analysis tools, 2 conversational agents with 4-layer prompt-injection defense, prose-to-screenplay converter, and visual pitch-deck generator. Sigma-Anchored Hybrid Scoring + Score Convergence Funnel = deterministic agent evaluation. Provider-agnostic 4-LLM engine.</div>
      <div class="project-tech">Python 3.10 · FastAPI · SQLAlchemy async · pgvector · Redis · OpenAI · Anthropic · Google · xAI · Next.js 16 · React 18</div>
    </div>
    <div class="project">
      <div class="project-title">Team-Adopted AI-Assisted Development Standards</div>
      <div class="project-desc">Authored Claude Bug Resolution Guide + Bug Design Spec Guide — design docs precise enough that Claude Code follows them autonomously through SSH → branch → build → test → commit → PR.</div>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Education</div>
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Master of Professional Studies, Data Science — <span class="edu-org">University of Maryland Baltimore County (UMBC)</span></span>
        <span class="edu-year">Jan 2024 – Dec 2025</span>
      </div>
      <div class="edu-desc">GPA 3.96 / 4.00 · Baltimore, MD</div>
    </div>
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Bachelor of Engineering, Computer Engineering — <span class="edu-org">Osmania University</span></span>
        <span class="edu-year">Aug 2017 – Jun 2021</span>
      </div>
      <div class="edu-desc">GPA 3.66 / 4.00 · Hyderabad, India</div>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">AI Agents & LLM:</span> Production AI agents w/ multi-step orchestration, finite-state conversation, escalation + safety guardrails, prompt + context engineering, multi-provider LLM engines (OpenAI, Anthropic, Google, xAI), RAG over pgvector + HNSW, content-hash score convergence, streaming (SSE)</div>
      <div class="skill-item"><span class="skill-category">Voice AI:</span> LiveKit Agents · VoicePipelineAgent · Deepgram STT · ElevenLabs TTS · Twilio Media Streams · G.711 mu-law · FIR audio resampling</div>
      <div class="skill-item"><span class="skill-category">Eval Infrastructure:</span> Sigma-Anchored Hybrid Scoring (per-tool α-calibrated), Score Convergence Funnel (content-hash anchored), regression scenario suites, audit logging on durable actions</div>
      <div class="skill-item"><span class="skill-category">Backend & Infra:</span> Python (async, primary), TypeScript / JavaScript, FastAPI, SQLAlchemy 2.x async, asyncpg, Alembic, Pydantic v2, Docker, AWS (EC2, S3), Linux, Git</div>
      <div class="skill-item"><span class="skill-category">Frontend:</span> Next.js 16, React 18, Tailwind CSS, Zustand, Framer Motion</div>
      <div class="skill-item"><span class="skill-category">Databases:</span> PostgreSQL, pgvector, Redis, MongoDB</div>
      <div class="skill-item"><span class="skill-category">AI-Assisted Dev:</span> Cursor, Claude Code, v0 (Vercel) — daily</div>
      <div class="skill-item"><span class="skill-category">Classical ML & CV:</span> TensorFlow / Keras, YOLOv8, scikit-learn, spaCy, NLTK, OpenCV, Mediapipe, Roboflow, edge quantization</div>
    </div>
  </div>
</div>
</body></html>`;

let ok = 0, fail = 0;
for (const role of ROLES) {
  const htmlPath = `output/cv-akhil-mittapalli-${role.slug}-2026-05-13.html`;
  const pdfPath = `output/cv-akhil-mittapalli-${role.slug}-2026-05-13.pdf`;
  try {
    writeFileSync(htmlPath, buildHtml(role), 'utf-8');
    execSync(`node generate-pdf.mjs ${htmlPath} ${pdfPath} --format=letter`, { stdio: 'pipe' });
    console.log(`✓ ${role.slug}`);
    ok++;
  } catch (e) {
    console.log(`✗ ${role.slug}: ${e.message}`);
    fail++;
  }
}
console.log(`\nDone: ${ok} generated, ${fail} failed.`);
