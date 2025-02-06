document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById("excelUpload");
  if (!fileInput) return; // Sicherheit: falls das Element nicht gefunden wird
  fileInput.addEventListener("change", async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Array of Arrays; leere Zellen werden als "" zurückgegeben
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      // Initialisiere leeres Import-Objekt
      const importedQuestions = { easy: [], medium: [], hard: [], death: [] };
      const categories = ["easy", "medium", "hard", "death"];
      // Regex, das den fixen Teil, die Zahl und alle zusätzlichen Worte erfasst
      const headerRegex = /^(easy|medium|hard|death)\s*(\d+)(.*)$/i;

      // Für jede Kategorie-Spalte (A=0, B=1, etc.)
      for (let colIndex = 0; colIndex < categories.length; colIndex++) {
        // Durchlaufe alle Zeilen
        for (let row = 0; row < json.length; row++) {
          const cell = json[row][colIndex];
          if (typeof cell === "string" && cell.trim()) {
            const match = cell.match(headerRegex);
            if (match) {
              // Extrahiere: Kategorie, Frage-Nummer und zusätzlichen Text
              const categoryFromCell = match[1].toLowerCase();
              const questionNumber = match[2];
              const extraText = match[3].trim();
              const displayHeader = `${capitalize(categoryFromCell)} Frage ${questionNumber}${extraText ? " " + extraText : ""}`;

              // Frage und Erklärung aus den nächsten beiden Zeilen
              const questionText = json[row + 1] ? json[row + 1][colIndex] : "";
              const explanationText = json[row + 2] ? json[row + 2][colIndex] : "";
              if (!questionText.trim() || !explanationText.trim()) {
                showToast(`Fehler: Fehlende Frage oder Erklärung bei "${cell}"`);
                continue;
              }
              // Punkte je Kategorie
              let points;
              switch (categories[colIndex]) {
                case "easy": points = 200; break;
                case "medium": points = 400; break;
                case "hard": points = 600; break;
                case "death": points = 1000; break;
                default: points = 0;
              }
              const newQuestion = {
                header: displayHeader,
                question: questionText,
                explanation: explanationText,
                points: points,
                used: false,
                selected: false,
                attempts: 0,
                special: (categories[colIndex] === "death")
              };
              importedQuestions[categories[colIndex]].push(newQuestion);
              // Überspringe den Block (Header, Frage, Erklärung, Leerzeile)
              row += 3;
            }
          }
        }
      }

      // Merge-Logik: Bestehende Fragen bleiben erhalten
      const mergedQuestions = {
        easy: [...questions.easy, ...importedQuestions.easy],
        medium: [...questions.medium, ...importedQuestions.medium],
        hard: [...questions.hard, ...importedQuestions.hard],
        death: [...questions.death, ...importedQuestions.death]
      };

      // Aktualisiere den globalen Fragenpool
      Object.assign(questions, mergedQuestions);
      createQuestionGrid();
      // Nach Import: Zeige die Spielsteuerung (Team-Auswahl) an
      document.getElementById("controls").style.display = "flex";
      showToast("Excel Import erfolgreich!");
    } catch (err) {
      console.error(err);
      showToast("Fehler beim Importieren der Excel-Datei.");
    }
  });
});

// Diese Funktion setzt nun einfach den Wert zurück und öffnet den Dateiauswahl-Dialog.
function handleExcelUpload() {
  const fileInput = document.getElementById("excelUpload");
  if (fileInput) {
    fileInput.value = ''; // Damit auch die gleiche Datei erneut ausgewählt werden kann
    fileInput.click();
  }
}
