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

    if (!file || !file.name.endsWith(".docx")) {
        alert("Por favor, selecciona un archivo .docx.");
        return;
    }

    try {
        const { data, error } = await supabase.storage
            .from("articulos")
            .upload(`public/${file.name}`, file, { upsert: true });

        if (error) throw error;

        alert("Archivo subido correctamente.");
        fileInput.value = "";
    } catch (err) {
        console.error("Error al subir el archivo:", err.message);
        alert(`Error al subir archivo: ${err.message}`);
    }
        });
    }

});










