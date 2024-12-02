const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid file data" }),
        };
    }

    const directoryPath = path.join("/tmp/uploads/articulos");

    try {
        // Asegúrate de que la carpeta existe
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Ruta completa del archivo
        const filePath = path.join(directoryPath, fileName);

        // Escribe el contenido del archivo
        fs.writeFileSync(filePath, fileContent, "base64");

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "File uploaded successfully", filePath }),
        };
    } catch (error) {
        console.error("Error writing file:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error writing file", details: error.message }),
        };
    }
};
