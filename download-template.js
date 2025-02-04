// download-template.js
// Diese Datei benötigt ebenfalls die xlsx-Bibliothek (xlsx.full.min.js).
// Stelle sicher, dass im HTML die xlsx-Bibliothek vor dieser Datei eingebunden wird.

function downloadExcelTemplate() {
  // Es sollen 2 Gruppen erzeugt werden, jeweils mit:
  // Zeile 1: Überschriften (z. B. "Easy 1", "Medium 1", "Hard 1", "Death 1")
  // Zeile 2: "Frage" in allen Spalten (mit führendem Leerzeichen, wenn gewünscht)
  // Zeile 3: "Antwort" in allen Spalten (mit führendem Leerzeichen, wenn gewünscht)
  // Zeile 4: Leere Zeile als Trenner

  const groups = 2; 
  const data = [];

  for (let i = 1; i <= groups; i++) {
    // Header-Zeile: z. B. "Easy 1", "Medium 1", "Hard 1", "Death 1"
    data.push([`Easy ${i}`, `Medium ${i}`, `Hard ${i}`, `Death ${i}`]);
    // Zeile mit "Frage" (wie in der Vorlage – hier ohne extra Leerzeichen, passe gerne an)
    data.push(["Frage", "Frage", "Frage", "Frage"]);
    // Zeile mit "Antwort"
    data.push(["Antwort", "Antwort", "Antwort", "Antwort"]);
    // Leere Zeile als Trenner
    data.push(["", "", "", ""]);
    // Header-Zeile: z. B. "Easy 1", "Medium 1", "Hard 1", "Death 1"
    data.push([`Easy ${i}`, `Medium ${i}`, `Hard ${i}`, `Death ${i}`]);
    // Zeile mit "Frage" (wie in der Vorlage – hier ohne extra Leerzeichen, passe gerne an)
    data.push(["Frage", "Frage", "Frage", "Frage"]);
    // Zeile mit "Antwort"
    data.push(["Antwort", "Antwort", "Antwort", "Antwort"]);
    // Leere Zeile als Trenner
    data.push(["", "", "", ""]);
  }

  // Erstelle ein Arbeitsblatt aus dem Array of Arrays
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Erstelle ein neues Arbeitsbuch (Workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  // Speichere das Arbeitsbuch als Excel-Datei
  XLSX.writeFile(workbook, "quiz_template.xlsx");
}
