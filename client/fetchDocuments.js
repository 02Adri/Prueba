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
/*async function fetchDocuments() {
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
*/

/*async function fetchDocuments() {
  // Hacer una solicitud GET al servidor para obtener la lista de documentos
  const response = await fetch("https://server-3-0q00.onrender.com/documents");
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
      alert("Error al cargar los documentos, inténtalo de nuevo");
      return;
  }
  
  // Obtener la lista de documentos en formato JSON
  const documents = await response.json();
  
  // Obtener el contenedor de la lista de documentos en el HTML
  const documentList = document.getElementById("documentList");
  documentList.innerHTML = ""; // Limpiar la lista existente
  
  // Iterar sobre la lista de documentos y agregarlos a la lista en HTML
  documents.forEach((doc) => {
      const li = document.createElement("li");
      li.innerHTML = `<button onclick="viewDocument('${doc}')">${doc}</button>`;
      documentList.appendChild(li);
  });
}

async function viewDocument(fileName) {
  // Mostrar el nombre del archivo
  const fileNameElement = document.getElementById("fileName");
  fileNameElement.textContent = `Archivo: ${fileName}`;

  // Hacer una solicitud para obtener el archivo .docx como ArrayBuffer
  const response = await fetch(`https://server-3-0q00.onrender.com/uploads/${fileName}`);
  if (!response.ok) {
      document.getElementById("fileContent").textContent = "Error al cargar el archivo.";
      return;
  }
  
  const arrayBuffer = await response.arrayBuffer();
  
  // Procesar el archivo con Mammoth.js
  mammoth.convertToHtml({ arrayBuffer }, {
      includeDefaultStyleMap: true,
      convertImage: mammoth.images.inline((element) => {
          return {
              src: `data:${element.contentType};base64,${element.read("base64")}`
          };
      }),
  })
  .then((result) => {
      // Mostrar el contenido del archivo en el visor
      document.getElementById("fileContent").innerHTML = result.value;
  })
  .catch((error) => {
      document.getElementById("fileContent").textContent = "Error al procesar el archivo.";
      console.error(error);
  });
}

// Llamar a la función para cargar los documentos al cargar la página
fetchDocuments();
*/
async function fetchDocuments() {
  const response = await fetch("https://server-3-0q00.onrender.com/documents");
  if (!response.ok) {
    alert("Error al cargar los documentos, inténtalo de nuevo");
    return;
  }

  const documents = await response.json();
  const documentList = document.getElementById("documentList");

  // Limpiar la lista antes de renderizar
  documentList.innerHTML = "";

  documents.forEach((doc) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `Ver contenido de ${doc}`;
    button.style.cursor = "pointer";

    // Añadir evento para cargar el contenido del documento al hacer clic
    button.addEventListener("click", () => viewDocumentContent(doc));
    li.appendChild(button);
    documentList.appendChild(li);
  });
}

async function viewDocumentContent(doc) {
  try {
    const documentContent = document.getElementById("documentContent");
    documentContent.innerHTML = "<p>Cargando contenido del documento...</p>";

    // Descargar el archivo desde el servidor
    const response = await fetch(`https://server-3-0q00.onrender.com/uploads/${doc}`);
    if (!response.ok) {
      documentContent.innerHTML = "<p>Error al cargar el contenido del documento.</p>";
      return;
    }

    const arrayBuffer = await response.arrayBuffer();

    // Usar Mammoth.js para extraer texto y contenido
    const result = await Mammoth.convertToHtml({ arrayBuffer }, {
      convertImage: mammoth.images.inline(async (element) => {
        const imageData = await element.read("base64");
        return `<img src="data:image/${element.contentType};base64,${imageData}" />`;
      })
    });

    // Mostrar el contenido y el nombre del archivo
    documentContent.innerHTML = `
      <div class="document-header">Archivo: ${doc}</div>
      <div>${result.value}</div>
    `;
  } catch (error) {
    console.error("Error al mostrar el contenido del documento:", error);
  }
}

// Llamar a la función para cargar los documentos
fetchDocuments();