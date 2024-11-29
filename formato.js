import { supabase } from "./supabase.js";

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
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fileInput = document.getElementById("file-input");
            const file = fileInput.files[0];

            if (!file) {
                alert("Por favor selecciona un archivo.");
                return;
            }

            try {
                // Subir archivo a Supabase
                const { data, error } = await supabase.storage
                    .from('articulos')
                    .upload(`public/${file.name}`, file);

                if (error) {
                    console.error("Error al subir archivo:", error);
                    alert("Error al subir archivo. Por favor intenta de nuevo.");
                    return;
                }

                alert("Archivo subido correctamente.");
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Error inesperado al subir archivo.");
            }
        });
    }

});










