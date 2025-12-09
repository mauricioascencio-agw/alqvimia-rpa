# 🎯 CAPTURA DE OBJETOS MEJORADA - Sistema Completo

## ✅ MEJORAS IMPLEMENTADAS

Se han realizado las siguientes mejoras al sistema de captura de objetos:

### 1. **Propiedades Personalizadas**
Ahora puedes agregar propiedades personalizadas a cada objeto:
- `string` - Valor de tipo texto
- `date` - Fecha asociada
- `cool` - Cualquier propiedad personalizada
- ¡Y las que tú definas!

### 2. **Guardado Completo de Objetos**
Cada objeto capturado ahora incluye:
- ✅ **Nombre de variable** (varName)
- ✅ **Selector CSS** completo
- ✅ **Tipo de elemento** (input, button, image, etc.)
- ✅ **Todas las propiedades HTML** (id, class, name, type, etc.)
- ✅ **Propiedades personalizadas** definidas por ti
- ✅ **Fecha y hora de captura**
- ✅ **Acciones sugeridas** para el objeto
- ✅ **Selectores alternativos**
- ✅ **Notas** descriptivas

---

## 🚀 CÓMO USAR

### PASO 1: Iniciar Grabación

1. Click en "Iniciar Grabación"
2. Configura tu proyecto:
   - Carpeta: `C:\Dev\aagw\OCR\workflows`
   - Nombre: `MiProyecto`
3. Configura la navegación inicial:
   - Ventana: `Ventana Principal`
   - URL: `https://www.google.com`
   - Delay: `3000ms`

### PASO 2: Click en un Elemento

Cuando hagas click en cualquier elemento (por ejemplo, la barra de búsqueda de Google):

#### Verás un diálogo con:

```
╔════════════════════════════════════════════════════════╗
║  🎯 Configurar Elemento: <input>                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🎯 ELEMENTO WEB                                       ║
║  Tag: <input>                                          ║
║  Tipo: text                                            ║
║  Placeholder: "Buscar"                                 ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🎬 ¿Qué acción deseas realizar?                       ║
║  [⌨️ ESCRIBIR Texto                          ▼]       ║
║                                                        ║
║  Opciones:                                             ║
║  • ⌨️ ESCRIBIR Texto                                   ║
║  • 🖱️ CLICK Simple                                     ║
║  • 🖱️🖱️ DOBLE CLICK                                    ║
║  • 🗑️ LIMPIAR Campo                                    ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🏷️ Nombre del Objeto:                                 ║
║  [txtBusqueda_____________________________]           ║
║  (Se guardará en: objects/txtBusqueda.json)            ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ⌨️ Texto a Escribir:                                  ║
║  [automation rpa______________________]               ║
║                                                        ║
║  ☑ Presionar ENTER después de escribir                ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ⏱️ Tiempo de Espera (ms):                             ║
║  [500_____________________________________]           ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🎯 Selector CSS:                                      ║
║  [input[name="q"]_________________________▼]          ║
║                                                        ║
║  Selectores disponibles:                               ║
║  • id: #search-input                                   ║
║  • name: input[name="q"]                               ║
║  • class: .search-box                                  ║
║  • xpath: //input[@name='q']                           ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🔧 Propiedades del Objeto (opcional):                 ║
║                                                        ║
║  Propiedad 1:  [date________]  [2024-12-07________]   ║
║  Propiedad 2:  [string______]  [texto de búsqueda_]   ║
║  Propiedad 3:  [cool________]  [yes_______________]   ║
║                                                        ║
║  Agrega propiedades personalizadas como:               ║
║  string, date, cool, etc.                              ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  📝 Notas:                                             ║
║  [Campo principal de búsqueda de Google           ]   ║
║  [que permite ingresar queries y buscar           ]   ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║            [Cancelar]        [Confirmar]               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### PASO 3: Configurar el Objeto

1. **Selecciona la acción** que deseas:
   - Para inputs: TYPE, CLICK, DOUBLE-CLICK, CLEAR
   - Para botones: CLICK, DOUBLE-CLICK, HOVER
   - Para imágenes: CLICK, SAVE-IMAGE, SCREENSHOT

2. **Nombre del objeto**:
   - Auto-generado con prefijo inteligente
   - Puedes modificarlo manualmente
   - Ejemplos: `txtBusqueda`, `btnEnviar`, `imgLogo`

3. **Texto** (si seleccionaste TYPE):
   - Escribe el texto que se debe ingresar
   - Marca checkbox si quieres presionar ENTER después

4. **Delay**:
   - Tiempo de espera después de la acción (en milisegundos)
   - Recomendado: 500-1000ms para acciones rápidas, 2000-3000ms para navegación

5. **Selector**:
   - Elige el mejor selector de la lista
   - Preferiblemente usa ID > Name > Class > XPath

6. **Propiedades Personalizadas** (NUEVO):
   - Agrega hasta 3 propiedades personalizadas
   - Formato: Nombre - Valor
   - Ejemplos:
     - `date` → `2024-12-07`
     - `string` → `Campo de búsqueda`
     - `cool` → `yes`
     - `priority` → `high`
     - `maxLength` → `100`

7. **Notas**:
   - Descripción detallada del objeto
   - Útil para recordar el propósito

### PASO 4: Confirmar

Click en **"Confirmar"** y verás:
- ✅ Notificación: "txtBusqueda agregado (type)"
- ✅ Objeto agregado a la lista de acciones
- ✅ Contador actualizado
- ✅ Objeto guardado en `capturedObjects[]`

---

## 📁 ESTRUCTURA DEL OBJETO GUARDADO

Cuando confirmas un objeto, se guarda con esta estructura completa:

```json
{
  "varName": "txtBusqueda",
  "selector": "input[name='q']",
  "type": "input",
  "elementType": "input",

  "properties": {
    "id": "search-input",
    "className": "search-box gLFyf",
    "name": "q",
    "type": "text",
    "placeholder": "Buscar",
    "value": "",
    "text": "",
    "href": "",
    "src": "",
    "alt": "",

    // ⭐ PROPIEDADES PERSONALIZADAS QUE TÚ AGREGASTE
    "date": "2024-12-07",
    "string": "Campo de búsqueda",
    "cool": "yes"
  },

  "captured": "2024-12-07T15:30:45.123Z",
  "capturedTimestamp": 1733589045123,

  "suggestedActions": ["type", "click", "clear"],
  "currentAction": "type",

  "allSelectors": [
    { "value": "#search-input", "type": "id" },
    { "value": "input[name='q']", "type": "name" },
    { "value": ".search-box", "type": "class" },
    { "value": "//input[@name='q']", "type": "xpath" }
  ],

  "notes": "Campo principal de búsqueda de Google que permite ingresar queries y buscar"
}
```

---

## 💾 GUARDADO EN ARCHIVO

Cuando detienes y guardas el workflow, el objeto se guarda en:

```
C:\Dev\aagw\OCR\workflows\
└── MiProyecto\
    ├── main.json              # Flujo principal con todas las acciones
    ├── config.json            # Configuración del proyecto
    ├── objects\
    │   └── txtBusqueda.json   ← AQUÍ SE GUARDA EL OBJETO
    ├── images\
    └── screenshots\
```

### Contenido de `objects/txtBusqueda.json`:

```json
{
  "varName": "txtBusqueda",
  "selector": "input[name='q']",
  "type": "input",
  "elementType": "input",
  "properties": {
    "id": "search-input",
    "className": "search-box gLFyf",
    "name": "q",
    "type": "text",
    "placeholder": "Buscar",
    "date": "2024-12-07",
    "string": "Campo de búsqueda",
    "cool": "yes"
  },
  "captured": "2024-12-07T15:30:45.123Z",
  "capturedTimestamp": 1733589045123,
  "suggestedActions": ["type", "click", "clear"],
  "currentAction": "type",
  "allSelectors": [
    { "value": "#search-input", "type": "id" },
    { "value": "input[name='q']", "type": "name" }
  ],
  "notes": "Campo principal de búsqueda"
}
```

---

## 🎬 EJEMPLO COMPLETO

### Flujo: Búsqueda en Google

#### 1. Navegación Inicial
```
Ventana: Ventana Principal
URL: https://www.google.com
Delay: 3000ms
```

#### 2. Primer Objeto - Campo de Búsqueda
```
Acción: ⌨️ ESCRIBIR Texto
Nombre: txtBusqueda
Texto: "automation rpa"
Enter: ☑ Sí
Selector: input[name="q"]
Delay: 500ms

Propiedades:
  - date: 2024-12-07
  - string: Campo principal
  - cool: yes

Notas: Campo de búsqueda principal de Google
```

**Objeto guardado:**
```json
{
  "varName": "txtBusqueda",
  "properties": {
    "name": "q",
    "type": "text",
    "date": "2024-12-07",
    "string": "Campo principal",
    "cool": "yes"
  },
  "currentAction": "type",
  "notes": "Campo de búsqueda principal de Google"
}
```

#### 3. Segundo Objeto - Botón Buscar
```
Acción: 🖱️ CLICK Simple
Nombre: btnBuscar
Selector: button[type="submit"]
Delay: 2000ms

Propiedades:
  - priority: high
  - timing: critical

Notas: Ejecuta la búsqueda
```

**Objeto guardado:**
```json
{
  "varName": "btnBuscar",
  "properties": {
    "type": "submit",
    "priority": "high",
    "timing": "critical"
  },
  "currentAction": "click",
  "notes": "Ejecuta la búsqueda"
}
```

#### 4. Tercer Objeto - Logo de Google
```
Acción: 🖱️ CLICK en Imagen
Nombre: imgLogo
Selector: img[alt="Google"]
Delay: 500ms

Propiedades:
  - imageType: logo
  - clickable: true

Notas: Logo principal de Google
```

**Objeto guardado:**
```json
{
  "varName": "imgLogo",
  "type": "img",
  "elementType": "image",
  "properties": {
    "src": "https://www.google.com/logo.png",
    "alt": "Google",
    "imageType": "logo",
    "clickable": "true"
  },
  "currentAction": "click",
  "notes": "Logo principal de Google"
}
```

---

## 📊 RESUMEN DE DATOS GUARDADOS

Al finalizar, tendrás:

### main.json (Flujo Principal)
```json
{
  "name": "MiProyecto",
  "actions": [
    {
      "type": "navigate",
      "windowName": "Ventana Principal",
      "url": "https://www.google.com"
    },
    {
      "type": "type",
      "objectName": "txtBusqueda",
      "text": "automation rpa",
      "sendEnter": true
    },
    {
      "type": "click",
      "objectName": "btnBuscar"
    },
    {
      "type": "click",
      "objectName": "imgLogo"
    }
  ]
}
```

### objects/ (Objetos Individuales)
- `txtBusqueda.json` - Con propiedades: date, string, cool
- `btnBuscar.json` - Con propiedades: priority, timing
- `imgLogo.json` - Con propiedades: imageType, clickable

---

## ✅ VENTAJAS DEL SISTEMA MEJORADO

### 1. Propiedades Personalizadas
- Define tus propias propiedades según tus necesidades
- Útil para metadata adicional
- Fácil de buscar y filtrar posteriormente

### 2. Objetos Completos
- Cada objeto tiene TODA su información
- No se pierde ningún detalle
- Fácil de reutilizar en otros workflows

### 3. Guardado Separado
- Cada objeto en su propio archivo JSON
- Fácil de versionar con Git
- Reutilizable entre proyectos

### 4. Trazabilidad
- Fecha y hora de captura
- Acción que se realizó
- Acciones sugeridas para el futuro

---

## 🎯 CASOS DE USO

### Caso 1: Formulario con Validación
```
Campo Email:
  - type: email
  - validation: required
  - pattern: email

Campo Password:
  - type: password
  - minLength: 8
  - strength: medium
```

### Caso 2: Tabla de Datos
```
Celda:
  - row: 3
  - column: B
  - dataType: number
  - format: currency
```

### Caso 3: Componente Dinámico
```
Dropdown:
  - dynamic: true
  - source: api
  - updateOn: change
  - filterBy: category
```

---

## 🚀 PRÓXIMOS PASOS

1. **Reinicia el servidor** si está corriendo:
   ```bash
   # Ctrl+C para detener
   npm start
   ```

2. **Abre la aplicación**:
   ```
   http://localhost:3000
   ```

3. **Prueba el nuevo sistema**:
   - Inicia grabación
   - Click en un elemento
   - Agrega propiedades personalizadas
   - Confirma y verifica que se guarde

4. **Revisa la consola** (F12):
   - Busca el mensaje: `🎯 OBJETO CAPTURADO:`
   - Verás el objeto completo con tus propiedades

5. **Guarda el workflow**:
   - Detén la grabación
   - Guarda como Workflow
   - Ve a la carpeta y revisa los archivos JSON

---

## 🎉 ¡LISTO!

Ahora tienes un sistema que:
- ✅ Captura cada objeto por separado
- ✅ Guarda todas las propiedades
- ✅ Permite agregar propiedades personalizadas (string, date, cool, etc.)
- ✅ Crea archivos JSON individuales para cada objeto
- ✅ Mantiene trazabilidad completa

**¡Empieza a capturar objetos con propiedades personalizadas!** 🚀
