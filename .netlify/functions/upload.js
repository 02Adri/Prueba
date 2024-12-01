const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    // Convertir el evento a un flujo legible para formidable
    const buffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    const fakeReq = new (require("stream").Readable)();
    fakeReq.push(buffer);
    fakeReq.push(null);
    fakeReq.headers = event.headers;

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../../articulos"); // Carpeta de destino
    form.keepExtensions = true;

    return new Promise((resolve) => {
        form.parse(fakeReq, (err, fields, files) => {
            if (err) {
                console.error("Error al procesar archivo:", err);
                resolve({
                    statusCode: 400,
                    body: "Error al procesar archivo",
                });
                return;
            }

            const file = files.file;
            if (!file || !file.originalFilename.endsWith(".docx")) {
                resolve({
                    statusCode: 400,
                    body: "Solo se permiten archivos .docx",
                });
                return;
            }

            const newPath = path.join(form.uploadDir, file.originalFilename);

            fs.rename(file.filepath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error("Error al guardar archivo:", renameErr);
                    resolve({
                        statusCode: 500,
                        body: "Error al guardar archivo",
                    });
                    return;
                }

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: "Archivo subido exitosamente al servidor" }),
                });
            });
        });
    });
};