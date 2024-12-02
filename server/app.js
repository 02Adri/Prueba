const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, "../uploads");

app.use(express.static(path.join(__dirname, "../public")));
app.use(fileUpload());

// Obtener documentos
app.get("/api/documents", (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return res.status(500).send("Error al leer archivos");
    res.json(files.map((file) => ({ name: file })));
  });
});

// Subir documento
app.post("/api/upload", (req, res) => {
  const file = req.files?.file;
  if (!file || path.extname(file.name) !== ".docx") {
    return res.status(400).send("Solo se permiten archivos .docx");
  }

  const filePath = path.join(UPLOADS_DIR, file.name);
  file.mv(filePath, (err) => {
    if (err) return res.status(500).send("Error al guardar archivo");
    res.send("Archivo subido exitosamente");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
