/*const CLIENT_ID =  "862892524220-2mf3pqmk450jq1mgr79odr3i5vm1nq5l.apps.googleusercontent.com";
const API_KEY =  "AIzaSyDT2rKbyxf1EKCLGn6abbYOlqrxBULa6tw";
const SCOPES ="https://www.googleapis.com/auth/drive.file";
const REDIRECT_URI ="https://pruebalealdiaz.netlify.app";

// Usa CLIENT_ID, API_KEY, SCOPES y REDIRECT_URI en el resto del código de igual manera.

// Almacenar el token de acceso
let accessToken = sessionStorage.getItem("accessToken") || null;

// Inicializar GIS para autenticación
function initGoogleAPI() {
    google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri:REDIRECT_URI,
        callback: (tokenResponse) => {
            accessToken = tokenResponse.access_token;
            console.log("Autenticación exitosa");
          /*  if (document.getElementById("documents-list")) {
                loadDocuments(); // Cargar documentos si estamos en la página de visualización
            }
           if(window.location.pathname.includes("documents.html")){
            loadDocuments()
           }
        },
    }).requestAccessToken();
}

//Guardar el token para poder utilizarlo desde multiples paginas
function saveAccessToken(token){
    sessionStorage.setItem("googleDriveAccessToken",token)
}
function getAccessToken(){
    return sessionStorage.getItem("googleDriveAccessToken")
}
//Asegurarnos de los que los elementos existan
 const authForm=document.getElementById("auth-form")
 const uploadForm=document.getElementById("upload-form")
  //funcion para validacion de autenticacion
  if(authForm){
  authForm.addEventListener("submit",function(event) {
    event.preventDefault()

    //Evaluamos el usuario y la contraseña
    const username=document.getElementById("username").value
    const password=document.getElementById("password").value

    //Realizamos un condicional el cual permitira que al momento de ser correcta te envie a la seccion de subir
    if(username === "admin" && password === "adminlaw")
    {
        document.getElementById("upload-section").style.display="block"
        document.getElementById("auth-form").style.display="none"
        initGoogleAPI()
    }
})
}

  
//Seccion para el manejo de subir documentos
if(uploadForm){
uploadForm.addEventListener("submit",function(event){
   

        event.preventDefault();
        const fileInput = document.getElementById("file-input");
        const file = fileInput.files[0];
        if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            alert("Archivo se subio correctamente")
            uploadFile(file);
        } else {
            alert("Por favor, sube un archivo Word (.docx).");
        }
})
}

//Funcion para guardar en localStorage

function saveDocumentData(name,content,date){
   let documents=JSON.parse(localStorage.getItem("documents")) || []
    documents.unshift({name,content,date})
    localStorage.setItem("documents",JSON.stringify(documents))

}


//Funcion para cargar los documentos en la pagina de visualizacion

function loadDocuments(){
 
    const documentsList = document.getElementById("documents-list");
    if (!documentsList) {
        console.error("El contenedor de documentos no existe.");
        return;
    }
    if (!accessToken) {
        console.error("Token de acceso no válido. Intenta autenticarte nuevamente.");
        return;
    }
    fetch(

        `https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,createdTime)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    )
        .then((res) => res.json())
        .then((data) => {
            const files = data.files; // Accedemos a los archivos
           
           //documentsList.innerHTML = "";  // Limpiar la lista antes de agregar los archivos
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
        }else {
            documentsList.innerHTML = `<p>No se encontraron documentos.</p>`;
        }
        })
        .catch((err) => console.error("Error al cargar documentos:", err))
}       

// Subir documentos a Google Drive
function uploadFile(file) {
    const metadata = {
        name: file.name,
        mimeType: file.type,
    };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
    })
        .then((res) => res.json())
        .then(() => {
            alert("Archivo subido correctamente");
             sessionStorage.setItem("redirectFromUpload","true")            
            window.location.href = "documents.html"; // Redirigir a la página de visualización
        })
        .catch((err) => console.error("Error al subir archivo:", err));
}


// Eliminar documentos de Google Drive
function deleteFile(fileId) {
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then(() => {
            alert("Archivo eliminado correctamente");
            loadDocuments();
        })
        .catch((err) => console.error("Error al eliminar archivo:", err));
}

document.addEventListener("DOMContentLoaded",function(){
    //Comprobamos si estamos en la pagina de visualizacion
    
    if(document.getElementById("documents-list")){
        if (!accessToken) {
            initGoogleAPI();
        } else {
            loadDocuments();
        }
      
        
    }
})
document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("redirectFromUpload")) {
        sessionStorage.removeItem("redirectFromUpload");
        loadDocuments();
    }
});
//Ver contenido del documento
function viewDocument(fileId) {
    if (!accessToken) {
        console.error("Token de acceso no válido.");
        return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            return mammoth
                .convertToHtml({ arrayBuffer: buffer }, {
                    convertImage: mammoth.images.inline((image) => {
                        return image.read("base64").then((base64) => {
                            return { src: `data:${image.contentType};base64,${base64}` };
                        });
                    }),
                })
                .then((result) => {
                    const modal = document.getElementById("document-modal");
                    modal.innerHTML = `
                        <div class="content">
                            ${result.value}
                        </div>
                    `;
                    modal.style.display = "block";
                });
        })
        .catch((err) => console.error("Error al leer el archivo de Word:", err));
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("document-modal");
    if (modal) {
        modal.style.display = "none";
    }
}
//Funcion para buscar y eliminar documentos
function searchAndDeleteDocument(){
    /*const deleteName=document.getElementById("delete-name").value
    if(!deleteName){
        alert("Ingresa el nombre del archivo a eliminar")
        return
    }
    let documents=JSON.parse(localStorage.getItem("documents")) || []
    const updateDocuments=documents.filter(doc=>doc.name !== deleteName)

    if(updateDocuments.length === documents.length){
        alert("Documento no encontrado en este almacenamiento")
    }else{
        localStorage.setItem("documents",JSON.stringify(updateDocuments))
        alert("Documento eliminado exitosamente")
    }

}

Cargar los documentos cuando se abre la pagina de visualizacion
if(window.location.pathname.includes("documents.html")){
    document.addEventListener("DOMContentLoaded",loadDocuments)
}
*/

/*

const CLIENT_ID = "862892524220-2mf3pqmk450jq1mgr79odr3i5vm1nq5l.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT2rKbyxf1EKCLGn6abbYOlqrxBULa6tw";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const REDIRECT_URI = "https://pruebalealdiaz.netlify.app";

// Guardar y recuperar tokens de localStorage
function saveToken(token) {
    localStorage.setItem("googleDriveAccessToken", token);
}

function getToken() {
    return localStorage.getItem("googleDriveAccessToken");
}

// Inicializar Google API
function initGoogleAPI() {
    const tokenClient = google.accounts.oauth2.initTokenClient({
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
        .then(() => {
            alert("Archivo subido correctamente.");
            window.location.href = "documents.html";
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

    fetch("https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,createdTime)", {
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

// Ver contenido de un documento
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
*/

const CLIENT_ID = "862892524220-2mf3pqmk450jq1mgr79odr3i5vm1nq5l.apps.googleusercontent.com";
const API_KEY = "AIzaSyDT2rKbyxf1EKCLGn6abbYOlqrxBULa6tw";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const REDIRECT_URI = "https://pruebalealdiaz.netlify.app";

// Token de acceso
let accessToken = localStorage.getItem("googleDriveAccessToken") || null;

// Inicializar Google API
function initGoogleAPI() {
    google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            accessToken = tokenResponse.access_token;
            localStorage.setItem("googleDriveAccessToken", accessToken);
            console.log("Autenticación exitosa");
            if (window.location.pathname.includes("documents.html")) {
                loadDocuments();
            }
        },
    }).requestAccessToken();
}

// Validación de autenticación
document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const uploadSection = document.getElementById("upload-section");

    if (authForm) {
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "admin" && password === "adminlaw") {
                authForm.style.display = "none";
                uploadSection.style.display = "block";
                initGoogleAPI();
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        });
    }

    // Manejar el evento de carga de archivos
    if (uploadSection) {
        const uploadForm = document.getElementById("upload-form");
        const fileInput = document.getElementById("file-input");

        uploadForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const file = fileInput.files[0];
            if (file) {
                uploadFile(file);
            } else {
                alert("Por favor selecciona un archivo para subir.");
            }
        });
    }
});



// Subir archivo a Google Drive
function uploadFile(file) {
    const metadata = {
        name: file.name,
        mimeType: file.type,
    };
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
    })
        .then((res) => res.json())
        .then((data) => {
            saveDocumentLocally(data.name, data.id);
            alert("Archivo subido correctamente");
            window.location.href = "documents.html";
        })
        .catch((err) => console.error("Error al subir archivo:", err));
}

// Guardar documento en localStorage
function saveDocumentLocally(name, id) {
    const documents = JSON.parse(localStorage.getItem("documents")) || [];
    documents.push({ name, id });
    localStorage.setItem("documents", JSON.stringify(documents));
}

// Cargar documentos desde localStorage
function loadDocuments() {
    const documentsList = document.getElementById("documents-list");
    if (!documentsList) {
        console.error("El contenedor de documentos no existe.");
        return;
    }

    const documents = JSON.parse(localStorage.getItem("documents")) || [];
    documentsList.innerHTML = "";

    if (documents.length > 0) {
        documents.forEach((doc) => {
            const documentElement = document.createElement("div");
            documentElement.innerHTML = `
                <p><strong>Documento:</strong> ${doc.name}</p>
                <button onclick="viewDocument('${doc.id}')">Ver Contenido</button>
                <button onclick="deleteFile('${doc.id}')">Eliminar</button>
            `;
            documentsList.appendChild(documentElement);
        });
    } else {
        documentsList.innerHTML = `<p>No se encontraron documentos.</p>`;
    }
}

// Ver contenido del documento
function viewDocument(fileId) {
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
            return mammoth
                .convertToHtml({ arrayBuffer: buffer })
                .then((result) => {
                    const modal = document.getElementById("document-modal");
                    modal.innerHTML = `<div class="content">${result.value}</div>`;
                    modal.style.display = "block";
                });
        })
        .catch((err) => console.error("Error al leer el archivo de Word:", err));
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById("document-modal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Eliminar archivo
function deleteFile(fileId) {
    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then(() => {
            removeDocumentLocally(fileId);
            alert("Archivo eliminado correctamente");
            loadDocuments();
        })
        .catch((err) => console.error("Error al eliminar archivo:", err));
}

// Eliminar documento de localStorage
function removeDocumentLocally(fileId) {
    const documents = JSON.parse(localStorage.getItem("documents")) || [];
    const updatedDocuments = documents.filter((doc) => doc.id !== fileId);
    localStorage.setItem("documents", JSON.stringify(updatedDocuments));
}

// Cargar documentos automáticamente en `documents.html`
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("documents.html")) {
        loadDocuments();
    }
});
