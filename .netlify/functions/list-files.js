/*const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const directoryPath = path.join("/tmp/uploads/articulos");

    try {
        // Verificar si la carpeta existe
        if (!fs.existsSync(directoryPath)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Directory not found" }),
            };
        }

        // Leer el contenido de la carpeta
        const files = fs.readdirSync(directoryPath);

        // Filtrar solo archivos con extensión `.docx`
        const docxFiles = files.filter((file) => file.endsWith(".docx"));

        return {
            statusCode: 200,
            body: JSON.stringify(docxFiles),
        };
    } catch (error) {
        console.error("Error al leer el directorio:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Error reading directory",
                details: error.message,
            }),
        };
    }
};*/


const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const directoryPath = path.join("/tmp/uploads/articulos");

    try {
        if (!fs.existsSync(directoryPath)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Directory not found" }),
            };
        }

        const files = fs.readdirSync(directoryPath);
        const docxFiles = files.filter((file) => file.endsWith(".docx"));

        return {
            statusCode: 200,
            body: JSON.stringify(docxFiles),
        };
    } catch (error) {
        console.error("Error al leer el directorio:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Error reading directory",
                details: error.message,
            }),
        };
    }
};
