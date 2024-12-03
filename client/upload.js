const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Obtener el archivo seleccionado por el usuario
  const fileInput = document.getElementById("fileInput").files[0];

  // Verificar si se seleccionó un archivo
  if (fileInput) {
    // Crear un FormData para enviar el archivo
    const formData = new FormData();
    formData.append("docxFile", fileInput); // "docxFile" debe coincidir con el nombre del campo de archivo en el backend

    // Enviar el archivo al backend
    const response = await fetch("https://server-3-0q00.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    // Manejar la respuesta
    if (response.ok) {
      alert("Archivo subido correctamente");
      window.location.href = "documents.html"; // Redirigir a la página de documentos
    } else {
      alert("Error al subir el archivo");
    }
  } else {
    alert("Por favor, selecciona un archivo.");
  }
});
