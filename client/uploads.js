const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener el archivo seleccionado
  const fileInput = document.getElementById("fileInput").files[0];

  if (fileInput) {
    const formData = new FormData();
    formData.append("docxFile", fileInput); // "docxFile" coincide con el backend

    try {
      const response = await fetch("https://server-4-8x34.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Archivo subido correctamente a la carpeta");
        window.location.href = "documents.html"; // Redirigir a la página de documentos
      } else {
        alert("Error al subir el archivo");
      }
    } catch (error) {
      alert("Error al conectar con el servidor express");
      console.error(error);
    }
  } else {
    alert("Por favor, selecciona un archivo.");
  }
});
