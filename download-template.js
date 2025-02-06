function downloadExcelTemplate() {
  const groups = 5; 
  const data = [];

  for (let i = 1; i <= groups; i++) {
    data.push([`Easy ${i}`, `Medium ${i}`, `Hard ${i}`, `Death ${i}`]);
    data.push(["Beispiel Frage", "Beispiel Frage", "Beispiel Frage", "Beispiel Frage"]);
    data.push(["Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort", "Beispiel Antwort"]);
    if (i < groups) {
      data.push(["", "", "", ""]);
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  XLSX.writeFile(workbook, "quiz_template.xlsx");
}
