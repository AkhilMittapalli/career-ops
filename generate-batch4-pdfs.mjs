import { writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const ROLES = [
  { slug: 'fireworks',
    summary: 'Production AI Engineer building the application layer that calls fast LLM inference platforms like Fireworks. Architected a provider-agnostic LLM engine at Millennia integrating 4 providers with async-safe per-request routing. Production RAG over pgvector + HNSW for sub-100ms top-k similarity, content-hash deduplication for embedding cost optimization, and streaming (SSE) response paths. Voice agent at Waxwing with sub-second telephony turn budgets. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['AI Inference Infrastructure (Customer Side)','Multi-Provider LLM Engine','Sub-100ms Vector Retrieval (pgvector + HNSW)','Content-Hash Embedding Cache','Streaming (SSE)','Async Python at Production Scale','FastAPI · SQLAlchemy async · asyncpg','Distributed Systems Patterns','3+ Years AI/ML Production Engineering','MS Data Science 3.96'],
  },
  { slug: 'together-backend-data',
    summary: 'Backend AI Engineer with production-scale data and ML pipelines. Built a hybrid chunking pipeline at Millennia (token-aware splitting + semantic boundary detection + configurable overlap) for documents up to 150,000 words, plus content-hash deduplication for embedding cost optimization. RAG over pgvector + HNSW with hybrid metadata retrieval. Async Python throughout (FastAPI, SQLAlchemy async, asyncpg). Strong SQL/PL-SQL background from Deloitte enterprise data work. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['AI Data Products & Backend','Hybrid Chunking & Retrieval Pipelines','Content-Hash Deduplication','RAG Engineering (pgvector + HNSW)','Async Python (FastAPI · asyncpg)','Embedding Cost Optimization','Streaming (SSE) Token Delivery','SQL · PL/SQL · Data Pipelines','Production AI Systems','MS Data Science 3.96'],
  },
  { slug: 'together-ai-infra',
    summary: 'AI Infrastructure Engineer with production multi-provider LLM engine experience. Architected the provider-agnostic engine at Millennia integrating OpenAI / Anthropic / Google / xAI with tier-based routing via Python contextvars for async-safe per-request model selection. Production RAG over pgvector + HNSW with sub-100ms top-k similarity. Twilio↔LiveKit G.711 codec from spec for telephony-grade voice infrastructure. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['AI Inference Infrastructure','Multi-Provider Routing (4 providers)','Python contextvars · async-safe routing','Production RAG Infrastructure','pgvector + HNSW · sub-100ms','Streaming (SSE) Token Pipelines','Distributed Systems Patterns','Telephony Audio Codec (ITU spec)','Voice AI Infrastructure','MS Data Science 3.96'],
  },
  { slug: 'together-ml-platform',
    summary: 'ML Platform Engineer with developer-facing tooling experience. Built end-to-end ML lifecycle at R/SEEK (data collection → annotation → training → quantization → edge deploy with 25% latency cut). Production LLM platform at Millennia with provider-agnostic engine, RAG pipeline, content-hash eval determinism. Authored team-adopted Claude Bug Resolution + Bug Design Spec Guides as developer productivity tooling. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['ML Platform Engineering','Developer-Facing AI Tooling','End-to-End ML Lifecycle (R/SEEK)','Model Quantization · Edge Deployment','Production LLM Platform','Content-Hash Eval Determinism','Claude Code-Driven Workflows','Distributed Systems Patterns','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  { slug: 'arize',
    summary: 'AI Engineer with depth in production agent security and observability. Built 4-layer prompt-injection defense for Faye assistant at FameWeaver (input sanitization, 20+ regex injection patterns, output PII/secret filtering, conversation history hardening per turn). Multi-tenant safety at DB query level in Waxwing voice agent. TypeScript + Next.js + React at Millennia frontend. Score Convergence Funnel (content-hash anchored eval ledger) for deterministic LLM observability. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Agentic AI Security','Prompt-Injection Defense (20+ regex)','Output Filtering (PII · Secrets · Paths)','Multi-Tenant Safety at DB Layer','LLM Observability (content-hash anchored)','Audit Logging on Durable Actions','TypeScript · React · Next.js','DevSecOps for AI Systems','Async Python (FastAPI, asyncpg)','MS Data Science 3.96'],
  },
  { slug: 'anthropic-enterprise-tech',
    summary: 'Applied AI Engineer with production Claude integration experience. Architected a provider-agnostic LLM engine at Millennia integrating Anthropic Claude alongside OpenAI, Google, and xAI through a unified API with tier-based routing via Python contextvars. Built 2 production conversational AI agents with 4-layer prompt-injection defense and multi-turn memory. Voice agent at Waxwing with 9-phase state machine, sub-coordinators, tool-retry policies, and audit logs. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Applied AI Engineering','Anthropic Claude Production Integration','Multi-Provider LLM Engine Architecture','Agent Architectures & Sub-Coordinators','Prompt + Context Engineering','Evaluation Frameworks','Customer-Facing Technical Enablement','RAG over pgvector + HNSW','Async Python · TypeScript','MS Data Science 3.96'],
  },
];

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
        <li>Architected the <strong>Sigma-Anchored Hybrid Scoring</strong> engine: <code>final_score = (1−α) · σ_score + α · llm_score</code> with per-tool α calibrated 0.35–0.50.</li>
        <li>Built the <strong>Score Convergence Funnel</strong>: content-hash → locked score in PostgreSQL ledger with anchor-version invalidation.</li>
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
      </ul>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Projects</div>
    <div class="project">
      <div class="project-title">AI Voice Agent (Waxwing Voice) — Lead voice-agent engineer</div>
      <div class="project-desc">Production AI agent answering inbound phone calls 24/7. <strong>9-phase finite-state conversation machine</strong> with sub-coordinators (booking, email, retrieval, escalation), tool-retry policy, idempotency on durable actions, audit logs on every action. <strong>VoicePipelineAgent over LiveKit Agents</strong>: Deepgram STT (~150ms TTFB) → Gemini 2.0 Flash → ElevenLabs TTS (~75ms TTFB). Custom Twilio↔LiveKit audio bridge with G.711 mu-law codec tables verified against ITU reference values + FIR-filtered audio resampling. <strong>575 voice-agent tests + 95 backend tests</strong>.</div>
      <div class="project-tech">Python 3.12 · LiveKit Agents · Deepgram · Gemini · ElevenLabs · Twilio · pgvector · FastAPI · Postgres</div>
    </div>
    <div class="project">
      <div class="project-title">FameWeaver AI Backend (Millennia Ventures)</div>
      <div class="project-desc">AI-powered analysis platform with 8 craft-category analysis tools, 2 production conversational agents with 4-layer prompt-injection defense, prose-to-screenplay converter, and visual pitch-deck generator. Sigma-Anchored Hybrid Scoring + Score Convergence Funnel = deterministic agent evaluation. Provider-agnostic 4-LLM engine.</div>
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
      <div class="skill-item"><span class="skill-category">Eval Infrastructure:</span> Sigma-Anchored Hybrid Scoring, Score Convergence Funnel (content-hash anchored), regression scenario suites, audit logging</div>
      <div class="skill-item"><span class="skill-category">Backend & Infra:</span> Python (async, primary), TypeScript / JavaScript, FastAPI, SQLAlchemy 2.x async, asyncpg, Alembic, Pydantic v2, Docker, AWS (EC2, S3), Linux, Git</div>
      <div class="skill-item"><span class="skill-category">Frontend:</span> Next.js 16, React 18, Tailwind CSS, Zustand, Framer Motion</div>
      <div class="skill-item"><span class="skill-category">Databases:</span> PostgreSQL, pgvector, Redis, MongoDB</div>
      <div class="skill-item"><span class="skill-category">AI-Assisted Dev:</span> Cursor, Claude Code (daily)</div>
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
