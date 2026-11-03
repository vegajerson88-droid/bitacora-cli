// Lógica de las notas: agregar, listar, buscar y borrar.
const os = require('os');
const path = require('path');
const objectHash = require('object-hash');
const almacen = require('./almacen');
const { getTimeStamp, getLongTime, getShortDate } = require('./fechas');

// El id son los primeros 8 caracteres del hash del texto
function crearId(texto) {
  return objectHash(texto).slice(0, 8);
}

function agregarNota(texto, etiqueta) {
  const notas = almacen.leerNotas();
  const id = crearId(texto);

  const repetida = notas.find((nota) => nota.id === id);
  if (repetida) {
    return { guardada: false, nota: repetida };
  }

  const nota = { id, texto, etiqueta, fecha: getTimeStamp() };
  notas.push(nota);
  almacen.guardarNotas(notas);
  return { guardada: true, nota };
}

function listarNotas(cantidad) {
  const notas = almacen.leerNotas();
  return notas.slice(-cantidad);
}

function buscarNotas(palabra) {
  const notas = almacen.leerNotas();
  const buscada = palabra.toLowerCase();
  return notas.filter((nota) => nota.texto.toLowerCase().includes(buscada));
}

function borrarNota(id) {
  const notas = almacen.leerNotas();
  const posicion = notas.findIndex((nota) => nota.id === id);
  if (posicion === -1) {
    return null;
  }
  const [borrada] = notas.splice(posicion, 1);
  almacen.guardarNotas(notas);
  return borrada;
}

function respaldar() {
  return almacen.copiarRespaldo(getTimeStamp());
}

// Arma el texto legible que va dentro de exportacion.txt
function armarTextoExportacion(lista) {
  let texto = `BITÁCORA DE APRENDIZAJE\n`;
  texto += `Exportado: ${getLongTime()}\n`;
  texto += `Total de notas: ${lista.length}\n\n`;
  lista.forEach((nota, i) => {
    texto += `${i + 1}. [${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)}\n`;
    texto += `   ${nota.texto}\n\n`;
  });
  return texto;
}

// Genera salida/exportacion.txt y lo MUEVE a la carpeta destino.
// Si no se indica carpeta se usa la carpeta personal del usuario.
function exportar(carpetaDestino) {
  const destino = carpetaDestino || os.homedir();

  if (!path.isAbsolute(destino)) {
    throw new Error(`La ruta "${destino}" no es absoluta. Ejemplo: /home/tu-usuario/Escritorio`);
  }
  if (!almacen.esCarpeta(destino)) {
    throw new Error(`La carpeta "${destino}" no existe.`);
  }

  const lista = almacen.leerNotas();
  const origen = almacen.escribirExportacion(armarTextoExportacion(lista));
  const rutaFinal = path.join(destino, 'exportacion.txt');
  almacen.moverArchivo(origen, rutaFinal);

  return { cantidad: lista.length, origen, rutaFinal, sigueEnSalida: almacen.existeArchivo(origen) };
}

module.exports = {
  agregarNota,
  listarNotas,
  buscarNotas,
  borrarNota,
  respaldar,
  exportar,
};
