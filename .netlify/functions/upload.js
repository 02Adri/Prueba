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

    const uploadDir = path.join(__dirname, "uploads", "articulos"); // Cambiar ruta si es necesario

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // 10 MB

    return new Promise((resolve) => {
        form.on("error", (err) => {
            console.error("Error al procesar el archivo:", err);
            resolve({
                statusCode: 400,
                body: "Error al procesar el archivo",
            });
        });

        form.parse(readableStream, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                resolve({
                    statusCode: 400,
                    body: "Error al procesar el archivo",
                });
                return;
            }

            if (!files.file || !files.file.filepath) {
                console.error("Archivo no encontrado en la solicitud.");
                resolve({
                    statusCode: 400,
                    body: "No se encontró un archivo en la solicitud.",
                });
                return;
            }

            const file = files.file;

            const originalFilename = file.originalFilename || "(Nombre no disponible)";
            const mimetype = file.mimetype || "(MIME no disponible)";

            if (originalFilename === "(Nombre no disponible)" || mimetype === "(MIME no disponible)") {
                console.error("Archivo inválido: Faltan datos esenciales.", {
                    originalFilename,
                    mimetype,
                });
                resolve({
                    statusCode: 400,
                    body: "Archivo inválido: El archivo debe incluir un nombre y un tipo MIME.",
                });
                return;
            }

            const validExtensions = [".docx"];
            const validMimeTypes = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];

            const fileExtension = path.extname(originalFilename).toLowerCase();
            const hasValidExtension = validExtensions.includes(fileExtension);
            const hasValidMimeType = validMimeTypes.includes(mimetype);

            if (!hasValidExtension || !hasValidMimeType) {
                console.error("Archivo inválido:", {
                    extension: fileExtension,
                    mimetype,
                });
                resolve({
                    statusCode: 400,
                    body: "Solo se permiten archivos .docx con el tipo MIME adecuado.",
                });
                return;
            }

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
                        message: "Archivo subido exitosamente",
                        path: newPath,
                    }),
                });
            });
        });
    });
};
