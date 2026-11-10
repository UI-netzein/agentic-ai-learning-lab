const form = document.querySelector("#question-form");
const question = document.querySelector("#question");
const answer = document.querySelector("#answer");
const loading = document.querySelector("#loading");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    question: question.value.trim(),
    language: document.querySelector("#language").value.trim(),
    level: document.querySelector("#level").value,
  };
  if (!payload.question || !payload.language) return;

  answer.hidden = true;
  loading.hidden = false;
  try {
    const response = await fetch("/ask-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.status) throw new Error(result.message || "The coach could not answer.");
    answer.className = "answer-content answer-text";
    answer.textContent = result.message;
  } catch (error) {
    answer.className = "answer-content answer-text";
    answer.textContent = `Something went wrong: ${error.message}`;
  } finally {
    loading.hidden = true;
    answer.hidden = false;
  }
});
