const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

exports.handler = async (event) => {
    // Permitir solo solicitudes POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Método no permitido",
        };
    }

    // Convertir el cuerpo de la solicitud a un flujo legible
    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.headers = event.headers;

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../articulos"); // Carpeta de destino
    form.keepExtensions = true; // Mantener extensiones originales

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

            // Validar si existe archivo en la solicitud
            if (!files.file) {
                console.error("No se encontró ningún archivo en la solicitud.");
                resolve({
                    statusCode: 400,
                    body: "No se encontró ningún archivo en la solicitud.",
                });
                return;
            }

            const file = files.file; // Archivo recibido
            if (!file.originalFilename || !file.originalFilename.endsWith(".docx")) {
                console.error("Archivo inválido:", file);
                resolve({
                    statusCode: 400,
                    body: "Solo se permiten archivos con extensión .docx",
                });
                return;
            }

            const newPath = path.join(form.uploadDir, file.originalFilename);

            // Mover el archivo a la carpeta final
            fs.rename(file.filepath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error("Error al guardar el archivo:", renameErr);
                    resolve({
                        statusCode: 500,
                        body: "Error al guardar el archivo",
                    });
                    return;
                }

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: "Archivo subido exitosamente" }),
                });
            });
        });
    });
};
