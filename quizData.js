export function loadQuizData() {
  const data = localStorage.getItem("quizData");
  return data ? JSON.parse(data) : { easy: [], medium: [], hard: [], death: [] };
}
