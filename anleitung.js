function openAnleitung() {
  const overlay = document.createElement("div");
  overlay.id = "anleitungOverlay";
  overlay.className = "anleitung-overlay";
  
  // Schließt die Anleitung, wenn außerhalb des Modals geklickt wird
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
  closeButton.onclick = closeAnleitung;
  modal.appendChild(closeButton);

  // Versuche, den Inhalt von anleitung.html per fetch zu laden.
  fetch("anleitung.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Anleitung.");
      }
      return response.text();
    })
    .then(html => {
      const contentContainer = document.createElement("div");
      contentContainer.className = "anleitung-content-container";
      contentContainer.innerHTML = html;
      modal.appendChild(contentContainer);
    })
    .catch(err => {
      modal.innerHTML += "<p>Fehler beim Laden der Anleitung.</p>";
    });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function closeAnleitung() {
  const overlay = document.getElementById("anleitungOverlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}
