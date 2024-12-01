const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Método no permitido",
        };
    }

    // Convertir el cuerpo del evento en un flujo legible
    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Finaliza el flujo
    readableStream.headers = event.headers; // Añadir cabeceras

    const uploadDir = path.join("/tmp", "uploads", "articulos"); // Usar directorio temporal

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // 10 MB

    return new Promise((resolve) => {
        form.parse(readableStream, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                resolve({
                    statusCode: 400,
                    body: "Error al procesar el archivo",
                });
                return;
            }

            // Verificar si el archivo está presente
            if (!files.file || !files.file.filepath) {
                resolve({
                    statusCode: 400,
                    body: "No se encontró un archivo en la solicitud.",
                });
                return;
            }

            resolve({
                statusCode: 200,
                body: JSON.stringify({
                    message: "Archivo procesado exitosamente",
                    fields,
                    files,
                }),
            });
        });
    });
};
