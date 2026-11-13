const form = document.querySelector("#question-form");
const answer = document.querySelector("#answer");
const loading = document.querySelector("#loading");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.submitter;
  const question = document.querySelector(`#${button.dataset.input}`);
  const prompt = question.value.trim();
  if (!prompt) return;

  const payload = {
    question: prompt,
  };

  answer.hidden = true;
  loading.hidden = false;
  try {
    const response = await fetch(button.dataset.endpoint, {
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
