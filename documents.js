import { supabase } from "./supabase.js";

async function loadDocuments() {
    const listElement = document.getElementById("documents-list");

    try {
        const { data, error } = await supabase.storage.from("articulos").list("public");

        if (error) throw error;

        listElement.innerHTML = "";
        data.forEach((file) => {
            if (file.name.endsWith(".docx")) {
                const documentElement = document.createElement("div");
                documentElement.innerHTML = `
                    <p>${file.name}</p>
                    <button onclick="viewDocument('${file.name}')">Ver</button>
                `;
                listElement.appendChild(documentElement);
            }
        });
    } catch (err) {
        console.error("Error al cargar documentos:", err);
    }
}

async function viewDocument(fileName) {
    try {
        const { data, error } = await supabase.storage.from("articulos").download(`public/${fileName}`);

        if (error) throw error;

        const arrayBuffer = await data.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const modal = document.getElementById("document-modal");
        modal.style.display = "block";
        document.getElementById("document-content").innerHTML = result.value;
    } catch (err) {
        console.error("Error al leer el documento:", err);
    }
}

function closeModal() {
    const modal = document.getElementById("document-modal");
    modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", loadDocuments);
