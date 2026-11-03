// Aquí vive todo lo que toca archivos (fs).
const fs = require('fs');
const path = require('path');

const carpetaData = path.join(__dirname, '..', 'data');
const archivoNotas = path.join(carpetaData, 'notas.json');
const archivoLog = path.join(carpetaData, 'bitacora.log');

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
  let notas;
  try {
    notas = JSON.parse(contenido);
  } catch (error) {
    throw new Error(`El archivo ${archivoNotas} está dañado y no se puede leer. Revisa su contenido o bórralo para empezar de nuevo.`);
  }
  if (!Array.isArray(notas)) {
    throw new Error(`El archivo ${archivoNotas} no tiene el formato esperado (debe ser una lista de notas).`);
  }
  return notas;
}

function guardarNotas(notas) {
  asegurarArchivo();
  fs.writeFileSync(archivoNotas, JSON.stringify(notas, null, 2));
}

// Agrega una línea al log: fecha | comando | resultado
function registrarLog(fecha, comando, resultado) {
  asegurarArchivo();
  fs.appendFileSync(archivoLog, `${fecha} | ${comando} | ${resultado}\n`);
}

module.exports = { leerNotas, guardarNotas, registrarLog };
