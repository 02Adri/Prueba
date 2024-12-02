document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const documentsList = document.getElementById("documentsList");
  
    const loadDocuments = async () => {
      const response = await fetch("/api/documents");
      const documents = await response.json();
      documentsList.innerHTML = "";
      documents.forEach((doc) => {
        const div = document.createElement("div");
        div.classList.add("document");
        div.textContent = doc.name;
        documentsList.appendChild(div);
      });
    };
  
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const file = fileInput.files[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("Archivo subido exitosamente");
        loadDocuments();
      } else {
        alert("Error al subir el archivo");
      }
    });
  
    loadDocuments();
  });
  