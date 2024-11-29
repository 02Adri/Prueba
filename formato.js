import { supabase } from "./supabase";

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const uploadSection = document.getElementById("upload-section");
    const uploadForm = document.getElementById("upload-form");
   
    // Autenticación
    if (authForm) {
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (username === "admin" && password === "adminlaw") {
                authForm.style.display = "none";
                uploadSection.style.display = "block";
            } else {
                alert("Usuario o contraseña incorrectos.");
            }
        });
    }

    // Subir Archivos
    if (uploadForm) {
        uploadForm.addEventListener("submit", async(event) => {
            event.preventDefault();
            const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor selecciona un archivo.");
        return;
    }

    try {
        // Subir archivo a la carpeta `articulos/`
        const { data, error } = await supabase.storage
            .from("articulos")
            .upload(`public/${file.name}`, file);

        if (error) throw error;

        // Guardar metadatos del archivo en la base de datos
        const { error: insertError } = await supabase
            .from("documentos")
            .insert([{ name: file.name, url: data.path }]);

        if (insertError) throw insertError;

        alert("Archivo subido correctamente.");
    } catch (err) {
        console.error("Error al subir archivo:", err);
        alert("Hubo un error al subir el archivo.");
    }
        });
    }

});










