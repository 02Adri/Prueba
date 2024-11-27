const CLIENT_ID = "862892524220-2mf3pqmk450jq1mgr79odr3i5vm1nq5l.apps.googleusercontent.com"; 
const API_KEY = "AIzaSyDT2rKbyxf1EKCLGn6abbYOlqrxBULa6tw";
const SCOPES ="https://www.googleapis.com/auth/drive.readonly";/*"https://www.googleapis.com/auth/drive.file"*/ 
const REDIRECT_URI = "https://pruebalealdiaz.netlify.app";
const FOLDER_ID="folders/1hayT2TtGlp27YGEwPyQrocwUr1FzXc4Z?usp=sharing";
// Guardar y recuperar tokens de localStorage
function saveToken(token) {
    localStorage.setItem("googleDriveAccessToken", token);
}

function getToken() {
    return localStorage.getItem("googleDriveAccessToken");
}

// Inicializar Google API
function initGoogleAPI() {
  /*  const tokenClient = google.accounts.oauth2.initTokenClient({
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

    tokenClient.requestAccessToken();*/
    gapi.load("client:auth2", () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            scope: SCOPES,
        }).then(() => {
            loadDocuments();
        });
    });
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
            //Configurar permisos publicos
            fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: "reader",
                    type: "anyone",
                }),
            })
            .then(() => {
                alert("Archivo subido y configurado como público correctamente.");
                window.location.href = "documents.html";
            })
            .catch((err) => console.error("Error al configurar permisos:", err));
        })
        
        .catch((err) => console.error("Error al subir archivo:", err));
}

// Cargar lista de documentos
function loadDocuments() {
    const documentsList = document.getElementById("documents-list");

    if (!documentsList) {
        console.error("El contenedor de documentos no existe.");
        return;
    }

    gapi.client.drive.files.list({
        pageSize: 10,
        fields: "files(id, name, createdTime)",
        q: "'me' in owners and trashed = false", // Cargar solo documentos del usuario autenticado
    }).then((response) => {
        const files = response.result.files;
        documentsList.innerHTML = ""; // Limpiar lista existente

        if (files && files.length > 0) {
            files.forEach((file) => {
                const documentElement = document.createElement("div");
                documentElement.innerHTML = `
                    <p><strong>Documento:</strong> ${file.name}</p>
                    <button onclick="viewDocument('${file.id}')">Ver Contenido</button>
                `;
                documentsList.appendChild(documentElement);
            });
        } else {
            documentsList.innerHTML = `<p>No se encontraron documentos.</p>`;
        }
    }).catch((err) => console.error("Error al cargar documentos:", err));
       /*"https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,createdTime)"*/ 
     /*  `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'%20in%20parents&fields=files(id,name,createdTime)`*/
   /* fetch( "https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,createdTime)", {
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
        .catch((err) => console.error("Error al cargar documentos:", err));*/
}

// Ver contenido de un documento
function viewDocument(fileId) {

    gapi.client.drive.files.get({
        fileId: fileId,
        alt: "media",
    }).then((response) => {
        const buffer = response.body;
        mammoth.convertToHtml({ arrayBuffer: buffer }).then((result) => {
            const modal = document.getElementById("document-modal");
            modal.innerHTML = `<div class="content">${result.value}</div>`;
            modal.style.display = "block";
        });
    }).catch((err) => console.error("Error al leer el archivo:", err));
  /*  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
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
        .catch((err) => console.error("Error al leer el archivo:", err));*/
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