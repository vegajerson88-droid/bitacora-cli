# Guía de entrega — bitacora-cli

Esta guía te lleva paso a paso, sin suponer nada. Todos los comandos se copian y pegan en la **terminal de Ubuntu**.

---

## 1. Dónde quedó guardado el proyecto

Vas a recibir un archivo llamado **`taller-node.zip`**. Adentro hay dos carpetas:

```
taller-node/
├── bitacora-cli/              <- proyecto principal (ya tiene Git y 6 commits)
└── fechas-bitacora-jerson/    <- paquete npm de fechas (carpeta aparte, con su propio Git)
```

Cuando descargues el zip, normalmente queda en la carpeta **Descargas**. Descomprímelo en tu carpeta personal:

```bash
cd ~/Descargas
unzip taller-node.zip -d ~/
```

> Si dice `unzip: command not found`, instálalo con `sudo apt install unzip` y repite el comando.

Después de esto las rutas son:

- Proyecto principal: `/home/TU_USUARIO/taller-node/bitacora-cli`
- Paquete de fechas: `/home/TU_USUARIO/taller-node/fechas-bitacora-jerson`

(`~` en la terminal significa `/home/TU_USUARIO`. Para ver tu ruta exacta: `echo ~`)

## 2. Cómo abrirlo en Visual Studio Code

```bash
code ~/taller-node
```

Si `code` no funciona: abre Visual Studio Code → **File → Open Folder…** → elige la carpeta `taller-node` dentro de tu carpeta personal.

## 3. Cómo abrir una terminal en la carpeta correcta

**Opción A (dentro de VS Code):** menú **Terminal → New Terminal** (o `Ctrl + ñ` / ``Ctrl + ` ``). Luego escribe:

```bash
cd ~/taller-node/bitacora-cli
pwd
```

**Opción B (terminal de Ubuntu):** abre la terminal (`Ctrl + Alt + T`) y escribe lo mismo.

El comando `pwd` te dice dónde estás. Debe mostrar algo que termine en `/taller-node/bitacora-cli`.

## 4. Comprobar versiones de Node.js y npm

```bash
node -v
npm -v
```

Deben salir algo como `v24.16.0` y `11.13.0` (el taller pide Node 20.12 o superior).

## 5. Instalar las dependencias

Estando en `~/taller-node/bitacora-cli`:

```bash
npm install
```

Esto instala `object-hash`. Luego hay que **conectar el paquete de fechas con `npm link`** (el paquete aún no está publicado en npm):

```bash
cd ~/taller-node/fechas-bitacora-jerson
npm link
cd ~/taller-node/bitacora-cli
npm link fechas-bitacora-jerson
```

> Importante: haz primero `npm install` y después los `npm link`. Si algún día vuelves a ejecutar `npm install`, repite los dos `npm link`.

## 6. Ejecutar el programa

```bash
cd ~/taller-node/bitacora-cli
npm start -- ayuda
```

Los `--` son necesarios: le dicen a npm que lo que sigue es para el programa.

## 7. Probar cada uno de los siete comandos

Ejecútalos en este orden (mira lo que sale en cada uno):

```bash
npm start -- agregar "Hoy aprendí a usar fs" nodejs
npm start -- agregar "Mi segunda nota"
npm start -- listar 3
npm start -- buscar fs
npm start -- borrar ID_DE_UNA_NOTA
npm start -- respaldar
npm start -- exportar /tmp
npm start -- ayuda
```

Cambia `ID_DE_UNA_NOTA` por un id real que te salió al agregar (8 caracteres, por ejemplo `3f9a1c2e`). Los ids que salgan en tu computador son los mismos que en las evidencias, porque dependen del texto.

## 8. Comprobar que las notas se guardan

```bash
cat data/notas.json
cat data/bitacora.log
```

`notas.json` tiene tus notas y `bitacora.log` tiene una línea por cada comando que ejecutaste (fecha | comando | resultado).

## 9. Comprobar que se detectan duplicados

Ejecuta **dos veces** exactamente el mismo comando:

```bash
npm start -- agregar "Texto repetido" prueba
npm start -- agregar "Texto repetido" prueba
```

La segunda vez debe decir: `Ya existe una nota igual (id ...). No se guardó.`

## 10. Generar un respaldo

```bash
npm start -- respaldar
ls respaldos
```

Debe aparecer un archivo `notas_<números>.json`.

## 11. Exportar las notas

```bash
npm start -- exportar /tmp
cat /tmp/exportacion.txt
ls salida
```

- `cat` muestra el archivo exportado en la carpeta destino.
- `ls salida` debe salir **vacío**: el archivo se movió, no se copió.

Para exportar al escritorio (si tu carpeta se llama `Escritorio`; si está en inglés usa `Desktop`):

```bash
npm start -- exportar ~/Escritorio
```

Si no escribes carpeta, se usa tu carpeta personal: `npm start -- exportar`.

## 12. Pruebas especiales

**a) Validaciones:**

```bash
npm start -- listar 0
npm start -- listar abc
npm start -- agregar ""
npm start -- borrar noexiste
npm start --
npm start -- comandoraro
npm start -- exportar carpeta/relativa
npm start -- exportar /ruta/que/no/existe
```

**b) Ejecutar desde otra carpeta (las rutas deben seguir funcionando):**

```bash
cd src
node index.js listar 2
cd ..
```

**c) `notas.json` dañado** (guarda una copia primero y restáurala al final):

```bash
cp data/notas.json /tmp/notas_copia.json
echo "texto basura {{{" > data/notas.json
npm start -- listar
cp /tmp/notas_copia.json data/notas.json
npm start -- listar
```

La primera vez debe salir un mensaje en español diciendo que el archivo está dañado (sin errores raros). La segunda vez ya funciona porque lo restauraste.

## 13. Comprobar `npm link`

```bash
cd ~/taller-node/bitacora-cli
ls -l node_modules | grep fechas
npm ls
```

- En el `ls -l` debe verse una flecha `->` hacia `fechas-bitacora-jerson` (enlace simbólico).
- `npm ls` mostrará `fechas-bitacora-jerson ... extraneous`. Es normal: `npm link` no lo escribe en `package.json`.

## 14. Ejecutar `npm publish --dry-run`

```bash
cd ~/taller-node/fechas-bitacora-jerson
npm publish --dry-run
```

Es solo una simulación: **no publica nada**. Debe listar 3 archivos (`README.md`, `index.js`, `package.json`) y no debe aparecer `node_modules`. Puede salir un aviso de que no has iniciado sesión; es normal en el dry-run.

---

## Cómo volver a ejecutar todo después de cerrar la terminal o reiniciar el PC

```bash
cd ~/taller-node/bitacora-cli
npm start -- ayuda
```

No hay que instalar nada otra vez. Solo si borras `node_modules` o ejecutas `npm install` de nuevo, repite los `npm link` del paso 5.

Para ver los commits:

```bash
git log --oneline
```

---

## Evidencias (capturas de pantalla)

Las 5 capturas ya están en la carpeta `evidencias/`:

- [x] `01_siete_comandos.png`: sesión con los 7 comandos
- [x] `02_nota_duplicada.png`: rechazo de la nota duplicada
- [x] `03_notas_json_danado.png`: `notas.json` dañado y mensaje controlado
- [x] `04_npm_publish_dry_run.png`: salida de `npm publish --dry-run`
- [x] `05_npm_link.png`: `npm ls` y enlace simbólico de `npm link`

---

## Qué debes enviar al instructor

1. La carpeta **`bitacora-cli`** completa (con `.git`, `src/`, `evidencias/`, `README.md`, `package.json`, `package-lock.json`, `.gitignore`). No hace falta enviar `node_modules`.
2. La carpeta **`fechas-bitacora-jerson`** (sin `node_modules`).
3. Tus **5 capturas** dentro de `bitacora-cli/evidencias/`.

Para comprimirlo (sin `node_modules`):

```bash
cd ~/taller-node
zip -r entrega-taller.zip bitacora-cli fechas-bitacora-jerson -x "*/node_modules/*"
```

---

## Para poder explicarlo si te preguntan

- **`index.js`**: lee `process.argv`, usa un `switch` para elegir el comando y escribe en el log. No usa `fs`.
- **`notas.js`**: la lógica. El id sale de `objectHash(texto).slice(0, 8)`; si ya existe ese id, la nota es duplicada.
- **`almacen.js`**: todo lo de `fs`. Si `notas.json` no existe lo crea con `[]`; si no se puede leer con `JSON.parse` lanza un error con mensaje claro.
- **Rutas**: `path.join(__dirname, '..', 'data')` para que funcione desde cualquier carpeta.
- **Exportar**: crea `salida/exportacion.txt`, valida la ruta (`path.isAbsolute` y que exista) y lo mueve con `renameSync`. Si da `EXDEV`, copia y borra el original.
- **Paquete**: `fechas-bitacora-jerson` es CommonJS y se usa con `require('fechas-bitacora-jerson')` gracias a `npm link`.
- **No se hizo publicación real en npm** y no se usaron credenciales.
