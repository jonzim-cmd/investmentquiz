function openAnleitung() {
  const overlay = document.createElement("div");
  overlay.id = "anleitungOverlay";
  overlay.className = "anleitung-overlay";
  // Schließt das Modal, wenn außerhalb des Modals geklickt wird.
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      closeAnleitung();
    }
  });
  
  const modal = document.createElement("div");
  modal.className = "anleitung-modal";
  
  const closeButton = document.createElement("span");
  closeButton.className = "anleitung-close";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", closeAnleitung);
  modal.appendChild(closeButton);
  
  const contentContainer = document.createElement("div");
  contentContainer.className = "anleitung-content-container";
  contentContainer.innerHTML = `
    <div class="anleitung-content">
      <h2>Anleitung</h2>
      <p>Willkommen zum Quiz! Importieren Sie Ihre Fragen per Excel-Report, wählen Sie Ihre Teams und starten Sie spannende Runden. Neu: Die Spielleitersicht zeigt alle Fragen und Antworten druckfertig – live aktualisiert!</p>
      <ol>
        <li>
          <strong>Excel-Import:</strong>
          Laden Sie das Excel-Template herunter, bearbeiten Sie es mit Ihren Fragen (unterteilt in easy, medium, hard und death) und importieren Sie es über den "Excel Import"-Button.
        </li>
        <li>
          <strong>Team-Auswahl:</strong>
          Wählen Sie die Anzahl der Teams und starten Sie das Spiel. Nach Spielstart können die Teamnamen direkt im Spielbereich bearbeitet werden.
        </li>
        <li>
          <strong>Fragen &amp; Antworten:</strong>
          Wählen Sie eine Frage im Raster – der Timer startet automatisch. Mit "Antwort anzeigen" blenden Sie die Lösung ein oder aus. Richtig oder falsch bestätigen Sie über die entsprechenden Buttons.
        </li>
        <li>
          <strong>Spielleitersicht:</strong>
          Öffnen Sie die Spielleitersicht, um alle Fragen und Antworten in einem kompakten Raster (druckfertig auf DIN-A4) zu sehen. Änderungen, wie bearbeitete Teamnamen, werden live übernommen.
        </li>
        <li>
          <strong>Spielende:</strong>
          Das Spiel endet, wenn alle Fragen verwendet wurden. Das Team mit den meisten Punkten gewinnt.
        </li>
      </ol>
      <p>Viel Erfolg und vor allem viel Spaß beim Quiz!</p>
    </div>
  `;
  
  modal.appendChild(contentContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function closeAnleitung() {
  const overlay = document.getElementById("anleitungOverlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

window.openAnleitung = openAnleitung;
