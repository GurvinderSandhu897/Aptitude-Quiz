export async function startQuiz(exclude = []) {
  const qs = exclude.length ? `?exclude=${exclude.join(",")}` : "";
  const res = await fetch(`/api/quiz/start${qs}`);
  if (!res.ok) throw new Error("Could not start the quiz");
  return res.json();
}

export async function submitQuiz(attemptId, answers) {
  const res = await fetch("/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attemptId, answers }),
  });
  if (!res.ok) throw new Error("Could not submit the quiz");
  return res.json();
}