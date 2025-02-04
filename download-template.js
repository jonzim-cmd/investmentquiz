// download-template.js
// Diese Datei benötigt ebenfalls die xlsx-Bibliothek (xlsx.full.min.js)
// Stelle sicher, dass die Bibliothek vor dieser Datei eingebunden wird.

function downloadExcelTemplate() {
  // Erstelle einen Array of Arrays (AOA) – jede innere Zeile entspricht einer Zeile in der Excel-Datei.
  // Wir legen für jede Kategorie (Spalte) einen Block mit 4 Zeilen an.
  const data = [
    // Erste Zeile: Überschriften für jede Kategorie
    ["Easy 1", "Medium 1", "Hard 1", "Death 1"],
    // Zweite Zeile: Beispiel-Fragen
    ["Beispiel Frage", "Beispiel Frage", "Beispiel Frage", "Beispiel Frage"],
    // Dritte Zeile: Beispiel-Antworten
    ["Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort"],
    // Vierte Zeile: Leerzeile (optional)
    ["", "", "", ""]
  ];

  // Erstelle ein Arbeitsblatt aus dem Array
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Erstelle ein neues Arbeitsbuch (Workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  // Speichere das Arbeitsbuch als Excel-Datei; der Dateiname kann angepasst werden
  XLSX.writeFile(workbook, "quiz_template.xlsx");
}
