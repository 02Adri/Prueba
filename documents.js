import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", async () => {
    const documentsList = document.getElementById("documents-list");

    try {
        // Obtener lista de archivos
        const { data, error } = await supabase.storage
            .from('articulos')
            .list('public');

        if (error) {
            console.error("Error al cargar documentos:", error);
            return;
        }

        data.forEach((file) => {
            const fileElement = document.createElement("div");
            fileElement.innerHTML = `
                <p>${file.name}</p>
                <a href="https://<tu_supabase_url>/storage/v1/object/public/articulos/public/${file.name}" target="_blank">Ver Documento</a>
            `;
            documentsList.appendChild(fileElement);
        });
    } catch (err) {
        console.error("Error inesperado al cargar documentos:", err);
    }
});