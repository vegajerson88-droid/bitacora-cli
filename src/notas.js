// Lógica de las notas: agregar, listar, buscar y borrar.
const objectHash = require('object-hash');
const almacen = require('./almacen');
const { getTimeStamp } = require('./fechas');

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

module.exports = { agregarNota, listarNotas, buscarNotas, borrarNota };
