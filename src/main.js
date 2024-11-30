document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
     const authForm = document.getElementById("auth-form");
    
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

    if (uploadForm) {
        uploadForm.addEventListener("submit", async(event) => {
            event.preventDefault();
            const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file || !file.name.endsWith('.docx')) {
        alert('Solo se permiten archivos .docx');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/.netlify/functions/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert('Archivo subido exitosamente');
        } else {
            alert('Error al subir archivo: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error inesperado.');
    }
        
           
        });
        
       
    }
   
});
async function loadDocuments() {
    try {
        const response = await fetch('/.netlify/functions/list-files');
        const files = await response.json();

        const documentsList = document.getElementById('documents-list');
        documentsList.innerHTML = '';

        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${file}</span>
                <button onclick="viewDocument('/articulos/${file}')">Ver</button>
            `;
            documentsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
    }
}

async function viewDocument(filePath) {
    try {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();

        const result = await mammoth.convertToHtml({ arrayBuffer });
        const modal = document.getElementById('document-modal');
        modal.style.display = 'block';
        document.getElementById('document-content').innerHTML = result.value;
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
}

function closeModal() {
    const modal = document.getElementById('document-modal');
    modal.style.display = 'none';
}