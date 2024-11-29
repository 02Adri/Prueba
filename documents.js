import { supabase } from "./supabase.js";

async function loadDocuments() {
    const { data, error } = await supabase.storage.from("articulos").list("public");

    if (error) {
        console.error("Error al cargar documentos:", error.message);
        return;
    }

    const documentsList = document.getElementById("documents-list");
    documentsList.innerHTML = "";

    data.forEach((file) => {
        if (file.name.endsWith(".docx")) {
            const documentElement = document.createElement("div");
            documentElement.innerHTML = `
                <p>${file.name}</p>
                <button onclick="viewDocument('${file.name}')">Ver</button>
            `;
            documentsList.appendChild(documentElement);
        }
    });
}

async function viewDocument(fileName) {
    const { data, error } = await supabase.storage.from("articulos").download(`public/${fileName}`);

    if (error) {
        console.error("Error al descargar documento:", error.message);
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        mammoth.convertToHtml({ arrayBuffer: reader.result }).then((result) => {
            const modal = document.getElementById("document-modal");
            modal.style.display = "block";
            document.getElementById("document-content").innerHTML = result.value;
        });
    };
    reader.readAsArrayBuffer(data);
}

function closeModal() {
    document.getElementById("document-modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", loadDocuments);
