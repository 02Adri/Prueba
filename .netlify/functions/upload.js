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

            if (!files.file) {
                console.error("No se encontró ningún archivo en la solicitud.");
                resolve({
                    statusCode: 400,
                    body: "No se encontró ningún archivo en la solicitud.",
                });
                return;
            }

            const file = files.file;
            const validExtensions = [".docx"];
            const validMimeTypes = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            const originalFilename = file.originalFilename || "";

            // Validar por extensión
            const hasValidExtension = validExtensions.some((ext) =>
                originalFilename.trim().toLowerCase().endsWith(ext)
            );

            // Validar por MIME type
            const hasValidMimeType = validMimeTypes.includes(file.mimetype);

            if (!hasValidExtension || !hasValidMimeType) {
                console.error("Archivo inválido:", file);
                resolve({
                    statusCode: 400,
                    body: "Solo se permiten archivos .docx con el tipo MIME adecuado.",
                });
                return;
            }

            const newPath = path.join(uploadDir, file.originalFilename);

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
                    body: JSON.stringify({ message: "Archivo subido exitosamente", path: newPath }),
                });
            });
        });
    });
};
