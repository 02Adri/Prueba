async function fetchDocuments() {
  // Hacer una solicitud GET al servidor para obtener la lista de documentos
  const response = await fetch("https://server-3-0q00.onrender.com/documents");
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
      alert("Error al cargar los documentos");
      return;
  }
  
  // Obtener la lista de documentos en formato JSON
  const documents = await response.json();
  
  // Obtener el contenedor de la lista de documentos en el HTML
  const documentList = document.getElementById("documentList");
  
  // Iterar sobre la lista de documentos y agregarlos a la lista en HTML
  documents.forEach((doc) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="https://server-3-0q00.onrender.com/uploads/${doc}" target="_blank">${doc}</a>`;
      documentList.appendChild(li);
  });
}

// Llamar a la función para cargar los documentos
fetchDocuments();
