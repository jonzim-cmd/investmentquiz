import { loadQuizData } from './quizData.js';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function renderLeaderView() {
  const quizData = loadQuizData();
  const currentQ = localStorage.getItem("currentQuestion")
    ? JSON.parse(localStorage.getItem("currentQuestion"))
    : null;
  const questionsLeader = document.getElementById("questionsLeader");
  questionsLeader.innerHTML = "";

  // Für jede Kategorie wird ein Raster (Grid) erzeugt.
  for (const difficulty in quizData) {
    const questionsArray = quizData[difficulty];
    if (questionsArray && questionsArray.length > 0) {
      const section = document.createElement("div");
      section.className = "difficulty-section";
      section.innerHTML = `<h2>${capitalize(difficulty)} Fragen</h2>`;
      
      const grid = document.createElement("div");
      grid.className = "questions-grid";
      
      questionsArray.forEach((q, index) => {
        // Prüfe, ob dies die aktuell ausgewählte Frage ist
        const isCurrent =
          currentQ &&
          currentQ.difficulty === difficulty &&
          currentQ.index === index;
        const qDiv = document.createElement("div");
        qDiv.className = `leader-question ${isCurrent ? "current" : ""}`;
        qDiv.innerHTML = `
          <h3>${q.header ? q.header : `${difficulty.toUpperCase()}-Frage ${index + 1}`}</h3>
          <p><strong>Frage:</strong> ${q.question}</p>
          <p><strong>Antwort:</strong> ${q.explanation ? q.explanation : "Keine Erklärung vorhanden."}</p>
          <p><strong>Punkte:</strong> ${q.points}</p>
        `;
        grid.appendChild(qDiv);
      });
      
      section.appendChild(grid);
      questionsLeader.appendChild(section);
    }
  }
}

function renderTeamsLeader() {
  const teamsData = localStorage.getItem("teams")
    ? JSON.parse(localStorage.getItem("teams"))
    : [];
  const teamsContainer = document.getElementById("teamsContainerLeader");
  teamsContainer.innerHTML = "";
  
  // Teams werden in einem flexiblen Grid dargestellt, sodass sie immer auf eine Seite passen.
  teamsData.forEach(team => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "leader-team";
    teamDiv.innerHTML = `<h3>${team.name}</h3><p>${team.points} Punkte</p>`;
    teamsContainer.appendChild(teamDiv);
  });
}

document.getElementById("printButton").addEventListener("click", () => {
  window.print();
});

renderLeaderView();
renderTeamsLeader();
