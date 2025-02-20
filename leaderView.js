import { loadQuizData } from './quizData.js';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function renderLeaderView() {
  const container = document.getElementById("leaderContainer");
  container.innerHTML = "";
  const quizData = loadQuizData();
  for (const difficulty in quizData) {
    const questionsArray = quizData[difficulty];
    if (questionsArray && questionsArray.length > 0) {
      const difficultySection = document.createElement("section");
      difficultySection.innerHTML = `<h2>${capitalize(difficulty)} Fragen</h2>`;
      questionsArray.forEach((q, index) => {
        const qDiv = document.createElement("div");
        qDiv.className = "leader-question";
        qDiv.innerHTML = `
          <h3>${q.header ? q.header : `${difficulty.toUpperCase()}-Frage ${index + 1}`}</h3>
          <p><strong>Frage:</strong> ${q.question}</p>
          <p><strong>Antwort:</strong> ${q.explanation ? q.explanation : "Keine Erklärung vorhanden."}</p>
          <p><strong>Punkte:</strong> ${q.points}</p>
        `;
        difficultySection.appendChild(qDiv);
      });
      container.appendChild(difficultySection);
    }
  }
}

document.getElementById("printButton").addEventListener("click", () => {
  window.print();
});

renderLeaderView();
