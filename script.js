const analyzeBtn = document.getElementById("analyzeBtn");
const projectInput = document.getElementById("projectInput");
const output = document.getElementById("output");

analyzeBtn.addEventListener("click", () => {
  const input = projectInput.value.trim();

  if (!input) {
    output.classList.remove("hidden");
    output.innerHTML = `
      <h2>Missing input</h2>
      <p>Paste an AI tool, startup idea, or GitHub project description first.</p>
    `;
    return;
  }

  const result = {
    summary: "This project helps users quickly understand whether an AI tool or project is worth trying.",
    helps: "Students, beginner builders, indie hackers, and people exploring new AI tools.",
    weaknesses: "The score depends on the quality of the user input and needs real API analysis for deeper accuracy.",
    usefulness: 22,
    originality: 18,
    technical: 19,
    beginner: 24,
    verdict: "TRY",
    nextStep: "Connect the app to Gemini API so every analysis is generated live."
  };

  const total = result.usefulness + result.originality + result.technical + result.beginner;

  output.classList.remove("hidden");
  output.innerHTML = `
    <h2>Scout Score</h2>
    <div class="score">${total}/100</div>
    <p class="verdict">${result.verdict}</p>

    <div class="grid">
      <div class="metric"><strong>${result.usefulness}</strong>Usefulness</div>
      <div class="metric"><strong>${result.originality}</strong>Originality</div>
      <div class="metric"><strong>${result.technical}</strong>Technical</div>
      <div class="metric"><strong>${result.beginner}</strong>Beginner Value</div>
    </div>

    <h3>Summary</h3>
    <p>${result.summary}</p>

    <h3>Who it helps</h3>
    <p>${result.helps}</p>

    <h3>Weaknesses</h3>
    <p>${result.weaknesses}</p>

    <h3>Next step</h3>
    <p>${result.nextStep}</p>
  `;
});