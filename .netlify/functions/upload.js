/*const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" }),
        };
    }

    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.headers = event.headers;

    const uploadDir = path.join("/tmp", "uploads", "articulos");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024;

    return new Promise((resolve) => {
        form.parse(readableStream, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                resolve({
                    statusCode: 400,
                    body: JSON.stringify({ error: "Error al procesar el archivo" }),
                });
                return;
            }

            if (!files.file || !files.file.filepath) {
                resolve({
                    statusCode: 400,
                    body: JSON.stringify({
                        error: "No se encontró un archivo en la solicitud.",
                    }),
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
*/

const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" }),
        };
    }

    // Verificar que la cabecera sea multipart/form-data
    const contentType = event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Formato de contenido no soportado" }),
        };
    }

    const form = new formidable.IncomingForm({
        multiples: false,
        uploadDir: path.join("/tmp", "uploads", "articulos"),
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
    });

    // Asegurarse de que el directorio de carga existe
    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    try {
        // Convertir el cuerpo en un Stream compatible con formidable
        const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
        const stream = require("stream");
        const readable = new stream.Readable();
        readable._read = () => {}; // No-op
        readable.push(buffer);
        readable.push(null);

        // Procesar la solicitud con formidable
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(readable, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        // Verificar si se recibió el archivo
        if (!files.file) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No se encontró un archivo en la solicitud." }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Archivo subido exitosamente",
                fields,
                files,
            }),
        };
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno al procesar el archivo." }),
        };
    }
};
