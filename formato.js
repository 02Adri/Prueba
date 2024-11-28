/*const CLIENT_ID = "862892524220-2mf3pqmk450jq1mgr79odr3i5vm1nq5l.apps.googleusercontent.com"; 
const API_KEY = "AIzaSyDT2rKbyxf1EKCLGn6abbYOlqrxBULa6tw";
const SCOPES ="https://www.googleapis.com/auth/drive.file";
const REDIRECT_URI = "https://pruebalealdiaz.netlify.app";

let tokenClient;
// Guardar y recuperar tokens de localStorage
function saveToken(token) {
    localStorage.setItem("googleDriveAccessToken", token);
}

function getToken() {
    return localStorage.getItem("googleDriveAccessToken");
}

// Inicializar Google API
function initGoogleAPI() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        callback: (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            saveToken(accessToken);
            console.log("Autenticación exitosa.");
            if (window.location.pathname.includes("documents.html")) {
                loadDocuments();
            }
        },
    });

    tokenClient.requestAccessToken();
   
}

// Validación de autenticación
document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const uploadForm = document.getElementById("upload-form");
    const viewDocumentsLink=document.getElementById("view-documents-link");

    if (authForm) {
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "admin" && password === "adminlaw") {
                document.getElementById("upload-section").style.display = "block";
                document.getElementById("auth-form").style.display = "none";
                initGoogleAPI();
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const fileInput = document.getElementById("file-input");
            const file = fileInput.files[0];

            if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                alert("Archivo válido. Subiendo...");
                uploadFile(file);
            } else {
                alert("Por favor, sube un archivo Word (.docx).");
            }
        });
    }
      //link de documents.html
      if(viewDocumentsLink){
        viewDocumentsLink.addEventListener("click",(event)=>{
            event.preventDefault();
            window.location.href="/documents.html";
            loadDocuments()
        })
      }
    // Cargar documentos si estamos en la página correspondiente
    if (window.location.pathname.includes("documents.html")) {
        if (getToken()) {
            loadDocuments();
        } else {
            initGoogleAPI();
        }
    }
});

// Subir archivo a Google Drive
function uploadFile(file) {
    const metadata = {
        name: file.name,
      //  parents:[FOLDER_ID],
        mimeType: file.type,
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
    })
        .then((res) => res.json())
        .then((fileData) => {
            makeFilePublic(fileData.id);
            
              /* alert("Archivo subido y configurado como público correctamente.");
                window.location.href = "documents.html";
           
        })
        
        .catch((err) => console.error("Error al subir archivo:", err));
}

//hacer publico el archivo de google drive
function  makeFilePublic(fileId){
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokenClient.token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role: "reader",
            type: "anyone",
        }),
    })
        .then(() => {
            console.log("Archivo hecho público.");
            alert("Archivo subido correctamente y disponible para todos.");
            //saveFileToDatabase(fileId);
            loadDocuments();
        })
        .catch((err) => console.error("Error al hacer público el archivo:", err));
}
//Guardamos el ID del archivo en una base de datos Simple
function saveFileToDatabase(fileId) {
    let fileDatabase = JSON.parse(localStorage.getItem("fileDatabase")) || [];
    fileDatabase.push(fileId);
    localStorage.setItem("fileDatabase", JSON.stringify(fileDatabase));
    window.location.href = "documents.html";
}
// Cargar lista de documentos
function loadDocuments() {
  //  const fileDatabase = JSON.parse(localStorage.getItem("fileDatabase")) || [];
    const documentsList = document.getElementById("documents-list");

    if (!documentsList) {
        console.error("El contenedor de documentos no existe.");
        return;
    }

    documentsList.innerHTML = "";

  /*  if (fileDatabase.length > 0) {
        fileDatabase.forEach((fileId) => {
            const documentElement = document.createElement("div");
            documentElement.innerHTML = `
                <p><strong>Documento:</strong> ID ${fileId}</p>
                <button onclick="viewDocument('${fileId}')">Ver Contenido</button>
                 <button onclick="deleteFile('${fileId}')">Eliminar</button>
            `;
            documentsList.appendChild(documentElement);
        });
    } else {
        documentsList.innerHTML = `<p>No se encontraron documentos.</p>`;
    }*/

    
       /*"https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,createdTime)"*/ 
     /*  `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'%20in%20parents&fields=files(id,name,createdTime)`
   fetch( 'https://www.googleapis.com/drive/v3/files', {
       headers: { Authorization: `Bearer ${getToken()}` },
    })
        .then((res) => res.json())
        .then((data) => {
            const files = data.files;
            documentsList.innerHTML = ""; // Limpiar lista existente

            if (files && files.length > 0) {
                files.forEach((file) => {
                    const documentElement = document.createElement("div");
                    documentElement.innerHTML = `
                        <p><strong>Documento:</strong> ${file.name}</p>
                        <button onclick="viewDocument('${file.id}')">Ver Contenido</button>
                        <button onclick="deleteFile('${file.id}')">Eliminar</button>
                    `;
                    documentsList.appendChild(documentElement);
                });
            } else {
                documentsList.innerHTML = `<p>No se encontraron documentos.</p>`;
            }
        })
        .catch((err) => console.error("Error al cargar documentos:", err));
}

//Ver contenido de un documento
function viewDocument(fileId) {

    
   fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            return mammoth.convertToHtml({ arrayBuffer: buffer }).then((result) => {
                const modal = document.getElementById("document-modal");
                modal.innerHTML = `<div class="content">${result.value}</div>`;
                modal.style.display = "block";
            });
        })
        .catch((err) => console.error("Error al leer el archivo:", err));
}

// Eliminar archivo
function deleteFile(fileId) {
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    })
        .then(() => {
            alert("Archivo eliminado correctamente.");
            loadDocuments();
        })
        .catch((err) => console.error("Error al eliminar archivo:", err));
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("document-modal");
    modal.style.display = "none";
}

function viewDocument(fileId) {
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            return mammoth.convertToHtml({ arrayBuffer: buffer }).then((result) => {
                const modal = document.getElementById("document-modal");
                modal.innerHTML = `<div class="content">${result.value}</div>`;
                modal.style.display = "block";
            });
        })
        .catch((err) => console.error("Error al leer el archivo:", err));
}



*/





document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const authForm = document.getElementById("auth-form");
    const viewDocumentsLink = document.getElementById("view-documents-link");
    const documentsList = document.getElementById("documents-list");
    
    // Autenticación simple
    if (authForm) {
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "admin" && password === "adminlaw") {
                document.getElementById("upload-section").style.display = "block";
                document.getElementById("auth-form").style.display = "none";
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        });
    }

    // Subir archivo y simular almacenamiento en carpeta `articulos`
    if (uploadForm) {
        uploadForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const fileInput = document.getElementById("file-input");
            const file = fileInput.files[0];

            if (!file) {
                alert("Por favor selecciona un archivo.");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const blob = new Blob([reader.result], { type: file.type });
                const fileUrl = URL.createObjectURL(blob); // URL temporal del archivo
                saveDocument(file.name, fileUrl);
                alert("Archivo subido correctamente.");
            };

            reader.readAsArrayBuffer(file);
        });
    }

    // Mostrar documentos al hacer clic
    if (viewDocumentsLink) {
        viewDocumentsLink.addEventListener("click", (event) => {
            event.preventDefault();
            loadDocuments();
            window.location.href = "/documents.html";
        });
    }

    loadDocuments();
});

// Guardar documentos en el navegador (simulación de carpeta 'articulos')
function saveDocument(fileName, fileUrl) {
    let documents = JSON.parse(localStorage.getItem("documents")) || [];
    documents.push({ name: fileName, url: fileUrl });
    localStorage.setItem("documents", JSON.stringify(documents));
}

// Cargar documentos desde localStorage
function loadDocuments() {
    const documentsList = document.getElementById("documents-list");
    documentsList.innerHTML = ''; // Limpiar la lista antes de cargar

    const documents = JSON.parse(localStorage.getItem("documents")) || [];
    documents.forEach(doc => {
        const documentElement = document.createElement("div");
        documentElement.innerHTML = `
            <p>${doc.name}</p>
            <button onclick="viewDocument('${doc.url}')">Ver</button>
        `;
        documentsList.appendChild(documentElement);
    });
}

// Ver contenido del documento
function viewDocument(filePath) {
    fetch(filePath)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            return mammoth.convertToHtml({ arrayBuffer: buffer }).then((result) => {
                const modal = document.getElementById("document-modal");
                modal.style.display = "block";
                document.getElementById("document-content").innerHTML = result.value;
            });
        })
        .catch((err) => console.error("Error al leer el documento:", err));
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("document-modal");
    modal.style.display = "none";
}

















// Cargar documentos desde la carpeta "articulos"
/*function loadDocuments() {
    const savedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];
    const documentsList = document.getElementById("documents-list");

    if (!documentsList) return;

    documentsList.innerHTML = "";

    if (savedFiles.length > 0) {
        savedFiles.forEach((file) => {
            const documentElement = document.createElement("div");
            documentElement.innerHTML = `
                <p><strong>Documento:</strong> ${file.name}</p>
                <button onclick="viewDocument('${file.content}')">Ver Contenido</button>
            `;
            documentsList.appendChild(documentElement);
        });
    } else {
        documentsList.innerHTML = "<p>No se encontraron documentos.</p>";
    }
}

// Ver contenido del archivo
function viewDocument(content) {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<iframe style="width: 100%; height: 100%;" src="${content}"></iframe>`);
}
*/





