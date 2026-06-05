/* ─────────────────────────────────────────
   AI SCOUT LITE — script.js
   Real API with demo fallback.
───────────────────────────────────────── */

// ── FALLBACK DEMO DATA ───────────────────
const DEMO_RESULTS = [
  {
    scoutScore: 74,
    summary: "A browser extension that wraps GPT-4 to summarize web content. Solves a genuine problem — information overload — but enters a market with at least a dozen near-identical tools already available on the Chrome Web Store.",
    whoItHelps: "Knowledge workers, researchers, and students who consume large volumes of online content daily. Particularly useful for people who do competitive research or literature reviews.",
    weaknesses: "Severe market saturation. No clear differentiator from Summarize!, TLDR This, or Perplexity's built-in summarization. Fully dependent on OpenAI pricing and uptime. Retention risk: users tend to abandon after the novelty wears off.",
    scores: { usefulness: 22, originality: 8, technical: 18, beginner: 21 },
    verdict: "WATCH",
    nextStep: "Identify one narrow vertical (e.g. legal docs, academic papers) and build a version that goes deeper than a bullet summary. Shallow summarization is commoditized — the edge is in structured extraction."
  },
  {
    scoutScore: 88,
    summary: "An open-source CLI tool that ingests a GitHub repo and produces a structured architecture document — dependency graph, module responsibilities, suggested refactor points — using a local LLM. Targets senior engineers doing onboarding or codebase audits.",
    whoItHelps: "Engineering leads, staff engineers, and consultants who regularly need to understand large codebases quickly. Also useful for open-source maintainers reviewing external contributions.",
    weaknesses: "Local LLM requirement creates real setup friction for non-technical users. Output quality degrades sharply on monorepos above ~200k lines. Limited value outside software teams.",
    scores: { usefulness: 23, originality: 20, technical: 24, beginner: 12 },
    verdict: "TRY",
    nextStep: "Ship a hosted version with a one-click 'analyze this repo' button on GitHub. Friction is the enemy. If someone can paste a GitHub URL and get results in 60 seconds, this becomes a viral tool in developer communities."
  },
  {
    scoutScore: 31,
    summary: "A mobile app that uses AI to rate photos of your meals and estimate calorie counts. Takes a photo, returns a score and nutrition breakdown. Multiple similar apps exist with the same core premise.",
    whoItHelps: "Fitness enthusiasts and people tracking macros. In practice, the audience skews toward people who already use MyFitnessPal and find manual logging tedious.",
    weaknesses: "Calorie estimation from photos has a well-documented ~30% error rate. The App Store already has Lose It, Calorie Mama, and Google Lens doing this for free. No sticky mechanic — why would a user return?",
    scores: { usefulness: 12, originality: 5, technical: 9, beginner: 14 },
    verdict: "SKIP",
    nextStep: "If you're set on this space, find one thing that existing apps do badly and build only that. Meal logging UX is genuinely painful — the opportunity is in the interface, not the AI."
  },
  {
    scoutScore: 61,
    summary: "A Slack bot that monitors team messages and surfaces a weekly communication health report — identifies exclusion patterns, flags passive-aggressive tone, and suggests who should be looped in on which threads.",
    whoItHelps: "Engineering managers and team leads at companies above 20 people. HR teams dealing with distributed team dynamics.",
    weaknesses: "Significant privacy concerns — employees will resist being sentiment-analyzed. Requires deep Slack permissions that security teams routinely block. Risk of false positives creating conflict rather than resolving it.",
    scores: { usefulness: 18, originality: 19, technical: 16, beginner: 7 },
    verdict: "WATCH",
    nextStep: "Reframe the product around opt-in team retrospectives rather than passive surveillance. Give individuals visibility into their own communication patterns first. Trust is the moat here."
  }
];

let demoIndex = 0;

// ── DOM REFS ─────────────────────────────
const input      = document.getElementById('projectInput');
const charCount  = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSec  = document.getElementById('resultSection');

// ── CHAR COUNTER ─────────────────────────
input.addEventListener('input', () => {
  const len = input.value.length;
  charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
});

// ── MAIN BUTTON HANDLER ──────────────────
analyzeBtn.addEventListener('click', async () => {
  const text = input.value.trim();

  if (text.length < 20) {
    shakeInput();
    return;
  }

  setLoading(true);
  removeDemoNotice();

  let result;
  let usedFallback = false;

  try {
    result = await analyzeReal(text);
  } catch (err) {
    console.warn('API call failed, using demo fallback:', err.message);
    result = getFallback();
    usedFallback = true;
  }

  renderResult(result);
  if (usedFallback) showDemoNotice();
  setLoading(false);
});

// ── REAL API CALL ────────────────────────
async function analyzeReal(text) {
  const res = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectDescription: text })
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  // Normalize API shape to internal render shape
  return {
    scoutScore: data.total_scout_score,
    summary:    data.summary,
    whoItHelps: data.who_it_helps,
    weaknesses: data.weaknesses,
    scores: {
      usefulness:  data.usefulness_score,
      originality: data.originality_score,
      technical:   data.technical_potential_score,
      beginner:    data.beginner_value_score,
    },
    verdict:  data.verdict,
    nextStep: data.next_step,
  };
}

// ── FALLBACK DATA ────────────────────────
function getFallback() {
  const r = DEMO_RESULTS[demoIndex % DEMO_RESULTS.length];
  demoIndex++;
  return r;
}

// ── DEMO MODE NOTICE ─────────────────────
function showDemoNotice() {
  if (document.getElementById('demoNotice')) return;

  const notice = document.createElement('div');
  notice.id = 'demoNotice';
  notice.textContent = 'Demo mode — API unavailable, showing sample data.';
  notice.style.cssText = `
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    color: var(--amber);
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    border-radius: 3px;
    padding: 0.5rem 0.9rem;
    margin-bottom: 1rem;
  `;

  resultSec.insertBefore(notice, resultSec.firstChild);
}

function removeDemoNotice() {
  const n = document.getElementById('demoNotice');
  if (n) n.remove();
}

// ── RENDER ───────────────────────────────
function renderResult(data) {
  const now = new Date();
  const ts  = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  document.getElementById('cardTimestamp').textContent = ts;

  const badge = document.getElementById('verdictBadge');
  badge.textContent = data.verdict;
  badge.className   = 'verdict-badge ' + data.verdict.toLowerCase();

  animateNumber('scoutScore', 0, data.scoutScore, 900);

  setTimeout(() => {
    document.getElementById('scoreBar').style.width = data.scoutScore + '%';
  }, 100);

  document.getElementById('summary').textContent    = data.summary;
  document.getElementById('whoItHelps').textContent = data.whoItHelps;
  document.getElementById('weaknesses').textContent = data.weaknesses;
  document.getElementById('nextStep').textContent   = data.nextStep;

  renderSubscore('sub-usefulness',  data.scores.usefulness,  25);
  renderSubscore('sub-originality', data.scores.originality, 25);
  renderSubscore('sub-technical',   data.scores.technical,   25);
  renderSubscore('sub-beginner',    data.scores.beginner,    25);

  resultSec.classList.add('visible');

  setTimeout(() => {
    resultSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── SUBSCORE RENDERER ────────────────────
function renderSubscore(id, value, max) {
  const el = document.getElementById(id);
  el.querySelector('.subscore-num').textContent = value;
  setTimeout(() => {
    el.querySelector('.subscore-bar').style.width = (value / max * 100) + '%';
  }, 200);
}

// ── COUNT-UP ANIMATION ───────────────────
function animateNumber(id, from, to, duration) {
  const el    = document.getElementById(id);
  const start = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// ── LOADING STATE ────────────────────────
function setLoading(on) {
  if (on) {
    analyzeBtn.classList.add('loading');
    analyzeBtn.querySelector('.btn-label').textContent = 'ANALYZING';
    analyzeBtn.querySelector('.btn-arrow').textContent = '⟳';
  } else {
    analyzeBtn.classList.remove('loading');
    analyzeBtn.querySelector('.btn-label').textContent = 'ANALYZE PROJECT';
    analyzeBtn.querySelector('.btn-arrow').textContent = '→';
  }
}

// ── SHAKE INPUT ──────────────────────────
function shakeInput() {
  const wrapper = document.querySelector('.input-wrapper');
  wrapper.style.animation = 'none';
  wrapper.offsetHeight;
  wrapper.style.animation = 'shake 0.4s ease';
  setTimeout(() => wrapper.style.animation = '', 400);
  input.focus();
  charCount.textContent = 'Need at least 20 characters';
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);