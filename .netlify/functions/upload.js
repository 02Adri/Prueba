const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const boundary = event.headers['content-type'].split('boundary=')[1];
    const body = event.body;
    const fileContentMatch = body.match(new RegExp(`--${boundary}\\r\\n.*?\\r\\n\\r\\n([\\s\\S]*?)\\r\\n--`));
    const fileNameMatch = body.match(/filename="([^"]+)"/);

    if (!fileContentMatch || !fileNameMatch) {
        return {
            statusCode: 400,
            body: 'No file uploaded or invalid request',
        };
    }

    const fileName = fileNameMatch[1];
    const fileContent = Buffer.from(fileContentMatch[1], 'binary');

    if (!fileName.endsWith('.docx')) {
        return {
            statusCode: 400,
            body: 'Only .docx files are allowed',
        };
    }

    const filePath = path.join(__dirname, '../../articulos', fileName);
    try {
        fs.writeFileSync(filePath, fileContent);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully', fileName }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error saving file',
        };
    }
};
