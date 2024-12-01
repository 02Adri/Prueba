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

            // Verificar que los datos del archivo estén presentes
            if (!file.originalFilename || !file.mimetype) {
                console.error("Archivo inválido: datos faltantes", {
                    originalFilename: file.originalFilename || "No disponible",
                    mimetype: file.mimetype || "No disponible",
                });
                resolve({
                    statusCode: 400,
                    body: "Archivo inválido: datos faltantes (nombre o tipo MIME)",
                });
                return;
            }

            const validExtensions = [".docx"];
            const validMimeTypes = [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            const originalFilename = file.originalFilename || "";

            // Validar extensión usando path.extname
            const fileExtension = path.extname(originalFilename).toLowerCase();
            const hasValidExtension = validExtensions.includes(fileExtension);

            // Validar MIME type
            const hasValidMimeType = validMimeTypes.includes(file.mimetype);

            if (!hasValidExtension || !hasValidMimeType) {
                console.error("Archivo inválido:", {
                    extension: fileExtension,
                    mimetype: file.mimetype,
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
