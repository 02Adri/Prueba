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

    try {
        // Decodificar el cuerpo del evento
        const boundary = event.headers["content-type"].split("boundary=")[1];
        if (!boundary) throw new Error("No se encontró el límite de multipart.");

        const form = new formidable.IncomingForm({
            multiples: false,
            uploadDir: path.join("/tmp", "uploads", "articulos"),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024,
        });

        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir, { recursive: true });
        }

        const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");

        return new Promise((resolve) => {
            form.parse({ headers: event.headers, buffer }, (err, fields, files) => {
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
                        message: "Archivo subido exitosamente",
                        fields,
                        files,
                    }),
                });
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error inesperado" }),
        };
    }
};
