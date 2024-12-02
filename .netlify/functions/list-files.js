const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const directoryPath = path.join(__dirname, "../../articulos");

    try {
        const files = fs.readdirSync(directoryPath);
        const docxFiles = files.filter((file) => file.endsWith(".docx"));

        return {
            statusCode: 200,
            body: JSON.stringify(docxFiles),
        };
    } catch (error) {
        console.error("Error reading directory:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error reading directory" }),
        };
    }
};

