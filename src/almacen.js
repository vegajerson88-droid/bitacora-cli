// Aquí vive todo lo que toca archivos (fs).
const fs = require('fs');
const path = require('path');

const carpetaData = path.join(__dirname, '..', 'data');
const archivoNotas = path.join(carpetaData, 'notas.json');
const archivoLog = path.join(carpetaData, 'bitacora.log');
const carpetaRespaldos = path.join(__dirname, '..', 'respaldos');
const carpetaSalida = path.join(__dirname, '..', 'salida');

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

// Copia notas.json a respaldos/notas_<marca-de-tiempo>.json
function copiarRespaldo(marcaDeTiempo) {
  asegurarArchivo();
  if (!fs.existsSync(carpetaRespaldos)) {
    fs.mkdirSync(carpetaRespaldos, { recursive: true });
  }
  const destino = path.join(carpetaRespaldos, `notas_${marcaDeTiempo}.json`);
  fs.copyFileSync(archivoNotas, destino);
  return destino;
}

// Escribe exportacion.txt dentro de salida/ y devuelve su ruta
function escribirExportacion(texto) {
  if (!fs.existsSync(carpetaSalida)) {
    fs.mkdirSync(carpetaSalida, { recursive: true });
  }
  const archivo = path.join(carpetaSalida, 'exportacion.txt');
  fs.writeFileSync(archivo, texto);
  return archivo;
}

function esCarpeta(ruta) {
  return fs.existsSync(ruta) && fs.statSync(ruta).isDirectory();
}

// Mueve un archivo. Si origen y destino están en discos distintos
// renameSync falla con EXDEV, así que copiamos y borramos el original.
function moverArchivo(origen, destino) {
  try {
    fs.renameSync(origen, destino);
  } catch (error) {
    if (error.code === 'EXDEV') {
      fs.copyFileSync(origen, destino);
      fs.unlinkSync(origen);
    } else {
      throw error;
    }
  }
}

function existeArchivo(ruta) {
  return fs.existsSync(ruta);
}

module.exports = {
  leerNotas,
  guardarNotas,
  registrarLog,
  copiarRespaldo,
  escribirExportacion,
  esCarpeta,
  moverArchivo,
  existeArchivo,
};
