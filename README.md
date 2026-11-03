# bitacora-cli

Aplicación de consola hecha con Node.js para guardar lo que voy aprendiendo cada día, sin salir de la terminal.

## Qué hace

- Guarda notas con un id único (primeros 8 caracteres del hash del texto con `object-hash`).
- Rechaza notas repetidas e informa el id de la nota que ya existe.
- Lista, busca y borra notas.
- Anota cada comando que se ejecuta en `data/bitacora.log`.
- Hace respaldos de las notas y las exporta a un archivo de texto en otra carpeta.
- Usa mi propio paquete de fechas: `fechas-bitacora-jerson`.

## Tecnologías

- Node.js (CommonJS: `require` y `module.exports`)
- Módulos nativos: `fs`, `path`, `os`
- Paquete externo: `object-hash`
- Paquete propio: `fechas-bitacora-jerson` (carpeta aparte)

## Requisitos

- Node.js 20.12 o superior (`node -v`)
- npm (`npm -v`)
- Git

## Instalación

```bash
git clone <url-del-repositorio>   # o abrir la carpeta si ya la tienes
cd bitacora-cli
npm install
```

El paquete de fechas todavía no está publicado en npm, así que se conecta con `npm link`
(el paquete está en la carpeta `fechas-bitacora-jerson`, al lado de este proyecto):

```bash
cd ../fechas-bitacora-jerson
npm link
cd ../bitacora-cli
npm link fechas-bitacora-jerson
```

> `npm link` no escribe nada en `package.json`, por eso `npm ls` muestra el paquete como `extraneous`.
> Si algún día lo publico, bastaría con `npm install fechas-bitacora-jerson`.

## Cómo ejecutarlo

```bash
npm start -- <comando> [argumentos]
```

Los `--` son necesarios para que npm le pase los argumentos al programa.

## Comandos

| Comando | Qué hace | Ejemplo |
|---|---|---|
| `agregar "<texto>" [etiqueta]` | Guarda una nota. La etiqueta por defecto es `general`. | `npm start -- agregar "Hoy aprendí a usar fs" nodejs` |
| `listar [N]` | Muestra las últimas N notas (por defecto 5). | `npm start -- listar 3` |
| `buscar <palabra>` | Busca notas que contengan la palabra (sin importar mayúsculas). | `npm start -- buscar fs` |
| `borrar <id>` | Borra la nota con ese id. | `npm start -- borrar 3f9a1c2e` |
| `respaldar` | Copia `data/notas.json` a `respaldos/notas_<marca-de-tiempo>.json`. | `npm start -- respaldar` |
| `exportar [carpeta]` | Crea `exportacion.txt` y lo mueve a la carpeta (ruta absoluta). Si no se da carpeta usa la carpeta personal. | `npm start -- exportar /tmp` |
| `ayuda` | Muestra cómo se usa cada comando. También sale si no se escribe comando o si no existe. | `npm start -- ayuda` |

## Estructura de carpetas

```
bitacora-cli/
├── src/
│   ├── index.js      # lee los argumentos y decide qué comando ejecutar
│   ├── notas.js      # lógica: agregar, listar, buscar, borrar, respaldar, exportar
│   └── almacen.js    # todo lo que usa fs (leer, escribir, copiar, mover, log)
├── data/             # notas.json y bitacora.log (se crea sola, no se sube a Git)
├── respaldos/        # copias de notas.json (se crea sola, no se sube a Git)
├── salida/           # archivo temporal de la exportación (se crea sola, no se sube a Git)
├── evidencias/       # pruebas del taller
├── .gitignore
├── package.json
├── GUIA_ENTREGA.md
└── README.md
```

## Cómo funciona

1. `index.js` toma lo que escribo en la terminal con `process.argv` y llama al comando correcto.
   No usa `fs` ni calcula hashes.
2. `notas.js` tiene la lógica: crea el id con `object-hash`, revisa duplicados, filtra, arma el texto de la exportación.
3. `almacen.js` es el único que usa `fs`: lee y guarda `data/notas.json`, escribe el log con `appendFileSync`,
   copia el respaldo y mueve el archivo exportado.
4. Cada nota es un objeto con `id`, `texto`, `etiqueta` y `fecha` (número).
5. Si `notas.json` está dañado o la entrada es incorrecta, el programa muestra un mensaje en español y no se cae.
6. Al mover `exportacion.txt` se usa `renameSync`. Si falla con `EXDEV` (discos distintos), se copia el archivo y luego se borra el original con `unlinkSync`.

## Preguntas de reflexión

**1. ¿Por qué elegiste CommonJS o ES Modules? ¿Qué cambió en package.json y en la forma de importar?**

Elegí CommonJS porque es el sistema que quiero practicar y porque mi paquete de fechas también lo usa.
En `package.json` quedó `"type": "commonjs"`. Se importa con `require()` y se exporta con `module.exports`;
en ES Modules sería `"type": "module"` con `import` y `export`.

**2. `fs`, `object-hash` y fechas (tu paquete) se importan distinto del módulo local `notas.js`. ¿Cuál es la diferencia y cómo decide Node dónde buscar cada uno?**

`require('./notas')` empieza con `./`, entonces Node lo busca como archivo en una ruta relativa.
`require('fs')` es un módulo nativo y viene dentro de Node. `object-hash` y `fechas-bitacora-jerson`
se escriben solo con el nombre, así que Node los busca dentro de la carpeta `node_modules`.

**3. ¿Por qué `data/notas.json` se resuelve distinto si ejecutas el programa desde otra carpeta?**

Una ruta relativa como `data/notas.json` se cuenta desde la carpeta donde estoy parado en la terminal, no desde donde está el archivo.
Por eso uso `path.join(__dirname, '..', 'data')`: `__dirname` es la carpeta del archivo `almacen.js`,
y así siempre llega a la misma carpeta `data/` sin importar desde dónde ejecute.

**4. ¿Por qué `node_modules/` no se sube a Git y cómo recupera otra persona las dependencias?**

`node_modules/` pesa mucho y se puede volver a generar, así que está en el `.gitignore`.
La otra persona clona el repositorio y ejecuta `npm install`: npm lee `package.json` y `package-lock.json`
y descarga las mismas dependencias.

**5. ¿Qué diferencia viste al importar tu paquete CommonJS desde tu proyecto?**

Se importa igual que `object-hash`: `require('fechas-bitacora-jerson')`, solo con el nombre y sin `./`.
Lo único que cambió respecto a `fechas.js` fue esa línea, y en `node_modules` quedó un enlace simbólico por el `npm link`.
Si mi bitácora fuera ES Modules se importaría con `import` (Node deja importar CommonJS desde ES Modules); como las dos son CommonJS, no cambia nada más.
