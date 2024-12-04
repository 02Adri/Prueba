/*async function fetchDocuments() {
  // Hacer una solicitud GET al servidor para obtener la lista de documentos
  const response = await fetch("https://server-3-0q00.onrender.com/documents");
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
      alert("Error al cargar los documentos, intentalo de nuevo");
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
*/
async function fetchDocuments() {
  // Hacer una solicitud GET al servidor para obtener la lista de documentos
  const response = await fetch("https://server-3-0q00.onrender.com/documents");
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    alert("Error al cargar los documentos, intenta de nuevo");
    return;
  }

  // Obtener la lista de documentos en formato JSON
  const documents = await response.json();
  
  // Obtener el contenedor de la lista de documentos en el HTML
  const documentList = document.getElementById("documentList");
  documentList.innerHTML = ""; // Limpiar cualquier contenido previo

  // Iterar sobre la lista de documentos y agregarlos a la lista en HTML
  documents.forEach((doc) => {
    const li = document.createElement("li");
    const viewButton = document.createElement("button");

    // Configuración del botón "Ver contenido"
    viewButton.textContent = "Ver contenido";
    viewButton.addEventListener("click", async () => {
      const fileUrl = `https://server-3-0q00.onrender.com/uploads/${doc}`;
      const content = await fetchAndProcessDocument(fileUrl);
      
      // Mostrar el contenido del documento en un modal o en un contenedor
      const contentContainer = document.getElementById("contentContainer");
      contentContainer.innerHTML = content || "No se pudo procesar el documento.";
    });

    li.textContent = doc;
    li.appendChild(viewButton);
    documentList.appendChild(li);
  });
}

async function fetchAndProcessDocument(fileUrl) {
  try {
    // Descargar el archivo desde la URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      alert("Error al descargar el documento");
      return null;
    }

    // Leer el archivo como ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Usar Mammoth.js para convertir el contenido del documento a HTML
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return `<pre>${value}</pre>`; // Devolver contenido procesado con formato HTML
  } catch (error) {
    console.error("Error procesando el documento:", error);
    return null;
  }
}

// Llamar a la función para cargar los documentos
fetchDocuments();
