import { writeFileSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const ROLES = [
  { slug: 'deepgram-restaurants',
    summary: 'Voice AI Forward Deployed Engineer who runs Deepgram nova-2-phonecall in production at Waxwing. Built the real-time pipeline (Deepgram STT → Gemini → ElevenLabs TTS over LiveKit Agents) with sub-second telephony latency budgets, plus a custom Twilio↔LiveKit G.711 audio bridge with ITU-reference-pinned codec tables. Owner of voice-agent module across a 4-engineer team. 575 voice-agent tests + 95 backend tests passing. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Deepgram STT (production user, daily)','Voice AI Pipelines (STT → LLM → TTS)','Forward Deployed Engineering','LiveKit Agents · Twilio Media Streams','G.711 mu-law · FIR Audio Resampling','Sub-Second Telephony Latency','Cross-Team Customer-Facing Work','Production AI Agents','Python (async, primary) · TypeScript','MS Data Science 3.96'],
  },
  { slug: 'brex',
    summary: 'AI Engineer with production-shipped agent systems and the full MCP / function-calling / RAG / tool-use stack. Owner of the Waxwing voice agent — 9-phase state machine, sub-coordinators (booking, email, retrieval, escalation, confidence), tool-retry policy, idempotency keys, audit logs. Architected a provider-agnostic LLM engine at Millennia integrating OpenAI / Anthropic / Google / xAI with tier-based routing. Strong SQL/PL-SQL background from 2.3 years at Deloitte. MS Data Science (UMBC, GPA 3.96).',
    competencies: ['Production AI Agents (MCP-adjacent sub-coordinators)','Function-Calling & Tool-Use Patterns','RAG over pgvector + HNSW','Multi-Provider LLM Engine (4 providers)','Agent Frameworks · Orchestration','Prompt-Injection Defense (20+ patterns)','SQL · PL/SQL · Database Optimization','Async Python (FastAPI, asyncpg) · TypeScript','Forward Deployed Customer-Facing Work','MS Data Science 3.96'],
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
        <li>Architected the <strong>Sigma-Anchored Hybrid Scoring</strong> engine + <strong>Score Convergence Funnel</strong> (content-hash → locked score in PostgreSQL ledger with anchor-version invalidation).</li>
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
        <li>Delivered workforce analytics; <strong>60% reduction in manual reporting effort</strong> via dashboards.</li>
        <li>Complex SQL + PL/SQL against Oracle HCM data models; <strong>data modeling, query performance tuning, schema design</strong>; data ingestion pipelines via HCM Data Loader, HCM Extracts, Oracle Integration Cloud.</li>
      </ul>
    </div>
  </div>
  <div class="section avoid-break">
    <div class="section-title">Projects</div>
    <div class="project">
      <div class="project-title">AI Voice Agent (Waxwing Voice) — Lead voice-agent engineer</div>
      <div class="project-desc">Production AI agent answering inbound phone calls 24/7. <strong>9-phase finite-state conversation machine</strong> with sub-coordinators (booking, email, retrieval, escalation, confidence) — MCP-adjacent scoped capability pattern. Tool-retry policy, idempotency on durable actions, audit logs on every action. <strong>VoicePipelineAgent over LiveKit Agents</strong>: Deepgram nova-2-phonecall STT → Gemini → ElevenLabs Turbo v2.5 TTS. Custom Twilio↔LiveKit audio bridge with ITU-pinned G.711 codec + FIR audio resampling. <strong>575 voice-agent tests + 95 backend tests</strong>.</div>
      <div class="project-tech">Python 3.12 · LiveKit Agents · Deepgram · Gemini · ElevenLabs · Twilio · pgvector · FastAPI · Postgres</div>
    </div>
    <div class="project">
      <div class="project-title">FameWeaver AI Backend (Millennia Ventures)</div>
      <div class="project-desc">AI-powered analysis platform with 8 craft-category analysis tools, 2 conversational agents with 4-layer prompt-injection defense, prose-to-screenplay converter, and visual pitch-deck generator. Sigma-Anchored Hybrid Scoring + Score Convergence Funnel = deterministic agent evaluation. Provider-agnostic 4-LLM engine.</div>
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
      <div class="skill-item"><span class="skill-category">AI Agents & LLM:</span> Production AI agents w/ multi-step orchestration, MCP-adjacent sub-coordinators, function-calling + tool-use patterns, finite-state conversation, prompt + context engineering, multi-provider LLM engines (OpenAI, Anthropic, Google, xAI), RAG over pgvector + HNSW, content-hash score convergence, streaming (SSE)</div>
      <div class="skill-item"><span class="skill-category">Voice AI:</span> LiveKit Agents · Deepgram STT · ElevenLabs TTS · Twilio Media Streams · G.711 mu-law · FIR audio resampling</div>
      <div class="skill-item"><span class="skill-category">Backend & Infra:</span> Python (async, primary), TypeScript / JavaScript, FastAPI, SQLAlchemy 2.x async, asyncpg, Alembic, Pydantic v2, Docker, AWS (EC2, S3), Linux, Git</div>
      <div class="skill-item"><span class="skill-category">Databases:</span> PostgreSQL, pgvector, Redis, MongoDB; data modeling, query performance tuning, schema design</div>
      <div class="skill-item"><span class="skill-category">Frontend:</span> Next.js 16, React 18, Tailwind CSS, Zustand, Framer Motion</div>
      <div class="skill-item"><span class="skill-category">AI-Assisted Dev:</span> Cursor, Claude Code (daily)</div>
      <div class="skill-item"><span class="skill-category">Classical ML & CV:</span> TensorFlow / Keras, YOLOv8, scikit-learn, spaCy, NLTK, OpenCV, Mediapipe, Roboflow, edge quantization</div>
    </div>
  </div>
</div>
</body></html>`;

let ok = 0, fail = 0;
for (const role of ROLES) {
  const htmlPath = `output/cv-akhil-mittapalli-${role.slug}-2026-05-14.html`;
  const pdfPath = `output/cv-akhil-mittapalli-${role.slug}-2026-05-14.pdf`;
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
