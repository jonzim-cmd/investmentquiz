// excel-import.js
// Benötigt: xlsx.full.min.js (https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js)

async function handleExcelUpload() {
  const fileInput = document.getElementById("excelUpload");
  fileInput.click();
  fileInput.onchange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Array of Arrays, leere Zellen werden als "" zurückgegeben
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      // Initialisiere leeres Import-Objekt
      const importedQuestions = { easy: [], medium: [], hard: [], death: [] };
      const categories = ["easy", "medium", "hard", "death"];
      const headerRegex = /(easy|medium|hard|death)\s*\d+/i;

      // Für jede Kategorie-Spalte (A=0, B=1, etc.)
      for (let colIndex = 0; colIndex < categories.length; colIndex++) {
        // Durchlaufe alle Zeilen
        for (let row = 0; row < json.length; row++) {
          const cell = json[row][colIndex];
          if (typeof cell === "string" && cell.trim() && cell.match(headerRegex)) {
            // Prüfe, ob Frage und Erklärung vorhanden sind (direkt in den nächsten zwei Zeilen)
            const questionText = json[row + 1] ? json[row + 1][colIndex] : "";
            const explanationText = json[row + 2] ? json[row + 2][colIndex] : "";
            if (!questionText.trim() || !explanationText.trim()) {
              showToast(`Fehler: Fehlende Frage oder Erklärung bei "${cell}"`);
              continue;
            }
            // Punkte-Vergabe je Kategorie
            let points;
            switch (categories[colIndex]) {
              case "easy": points = 200; break;
              case "medium": points = 400; break;
              case "hard": points = 600; break;
              case "death": points = 1000; break;
              default: points = 0;
            }
            const newQuestion = {
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
      showToast("Excel Import erfolgreich!");
    } catch (err) {
      console.error(err);
      showToast("Fehler beim Importieren der Excel-Datei.");
    }
  };
}

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
