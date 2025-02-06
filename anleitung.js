function openAnleitung() {
  let overlay = document.createElement("div");
  overlay.id = "anleitungOverlay";
  overlay.className = "anleitung-overlay";
  
  let modal = document.createElement("div");
  modal.className = "anleitung-modal";
  
  let closeButton = document.createElement("span");
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
      let contentContainer = document.createElement("div");
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
  let overlay = document.getElementById("anleitungOverlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}
