document.addEventListener("DOMContentLoaded", async () => {
    const documentsList = document.getElementById("documents-list");

    try {
        // Obtener metadatos de documentos desde Supabase
        const { data, error } = await supabase
            .from("documentos")
            .select("*");

        if (error) throw error;

        // Crear la lista de documentos
        data.forEach((doc) => {
            const documentElement = document.createElement("div");
            documentElement.innerHTML = `
                <p>${doc.name}</p>
                <a href="https://<YOUR-SUPABASE-BUCKET-URL>/${doc.url}" target="_blank">Ver Documento</a>
            `;
            documentsList.appendChild(documentElement);
        });
    } catch (err) {
        console.error("Error al cargar documentos:", err);
    }
});
