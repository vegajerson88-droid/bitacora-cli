// Lee los argumentos y decide qué comando ejecutar.
const notas = require('./notas');
const { getLongTime, getShortDate } = require('./fechas');

const CANTIDAD_POR_DEFECTO = 5;

function mostrarAyuda() {
  console.log(`Bitácora CLI - uso:

  npm start -- agregar "<texto>" [etiqueta]   Guarda una nota (etiqueta por defecto: general)
  npm start -- listar [N]                     Muestra las últimas N notas (por defecto ${CANTIDAD_POR_DEFECTO})
  npm start -- buscar <palabra>               Busca notas que contengan la palabra
  npm start -- borrar <id>                    Borra la nota con ese id
  npm start -- ayuda                          Muestra esta ayuda

Ejemplo:
  npm start -- agregar "Hoy aprendí a usar fs" nodejs`);
}

function formatearNota(nota) {
  return `[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`;
}

function comandoAgregar(texto, etiqueta) {
  if (!texto || texto.trim() === '') {
    console.log('Falta el texto de la nota. Ejemplo: agregar "Hoy aprendí fs" nodejs');
    return;
  }
  const resultado = notas.agregarNota(texto.trim(), etiqueta || 'general');
  const nota = resultado.nota;
  if (resultado.guardada) {
    console.log(`Nota guardada [${nota.id}] (${nota.etiqueta}) — ${getLongTime('es-ES', nota.fecha)}`);
  } else {
    console.log(`Ya existe una nota igual (id ${nota.id}). No se guardó.`);
  }
}

function comandoListar(valor) {
  let cantidad = CANTIDAD_POR_DEFECTO;
  if (valor !== undefined) {
    const numero = parseInt(valor);
    if (isNaN(numero) || numero <= 0) {
      console.log(`"${valor}" no es una cantidad válida. Se usará ${CANTIDAD_POR_DEFECTO}.`);
    } else {
      cantidad = numero;
    }
  }
  const lista = notas.listarNotas(cantidad);
  if (lista.length === 0) {
    console.log('Todavía no hay notas guardadas.');
    return;
  }
  lista.forEach((nota) => console.log(formatearNota(nota)));
}

function comandoBuscar(palabra) {
  if (!palabra) {
    console.log('Falta la palabra a buscar. Ejemplo: buscar fs');
    return;
  }
  const encontradas = notas.buscarNotas(palabra);
  if (encontradas.length === 0) {
    console.log(`No hay notas que contengan "${palabra}".`);
    return;
  }
  encontradas.forEach((nota) => console.log(formatearNota(nota)));
}

function comandoBorrar(id) {
  if (!id) {
    console.log('Falta el id de la nota. Ejemplo: borrar 3f9a1c2e');
    return;
  }
  const borrada = notas.borrarNota(id);
  if (borrada) {
    console.log(`Nota [${borrada.id}] borrada.`);
  } else {
    console.log(`No existe ninguna nota con el id ${id}.`);
  }
}

const [comando, ...argumentos] = process.argv.slice(2);

switch (comando) {
  case 'agregar':
    comandoAgregar(argumentos[0], argumentos[1]);
    break;
  case 'listar':
    comandoListar(argumentos[0]);
    break;
  case 'buscar':
    comandoBuscar(argumentos[0]);
    break;
  case 'borrar':
    comandoBorrar(argumentos[0]);
    break;
  case 'ayuda':
    mostrarAyuda();
    break;
  default:
    if (comando) {
      console.log(`El comando "${comando}" no existe.\n`);
    }
    mostrarAyuda();
}
