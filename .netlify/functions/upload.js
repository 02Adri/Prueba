const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Método no permitido",
        };
    }

    const uploadDir = path.join("/tmp", "uploads", "articulos"); // Ruta temporal

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // 10 MB

    return new Promise((resolve) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                resolve({
                    statusCode: 400,
                    body: "Error al procesar el archivo",
                });
                return;
            }

            if (!files.file || !files.file.filepath) {
                resolve({
                    statusCode: 400,
                    body: "No se encontró un archivo en la solicitud.",
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: "Archivo procesado exitosamente",
            });
        });
    });
};
