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

    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.headers = event.headers;

    const uploadDir = path.join("/tmp", "articulos");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    // Configurar el tamaño máximo de archivo
    form.maxFileSize = 10 * 1024 * 1024; // 10 MB

    return new Promise((resolve) => {
        form.on("error", (err) => {
            console.error("Error al procesar el archivo:", err);
            resolve({
                statusCode: 400,
                body: "Error al procesar el archivo.",
            });
        });

        form.parse(readableStream, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                resolve({
                    statusCode: 400,
                    body: "Error al procesar el archivo.",
                });
                return;
            }
        
            // Validar si hay archivo en la solicitud
            if (!files.file) {
                console.error("No se encontró ningún archivo en la solicitud.");
                resolve({
                    statusCode: 400,
                    body: "No se encontró ningún archivo en la solicitud.",
                });
                return;
            }
        
            const file = files.file;
        
            // Validar la existencia y estructura básica del archivo
            if (!file || typeof file !== "object") {
                console.error("No se recibió un archivo válido.");
                resolve({
                    statusCode: 400,
                    body: "Error: No se recibió un archivo válido.",
                });
                return;
            }
        
            const originalFilename = file.originalFilename || "(Nombre no disponible)";
            const mimetype = file.mimetype || "(MIME no disponible)";
        
            if (originalFilename === "(Nombre no disponible)" || mimetype === "(MIME no disponible)") {
                console.error("Archivo inválido: Faltan datos esenciales.", {
                    originalFilename,
                    mimetype,
                });
                resolve({
                    statusCode: 400,
                    body: `Archivo inválido: El archivo debe incluir un nombre y un tipo MIME. Nombre recibido: ${originalFilename}, MIME recibido: ${mimetype}`,
                });
                return;
            }
        
            // Continuar con la validación y procesamiento del archivo...
            const validExtensions = [".docx"];
            const validMimeTypes = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
        
            // Validar la extensión del archivo
            const fileExtension = path.extname(originalFilename).toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                console.error("Extensión inválida:", fileExtension);
                resolve({
                    statusCode: 400,
                    body: "Extensión inválida. Solo se permiten archivos .docx.",
                });
                return;
            }
        
            // Validar el tipo MIME del archivo
            if (!validMimeTypes.includes(mimetype)) {
                console.error("Tipo MIME inválido:", mimetype);
                resolve({
                    statusCode: 400,
                    body: "Tipo MIME inválido. Solo se permiten archivos con tipo MIME adecuado.",
                });
                return;
            }
        
            // Renombrar y mover el archivo
            const newPath = path.join(uploadDir, file.newFilename);
        
            fs.rename(file.filepath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error("Error al mover el archivo:", renameErr.message);
                    resolve({
                        statusCode: 500,
                        body: `Error al mover el archivo: ${renameErr.message}`,
                    });
                    return;
                }
        
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Archivo subido exitosamente.",
                        path: newPath,
                    }),
                });
            });
        });
        
    });
};
