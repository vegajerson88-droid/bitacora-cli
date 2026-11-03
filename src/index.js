// Lee los argumentos y decide qué comando ejecutar.
const notas = require('./notas');
const almacen = require('./almacen');
const { getLongTime, getShortDate } = require('./fechas');

const CANTIDAD_POR_DEFECTO = 5;

function mostrarAyuda() {
  console.log(`Bitácora CLI - uso:

  npm start -- agregar "<texto>" [etiqueta]   Guarda una nota (etiqueta por defecto: general)
  npm start -- listar [N]                     Muestra las últimas N notas (por defecto ${CANTIDAD_POR_DEFECTO})
  npm start -- buscar <palabra>               Busca notas que contengan la palabra
  npm start -- borrar <id>                    Borra la nota con ese id
  npm start -- respaldar                      Copia las notas a la carpeta respaldos/
  npm start -- exportar [carpeta]             Exporta las notas a exportacion.txt en esa carpeta
                                              (ruta absoluta; por defecto tu carpeta personal)
  npm start -- ayuda                          Muestra esta ayuda

Ejemplo:
  npm start -- agregar "Hoy aprendí a usar fs" nodejs
  npm start -- exportar /tmp`);
  return 'ayuda mostrada';
}

function formatearNota(nota) {
  return `[${nota.id}] (${nota.etiqueta}) ${getShortDate('es-ES', nota.fecha)} — ${nota.texto}`;
}

function comandoAgregar(texto, etiqueta) {
  if (!texto || texto.trim() === '') {
    console.log('Falta el texto de la nota. Ejemplo: agregar "Hoy aprendí fs" nodejs');
    return 'error: falta el texto';
  }
  const resultado = notas.agregarNota(texto.trim(), etiqueta || 'general');
  const nota = resultado.nota;
  if (resultado.guardada) {
    console.log(`Nota guardada [${nota.id}] (${nota.etiqueta}) — ${getLongTime('es-ES', nota.fecha)}`);
    return `nota guardada ${nota.id}`;
  }
  console.log(`Ya existe una nota igual (id ${nota.id}). No se guardó.`);
  return `duplicada ${nota.id}`;
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
    return 'sin notas';
  }
  lista.forEach((nota) => console.log(formatearNota(nota)));
  return `${lista.length} notas mostradas`;
}

function comandoBuscar(palabra) {
  if (!palabra) {
    console.log('Falta la palabra a buscar. Ejemplo: buscar fs');
    return 'error: falta la palabra';
  }
  const encontradas = notas.buscarNotas(palabra);
  if (encontradas.length === 0) {
    console.log(`No hay notas que contengan "${palabra}".`);
    return `sin resultados para "${palabra}"`;
  }
  encontradas.forEach((nota) => console.log(formatearNota(nota)));
  return `${encontradas.length} coincidencias para "${palabra}"`;
}

function comandoBorrar(id) {
  if (!id) {
    console.log('Falta el id de la nota. Ejemplo: borrar 3f9a1c2e');
    return 'error: falta el id';
  }
  const borrada = notas.borrarNota(id);
  if (borrada) {
    console.log(`Nota [${borrada.id}] borrada.`);
    return `nota borrada ${borrada.id}`;
  }
  console.log(`No existe ninguna nota con el id ${id}.`);
  return `id inexistente ${id}`;
}

function comandoRespaldar() {
  const archivo = notas.respaldar();
  console.log(`Respaldo creado: ${archivo}`);
  return `respaldo creado ${archivo}`;
}

function comandoExportar(carpeta) {
  const resultado = notas.exportar(carpeta);
  console.log(`Se exportaron ${resultado.cantidad} notas a ${resultado.rutaFinal}`);
  return `exportadas ${resultado.cantidad} notas a ${resultado.rutaFinal}`;
}

// Elige qué comando ejecutar y devuelve el resultado para el log
function ejecutar(comando, argumentos) {
  switch (comando) {
    case 'agregar':
      return comandoAgregar(argumentos[0], argumentos[1]);
    case 'listar':
      return comandoListar(argumentos[0]);
    case 'buscar':
      return comandoBuscar(argumentos[0]);
    case 'borrar':
      return comandoBorrar(argumentos[0]);
    case 'respaldar':
      return comandoRespaldar();
    case 'exportar':
      return comandoExportar(argumentos[0]);
    case 'ayuda':
      return mostrarAyuda();
    default:
      if (comando) {
        console.log(`El comando "${comando}" no existe.\n`);
      }
      mostrarAyuda();
      return comando ? 'comando no existe' : 'sin comando, se mostró la ayuda';
  }
}

const [comando, ...argumentos] = process.argv.slice(2);
let resultado;

try {
  resultado = ejecutar(comando, argumentos);
} catch (error) {
  console.log(`Error: ${error.message}`);
  resultado = `error: ${error.message}`;
}

// El log nunca debe tumbar el programa
try {
  almacen.registrarLog(getLongTime(), comando || '(ninguno)', resultado);
} catch (error) {
  console.log(`No se pudo escribir la bitácora: ${error.message}`);
}
