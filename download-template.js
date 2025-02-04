// download-template.js
// Diese Datei benötigt ebenfalls die xlsx-Bibliothek (xlsx.full.min.js).
// Stelle sicher, dass im HTML die xlsx-Bibliothek vor dieser Datei eingebunden wird.

function downloadExcelTemplate() {
  // Es sollen 2 Gruppen erzeugt werden.
  // Jede Gruppe besteht aus:
  // Zeile 1: Überschriften (z. B. "Easy 1", "Medium 1", "Hard 1", "Death 1")
  // Zeile 2: "Beispiel Frage" in allen Spalten
  // Zeile 3: "Beispiel Antwort" in allen Spalten
  // Nach jeder Gruppe (außer der letzten) folgt eine leere Zeile als Trenner.
  const groups = 5; 
  const data = [];

  for (let i = 1; i <= groups; i++) {
    // Überschriften-Zeile
    data.push([`Easy ${i}`, `Medium ${i}`, `Hard ${i}`, `Death ${i}`]);
    // Zeile mit "Beispiel Frage"
    data.push(["Beispiel Frage", "Beispiel Frage", "Beispiel Frage", "Beispiel Frage"]);
    // Zeile mit "Beispiel Antwort"
    data.push(["Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort"]);
    // Nur zwischen Gruppen: Leere Zeile als Trenner
    if (i < groups) {
      data.push(["", "", "", ""]);
    }
  }

  // Erstelle ein Arbeitsblatt aus dem Array of Arrays
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Erstelle ein neues Arbeitsbuch (Workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  // Speichere das Arbeitsbuch als Excel-Datei
  XLSX.writeFile(workbook, "quiz_template.xlsx");
}
