// Aquí vive todo lo que toca archivos (fs).
const fs = require('fs');
const path = require('path');

const carpetaData = path.join(__dirname, '..', 'data');
const archivoNotas = path.join(carpetaData, 'notas.json');

// Crea la carpeta y el archivo si no existen
function asegurarArchivo() {
  if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData, { recursive: true });
  }
  if (!fs.existsSync(archivoNotas)) {
    fs.writeFileSync(archivoNotas, '[]');
  }
}

function leerNotas() {
  asegurarArchivo();
  const contenido = fs.readFileSync(archivoNotas, 'utf8');
  return JSON.parse(contenido);
}

function guardarNotas(notas) {
  asegurarArchivo();
  fs.writeFileSync(archivoNotas, JSON.stringify(notas, null, 2));
}

module.exports = { leerNotas, guardarNotas };
