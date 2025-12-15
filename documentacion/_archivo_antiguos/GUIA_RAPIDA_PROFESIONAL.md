# 🎯 GUÍA RÁPIDA - SISTEMA PROFESIONAL DE GRABACIÓN

## ✅ CAMBIOS IMPLEMENTADOS

Se ha actualizado el sistema para usar **recorder-professional.js** que incluye:

1. **Diálogo de Configuración de Proyecto** al inicio
2. **Diálogo por cada acción** con configuración completa
3. **Detección automática de tipo de elemento**
4. **Sugerencias inteligentes de acciones**
5. **Estructura de carpetas organizada**
6. **Guardado en formato JSON**

---

## 🚀 CÓMO USAR EL SISTEMA

### PASO 1: Iniciar el Servidor

```bash
# Si ya tienes el servidor corriendo, detenlo con Ctrl+C
# Luego inicia de nuevo:
npm start
```

### PASO 2: Abrir la Aplicación

Abre tu navegador en: **http://localhost:3000**

### PASO 3: Ir al Grabador

Click en la pestaña **"Grabador"** en el menú lateral

### PASO 4: Iniciar Grabación

1. Click en **"Iniciar Grabación"**
2. Aparecerá un **DIÁLOGO DE CONFIGURACIÓN DE PROYECTO**:

```
╔════════════════════════════════════════╗
║  📁 Configuración del Proyecto        ║
╠════════════════════════════════════════╣
║                                        ║
║  📁 Carpeta del Proyecto:              ║
║  [C:\Dev\aagw\OCR\workflows_______]   ║
║                                        ║
║  🏷️ Nombre del Proyecto:               ║
║  [Proyecto_1733565600000___________]  ║
║                                        ║
╠════════════════════════════════════════╣
║         [Cancelar]  [Comenzar]         ║
╚════════════════════════════════════════╝
```

3. Configura:
   - **Carpeta**: Donde se guardará el proyecto
   - **Nombre**: Nombre descriptivo del proyecto
4. Click en **"Comenzar"**

### PASO 5: Primera Navegación

Después de configurar el proyecto, aparece **DIÁLOGO DE NAVEGACIÓN**:

```
╔════════════════════════════════════════╗
║  🌐 Configurar Navegación             ║
╠════════════════════════════════════════╣
║                                        ║
║  🏷️ Nombre de la Ventana:             ║
║  [ventana1_____________________]      ║
║                                        ║
║  🌐 URL:                               ║
║  [https://www.google.com________]     ║
║                                        ║
║  ⏱️ Duración (ms):                     ║
║  [2000_________________________]      ║
║                                        ║
╠════════════════════════════════════════╣
║         [Cancelar]  [Navegar]          ║
╚════════════════════════════════════════╝
```

5. Configura:
   - **Nombre de la Ventana**: `ventana1`, `paginaPrincipal`, etc.
   - **URL**: La página que quieres automatizar
   - **Duración**: Tiempo de espera después de navegar (en milisegundos)
6. Click en **"Navegar"**

### PASO 6: Interactuar con Elementos

Se abrirá una nueva ventana/pestaña. Cuando hagas click en un elemento:

#### Para INPUTS/TEXTAREAS:

```
╔════════════════════════════════════════╗
║  📋 Configurar Acción: INPUT          ║
╠════════════════════════════════════════╣
║                                        ║
║  🎯 Tipo de Input                      ║
║  Tag: <input>                          ║
║  Type: text                            ║
║  Name: q                               ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  🎬 Tipo de Acción:                    ║
║  [⌨️ ESCRIBIR Texto          ▼]       ║
║                                        ║
║  Opciones disponibles:                 ║
║  • ⌨️ ESCRIBIR Texto                   ║
║  • 🖱️ CLICK Simple                     ║
║  • 🖱️🖱️ DOBLE CLICK                    ║
║  • 🗑️ LIMPIAR Campo                    ║
║                                        ║
║  🏷️ Nombre del Objeto:                 ║
║  [txtBusqueda__________________]      ║
║                                        ║
║  🎯 Selector CSS:                      ║
║  [input[name="q"]______________▼]     ║
║                                        ║
║  ⏱️ Delay (ms):                        ║
║  [500__________________________]      ║
║                                        ║
║  --- Si seleccionaste ESCRIBIR ---    ║
║                                        ║
║  📝 Texto a escribir:                  ║
║  [automation rpa_______________]      ║
║                                        ║
║  ⌨️ [✓] Presionar ENTER después       ║
║                                        ║
║  📝 Notas:                             ║
║  [Campo principal de búsqueda__]      ║
║                                        ║
╠════════════════════════════════════════╣
║         [Cancelar]  [Confirmar]        ║
╚════════════════════════════════════════╝
```

#### Para BOTONES:

```
╔════════════════════════════════════════╗
║  📋 Configurar Acción: BUTTON         ║
╠════════════════════════════════════════╣
║                                        ║
║  🎬 Tipo de Acción:                    ║
║  [🖱️ CLICK Simple           ▼]        ║
║                                        ║
║  Opciones disponibles:                 ║
║  • 🖱️ CLICK Simple                     ║
║  • 🖱️🖱️ DOBLE CLICK                    ║
║  • 👆 HOVER (pasar mouse)              ║
║                                        ║
║  🏷️ Nombre del Objeto:                 ║
║  [btnBuscar____________________]      ║
║                                        ║
║  🎯 Selector CSS:                      ║
║  [button[type="submit"]________▼]     ║
║                                        ║
║  ⏱️ Delay (ms):                        ║
║  [500__________________________]      ║
║                                        ║
║  📝 Notas:                             ║
║  [Ejecuta la búsqueda__________]      ║
║                                        ║
╠════════════════════════════════════════╣
║         [Cancelar]  [Confirmar]        ║
╚════════════════════════════════════════╝
```

#### Para IMÁGENES:

```
╔════════════════════════════════════════╗
║  📋 Configurar Acción: IMG            ║
╠════════════════════════════════════════╣
║                                        ║
║  🖼️ IMAGEN DETECTADA                   ║
║  Src: https://www.google.com/logo.png ║
║  Alt: Google                           ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  🎬 Tipo de Acción:                    ║
║  [🖱️ CLICK en imagen        ▼]        ║
║                                        ║
║  Opciones disponibles:                 ║
║  • 🖱️ CLICK en imagen                  ║
║  • 💾 GUARDAR Imagen                   ║
║  • 📸 CAPTURAR área                    ║
║                                        ║
║  🏷️ Nombre del Objeto:                 ║
║  [imgLogo______________________]      ║
║                                        ║
║  🎯 Selector CSS:                      ║
║  [img[alt="Google"]____________▼]     ║
║                                        ║
║  ⏱️ Delay (ms):                        ║
║  [500__________________________]      ║
║                                        ║
║  --- Si seleccionaste GUARDAR ---     ║
║                                        ║
║  💾 Ruta de guardado:                  ║
║  [images/imgLogo.png___________]      ║
║                                        ║
║  📝 Notas:                             ║
║  [Logo principal de Google_____]      ║
║                                        ║
╠════════════════════════════════════════╣
║         [Cancelar]  [Confirmar]        ║
╚════════════════════════════════════════╝
```

### PASO 7: Continuar Grabando

Después de confirmar cada acción:
- La acción se agrega a la lista
- Puedes continuar haciendo click en más elementos
- Cada click abrirá su respectivo diálogo
- El contador de acciones se actualiza en tiempo real

### PASO 8: Ver Acciones Grabadas

En la ventana principal verás la lista de acciones:

```
┌─────────────────────────────────────────┐
│ Acciones Grabadas (4)                   │
├─────────────────────────────────────────┤
│                                         │
│ 1. 🌐 ventana1                          │
│    NAVIGATE: https://www.google.com     │
│    Delay: 2000ms                        │
│    💬 Navegación inicial                │
│                          [✏️] [🗑️]      │
├─────────────────────────────────────────┤
│ 2. ⌨️ txtBusqueda                       │
│    TYPE: "automation rpa" + ENTER       │
│    Selector: input[name="q"]            │
│    Delay: 500ms                         │
│    💬 Campo principal de búsqueda       │
│                          [✏️] [🗑️]      │
├─────────────────────────────────────────┤
│ 3. 🖱️ btnBuscar                         │
│    CLICK: button[type="submit"]         │
│    Delay: 500ms                         │
│    💬 Ejecuta la búsqueda               │
│                          [✏️] [🗑️]      │
├─────────────────────────────────────────┤
│ 4. 🖼️ imgLogo IMAGEN                    │
│    CLICK en imagen                      │
│    Selector: img[alt="Google"]          │
│    Delay: 500ms                         │
│    💬 Logo principal de Google          │
│                          [✏️] [🗑️]      │
└─────────────────────────────────────────┘
```

### PASO 9: Detener Grabación

1. Click en **"Detener"**
2. Se cierra la ventana de grabación
3. Las acciones quedan en la lista

### PASO 10: Guardar como Workflow

1. Click en **"Guardar como Workflow"**
2. Se crea automáticamente la estructura de carpetas:

```
C:\Dev\aagw\OCR\workflows\
└── Proyecto_1733565600000\
    ├── main.json
    ├── config.json
    ├── images\
    │   └── imgLogo.png
    ├── objects\
    │   ├── txtBusqueda.json
    │   ├── btnBuscar.json
    │   └── imgLogo.json
    └── screenshots\
```

### PASO 11: Ejecutar el Workflow

1. Ve a la pestaña **"Ejecutor"**
2. Click en **"Ejecutar Workflow Actual"**
3. El sistema ejecutará todas las acciones en orden
4. Verás el progreso en tiempo real

---

## 📁 ESTRUCTURA DE ARCHIVOS GENERADOS

### main.json

```json
{
  "name": "Proyecto_1733565600000",
  "description": "Workflow automatizado",
  "created": "2024-12-07T10:00:00.000Z",
  "actions": [
    {
      "id": "action_1",
      "varName": "ventana1",
      "type": "navigate",
      "url": "https://www.google.com",
      "delay": 2000,
      "notes": "Navegación inicial"
    },
    {
      "id": "action_2",
      "varName": "txtBusqueda",
      "type": "type",
      "selector": "input[name=\"q\"]",
      "text": "automation rpa",
      "keystroke": true,
      "delay": 500,
      "notes": "Campo principal de búsqueda"
    },
    {
      "id": "action_3",
      "varName": "btnBuscar",
      "type": "click",
      "selector": "button[type=\"submit\"]",
      "delay": 500,
      "notes": "Ejecuta la búsqueda"
    },
    {
      "id": "action_4",
      "varName": "imgLogo",
      "type": "click",
      "selector": "img[alt=\"Google\"]",
      "delay": 500,
      "notes": "Logo principal de Google",
      "element": {
        "isImage": true,
        "src": "https://www.google.com/logo.png"
      }
    }
  ]
}
```

### config.json

```json
{
  "projectFolder": "C:\\Dev\\aagw\\OCR\\workflows",
  "projectName": "Proyecto_1733565600000",
  "browser": "chrome",
  "headless": false,
  "viewport": {
    "width": 1280,
    "height": 720
  }
}
```

### objects/txtBusqueda.json

```json
{
  "varName": "txtBusqueda",
  "selector": "input[name=\"q\"]",
  "type": "input",
  "tag": "INPUT",
  "attributes": {
    "type": "text",
    "name": "q",
    "class": "search-box"
  },
  "suggestedActions": ["type", "click", "double-click", "clear"],
  "captured": "2024-12-07T10:01:15.000Z"
}
```

---

## 🎯 CARACTERÍSTICAS CLAVE

### ✅ Configuración por Acción
- Cada click abre un diálogo
- No se guarda nada sin confirmación
- Control total sobre cada elemento

### ✅ Detección Inteligente
- Reconoce inputs, buttons, images, links
- Sugiere acciones apropiadas para cada tipo
- Nombres de variables auto-generados

### ✅ Estructura Organizada
- Carpetas separadas para images, objects, screenshots
- JSON bien estructurado
- Fácil de versionar y compartir

### ✅ Soporte de Keystrokes
- Checkbox para presionar ENTER
- Útil para enviar formularios
- Simula interacción real

### ✅ Identificación de Imágenes
- Detecta automáticamente IMG tags
- Detecta background-image en CSS
- Guarda metadata de la imagen

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### No aparece el diálogo de configuración
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que se cargó `recorder-professional.js`
4. Ejecuta: `console.log(Recorder)`
5. Debe mostrar un objeto, no undefined

### Los botones de confirmación no funcionan
1. Verifica que Socket.IO esté conectado
2. Revisa el indicador de conexión en el header
3. Reinicia el servidor si es necesario

### Las acciones no se agregan a la lista
1. Abre la consola
2. Verifica que aparece: "✅ Acción confirmada"
3. Si no aparece, revisa los logs del servidor
4. Puede haber un error en la comunicación

### El workflow no se ejecuta
1. Ve a la pestaña "Ejecutor"
2. Verifica que haya un workflow cargado
3. Revisa el log de ejecución por errores
4. Verifica que Puppeteer esté instalado: `npm list puppeteer`

---

## 📚 PRÓXIMOS PASOS

1. **Prueba el sistema**: Inicia una grabación y captura algunas acciones
2. **Verifica los archivos**: Revisa que se creen las carpetas y JSONs
3. **Ejecuta el workflow**: Confirma que las acciones se reproducen correctamente
4. **Reporta problemas**: Si algo no funciona, revisa la consola y los logs

---

## 🎉 VENTAJAS DEL SISTEMA PROFESIONAL

✅ **Control Total**: Configuras TODO antes de guardar
✅ **Sin Pérdidas**: Nada se graba sin tu confirmación
✅ **Organizado**: Estructura de carpetas profesional
✅ **Flexible**: Diferentes acciones según el tipo de elemento
✅ **Documentado**: Campo de notas para cada acción
✅ **Inteligente**: Detecta automáticamente imágenes y tipos
✅ **JSON**: Formato estándar, fácil de procesar
✅ **Versionable**: Estructura compatible con Git

---

**¡El sistema está listo para usar! 🚀**

Reinicia el servidor y prueba la nueva funcionalidad profesional.
