/*******************************
 * Hilfsfunktion: Ersten Buchstaben groß
 *******************************/
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/*******************************
 * Globale Variablen und Quiz-Logik
 *******************************/
const questions = {
  easy: [],
  medium: [],
  hard: [],
  death: []
};

let teams = [];
let currentTeam = 0;
let selectedQuestion = null;
let countdownInterval = null;
let timeLeft = 0;
let timerRunning = false;
let openInlineQuestionCard = null;

/*******************************
 * Spiel-Initialisierung und -Steuerung
 *******************************/
function initGame() {
  const teamCount = parseInt(document.getElementById("teamCount").value, 10);
  startGame(teamCount);
  document.getElementById("controls").style.display = "none";
}

function startGame(teamCount) {
  teams = Array.from({ length: teamCount }, (_, i) => ({
    name: `Team ${i + 1}`,
    points: 0
  }));
  
  Object.values(questions).forEach(category => {
    category.forEach(q => {
      q.used = false;
      q.selected = false;
      q.attempts = 0;
    });
  });

  currentTeam = 0;
  clearInterval(countdownInterval);
  timerRunning = false;
  renderTeams();
  createQuestionGrid();
  
  // Quiz-Daten und Teams sichern, damit die Leader View live aktualisiert werden kann
  localStorage.setItem("quizData", JSON.stringify(questions));
  localStorage.setItem("teams", JSON.stringify(teams));
}

function renderTeams() {
  const container = document.getElementById("teamsContainer");
  // Teamnamen als editierbare Input-Felder darstellen
  container.innerHTML = teams.map((team, index) => `
    <div class="team">
      <input type="text" class="team-name-input" data-index="${index}" value="${team.name}" />
      <div class="points">${team.points} Punkte</div>
    </div>
  `).join('');
  
  // Event-Listener, um Änderungen der Teamnamen zu speichern
  document.querySelectorAll(".team-name-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const idx = e.target.getAttribute("data-index");
      teams[idx].name = e.target.value;
      localStorage.setItem("teams", JSON.stringify(teams));
    });
  });
}

function createQuestionGrid() {
  const grid = document.getElementById("questionsGrid");
  grid.innerHTML = "";
  
  let hasQuestions = false;
  Object.entries(questions).forEach(([difficulty, items]) => {
    if (items.length) hasQuestions = true;
    items.forEach((q, index) => {
      const card = document.createElement("div");
      card.className = `question-card ${difficulty} ${q.used ? 'used' : ''} ${q.selected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="points-badge">${q.attempts > 0 ? Math.floor(q.points / 2) : q.points}</div>
        ${q.special ? '💀' : ''} ${q.header ? q.header : `${difficulty.toUpperCase()}-Frage ${index + 1}`}
      `;
      
      if (!q.used) {
        card.onclick = () => {
          toggleInlineQuestion(card, q, difficulty, index);
        };
      }
      grid.appendChild(card);
    });
  });
  if (!hasQuestions) {
    grid.innerHTML = `<p style="text-align:center; color:#ccc;">Noch keine Fragen importiert. Bitte laden Sie einen Excel Report hoch.</p>`;
  }
}

function toggleInlineQuestion(card, question, difficulty, index) {
  if (openInlineQuestionCard === card) {
    closeInlineQuestion();
    question.selected = false;
    return;
  }
  
  if (openInlineQuestionCard && openInlineQuestionCard !== card) {
    closeInlineQuestion();
  }
  
  selectedQuestion = question;
  question.selected = true;
  card.classList.add("selected");
  openInlineQuestionCard = card;
  
  // Speichere, welche Frage aktuell ausgewählt ist
  localStorage.setItem("currentQuestion", JSON.stringify({ difficulty, index }));
  
  let seconds;
  if (difficulty === 'easy') {
    seconds = parseInt(document.getElementById("timeEasy").value, 10) || 60;
  } else if (difficulty === 'medium') {
    seconds = parseInt(document.getElementById("timeMedium").value, 10) || 90;
  } else if (difficulty === 'hard') {
    seconds = parseInt(document.getElementById("timeHard").value, 10) || 120;
  } else if (difficulty === 'death') {
    seconds = parseInt(document.getElementById("timeDeath").value, 10) || 75;
  }
  timeLeft = seconds;
  timerRunning = false;
  
  const inlineContainer = document.createElement("div");
  inlineContainer.id = "inlineQuestionDisplay";
  inlineContainer.className = "question-display";
  inlineContainer.style.gridColumn = "1 / -1";
  
  let displayHTML = `
    <h3>${question.header ? question.header : `${difficulty.toUpperCase()}-Frage ${index + 1}`} (${question.attempts > 0 ? Math.floor(question.points / 2) : question.points} Punkte)</h3>
    <p>${question.question}</p>
    <div class="timer" id="timerDisplay">Timer: ${formatTime(seconds)}</div>
    <div class="timer-controls">
      <button id="timerControl">Timer starten</button>
      <button id="resetTimer">Timer zurücksetzen</button>
      <div class="judgementButtons" style="display:none; margin-left:10px;">
        <button data-answer="true">Richtig ✅</button>
        <button data-answer="false">Falsch ❌</button>
      </div>
    </div>
    <button data-action="showAnswer">Antwort anzeigen</button>
    <div class="explanation" style="display:none">
      ${question.explanation}
    </div>
  `;
  
  inlineContainer.innerHTML = displayHTML;
  card.parentNode.insertBefore(inlineContainer, card.nextSibling);
  
  inlineContainer.querySelector("#timerControl").addEventListener("click", () => {
    toggleTimer();
  });
  inlineContainer.querySelector("#resetTimer").addEventListener("click", () => {
    resetTimer();
  });
  
  inlineContainer.querySelector("button[data-action='showAnswer']").addEventListener("click", function() {
    const explanation = inlineContainer.querySelector(".explanation");
    const judgementButtons = inlineContainer.querySelector(".judgementButtons");
    if (explanation.style.display === 'block') {
      explanation.style.display = 'none';
      judgementButtons.style.display = 'none';
    } else {
      explanation.style.display = 'block';
      judgementButtons.style.display = 'block';
    }
  });
  
  inlineContainer.querySelector("button[data-answer='true']").addEventListener("click", function() {
    handleAnswer(true);
  });
  inlineContainer.querySelector("button[data-answer='false']").addEventListener("click", function() {
    handleAnswer(false);
  });
  
  toggleTimer();
}

function resetTimer() {
  const difficulty = Object.entries(questions).find(([_, cat]) => 
    cat.includes(selectedQuestion)
  )[0];
  
  if (difficulty === 'easy') timeLeft = parseInt(document.getElementById("timeEasy").value, 10) || 60;
  else if (difficulty === 'medium') timeLeft = parseInt(document.getElementById("timeMedium").value, 10) || 90;
  else if (difficulty === 'hard') timeLeft = parseInt(document.getElementById("timeHard").value, 10) || 120;
  else timeLeft = parseInt(document.getElementById("timeDeath").value, 10) || 75;
  
  updateTimerDisplay();
}

function toggleTimer() {
  const timerButton = document.getElementById('timerControl');
  if (!timerRunning) {
    timerRunning = true;
    timerButton.textContent = 'Timer stoppen';
    startTimer(timeLeft);
  } else {
    timerRunning = false;
    timerButton.textContent = 'Timer fortsetzen';
    clearInterval(countdownInterval);
  }
}

function startTimer(seconds) {
  timeLeft = seconds;
  updateTimerDisplay();
  
  countdownInterval = setInterval(() => {
    if (timerRunning) {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        if (selectedQuestion && !selectedQuestion.joker) {
          handleAnswer(false);
        }
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    timerDisplay.textContent = `Timer: ${formatTime(timeLeft)}`;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleAnswer(isCorrect) {
  if (!selectedQuestion) {
    console.error("Kein Frageobjekt ausgewählt!");
    return;
  }
  
  const currentQuestion = selectedQuestion;
  
  const inlineContainer = document.getElementById("inlineQuestionDisplay");
  if (inlineContainer) {
    inlineContainer.querySelectorAll("button[data-answer]").forEach(btn => btn.disabled = true);
  }
  
  clearInterval(countdownInterval);
  timerRunning = false;
  
  if (isCorrect) {
    const points = currentQuestion.attempts > 0 
      ? Math.floor(currentQuestion.points / 2)
      : currentQuestion.points;
    teams[currentTeam].points += points;
    currentQuestion.used = true;
  } else {
    currentQuestion.attempts++;
    if (currentQuestion.attempts >= 2) {
      currentQuestion.used = true;
    }
  }
  
  currentQuestion.selected = false;
  closeInlineQuestion();
  
  currentTeam = (currentTeam + 1) % teams.length;
  showTeamTransition(teams[currentTeam].name);
  
  renderTeams();
  createQuestionGrid();
  
  document.getElementById("questionDisplay").innerHTML = `
    <p>${isCorrect ? '✅ Richtige Antwort!' : '❌ Falsche Antwort oder Zeit abgelaufen!'}<br>
    Nächste Runde: ${teams[currentTeam].name}</p>
  `;
  
  localStorage.setItem("quizData", JSON.stringify(questions));
  localStorage.setItem("teams", JSON.stringify(teams));
  
  checkGameEnd();
}

function closeInlineQuestion() {
  const inline = document.getElementById("inlineQuestionDisplay");
  if (inline) inline.remove();
  if (openInlineQuestionCard) {
    openInlineQuestionCard.classList.remove("selected");
  }
  openInlineQuestionCard = null;
  selectedQuestion = null;
  localStorage.removeItem("currentQuestion");
}

function nextRound() {
  if (selectedQuestion) {
    selectedQuestion.selected = false;
  }
  closeInlineQuestion();
  currentTeam = (currentTeam + 1) % teams.length;
  showTeamTransition(teams[currentTeam].name);
  renderTeams();
  createQuestionGrid();
  document.getElementById("questionDisplay").innerHTML = `
    <p>Nächste Runde: ${teams[currentTeam].name}</p>
  `;
  checkGameEnd();
}

function checkGameEnd() {
  const allUsed = Object.values(questions).every(category => 
    category.every(q => q.used)
  );
  
  if (allUsed) {
    const winner = teams.reduce((prev, current) => 
      (prev.points > current.points) ? prev : current);
      
    alert(`🏆 Spielende! Gewinner ist ${winner.name} mit ${winner.points} Punkten!`);
    startGame(teams.length);
  }
}

function resetAll() {
  teams = [];
  currentTeam = 0;
  selectedQuestion = null;
  clearInterval(countdownInterval);
  timerRunning = false;
  openInlineQuestionCard = null;
  
  document.getElementById("teamsContainer").innerHTML = "";
  document.getElementById("questionsGrid").innerHTML = 
    `<p style="text-align:center; color:#ccc;">Noch keine Fragen importiert. Bitte laden Sie einen Excel Report hoch.</p>`;
  document.getElementById("questionDisplay").style.display = "none";
  document.getElementById("controls").style.display = "none";
  
  questions.easy = [];
  questions.medium = [];
  questions.hard = [];
  questions.death = [];
  
  const excelInput = document.getElementById("excelUpload");
  if (excelInput) {
    excelInput.value = '';
  }
  
  showToast("Alles zurückgesetzt!");
}

/*******************************
 * Toast-Funktion
 *******************************/
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(0,0,0,0.7)";
  toast.style.color = "#ecf0f1";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

/*******************************
 * Team Transition Effekt (neuer Stil)
 *******************************/
function showTeamTransition(teamName) {
  const transitionDiv = document.createElement("div");
  transitionDiv.className = "team-transition";
  transitionDiv.innerHTML = `<div class="next-label">als nächstes</div><div class="team-name">${teamName}</div>`;
  document.body.appendChild(transitionDiv);
  setTimeout(() => {
    transitionDiv.remove();
  }, 2500);
}

/*******************************
 * Öffnet die Spielleiteransicht in einem neuen Fenster
 *******************************/
function openLeaderView() {
  window.open("leaderView.html", "_blank");
}
