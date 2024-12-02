const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    // Ruta actualizada para apuntar a 'tmp/uploads/articulos'
    const directoryPath = path.join("/tmp/uploads/articulos");

    try {
        // Verifica si el directorio existe antes de leerlo
        if (!fs.existsSync(directoryPath)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Directory not found" }),
            };
        }

        // Lee el contenido del directorio
        const files = fs.readdirSync(directoryPath);
        // Filtra solo los archivos con extensión '.docx'
        const docxFiles = files.filter((file) => file.endsWith(".docx"));

        return {
            statusCode: 200,
            body: JSON.stringify(docxFiles),
        };
    } catch (error) {
        console.error("Error reading directory:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error reading directory", details: error.message }),
        };
    }
};
