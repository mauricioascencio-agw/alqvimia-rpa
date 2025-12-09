# 🔢 NUMERACIÓN AUTOMÁTICA DE OBJETOS

## ✅ Implementado

Ahora cada objeto se enumera automáticamente según se genera dentro del flujo.

---

## 🎯 CÓMO FUNCIONA

### 1. Numeración Automática

Cada vez que capturas un objeto, el sistema le asigna:

- **Número Secuencial**: 1, 2, 3, 4, etc.
- **ID de Secuencia**: OBJ_001, OBJ_002, OBJ_003, etc.
- **Orden en el Flujo**: Posición exacta dentro del workflow

### 2. Visualización en la Lista

Cuando captures objetos, verás:

```
┌──────────────────────────────────────────────────────┐
│ Acciones Grabadas (3)                                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ⭕ 1  🌐  OBJ_001 Ventana Principal                │
│           🌐 Ir a: https://www.google.com           │
│           • Delay: 3000ms                            │
│                               [✏️] [🗑️]              │
├──────────────────────────────────────────────────────┤
│  ⭕ 2  ⌨️  OBJ_002 txtBusqueda                       │
│           ⌨️ Escribir: "automation rpa" + ENTER      │
│           • Delay: 500ms                             │
│           💬 Campo de búsqueda principal             │
│                               [✏️] [🗑️]              │
├──────────────────────────────────────────────────────┤
│  ⭕ 3  🖱️  OBJ_003 btnBuscar                         │
│           🖱️ Click • Delay: 2000ms                   │
│           💬 Ejecuta la búsqueda                     │
│                               [✏️] [🗑️]              │
└──────────────────────────────────────────────────────┘
```

**Donde:**
- `⭕ 1, 2, 3...` = Número circular morado visible
- `OBJ_001, OBJ_002...` = ID de secuencia con prefijo

---

## 📁 ESTRUCTURA DEL OBJETO GUARDADO

Cada objeto ahora incluye campos de numeración:

```json
{
  // 🔢 CAMPOS DE NUMERACIÓN
  "objectNumber": 2,
  "sequenceId": "OBJ_002",
  "orderInFlow": 2,

  // Información del objeto
  "varName": "txtBusqueda",
  "selector": "input[name='q']",
  "type": "input",
  "elementType": "input",

  // Propiedades
  "properties": {
    "id": "search-input",
    "name": "q",
    "type": "text",

    // Propiedades personalizadas
    "date": "2024-12-07",
    "string": "Campo de búsqueda",
    "cool": "yes"
  },

  // Metadata
  "captured": "2024-12-07T15:30:45.123Z",
  "capturedTimestamp": 1733589045123,

  // Acción
  "currentAction": "type",
  "suggestedActions": ["type", "click", "clear"],

  // Selector
  "allSelectors": [
    { "value": "#search-input", "type": "id" },
    { "value": "input[name='q']", "type": "name" }
  ],

  // Notas
  "notes": "Campo principal de búsqueda de Google"
}
```

---

## 🎬 EJEMPLO DE FLUJO COMPLETO

### Flujo: Login y Búsqueda

#### Objeto 1 (OBJ_001)
```json
{
  "objectNumber": 1,
  "sequenceId": "OBJ_001",
  "orderInFlow": 1,
  "varName": "Ventana Principal",
  "type": "navigate",
  "url": "https://app.ejemplo.com/login"
}
```

#### Objeto 2 (OBJ_002)
```json
{
  "objectNumber": 2,
  "sequenceId": "OBJ_002",
  "orderInFlow": 2,
  "varName": "txtEmail",
  "type": "input",
  "currentAction": "type",
  "properties": {
    "name": "email",
    "type": "email",
    "placeholder": "Tu email"
  }
}
```

#### Objeto 3 (OBJ_003)
```json
{
  "objectNumber": 3,
  "sequenceId": "OBJ_003",
  "orderInFlow": 3,
  "varName": "txtPassword",
  "type": "input",
  "currentAction": "type",
  "properties": {
    "name": "password",
    "type": "password"
  }
}
```

#### Objeto 4 (OBJ_004)
```json
{
  "objectNumber": 4,
  "sequenceId": "OBJ_004",
  "orderInFlow": 4,
  "varName": "btnLogin",
  "type": "button",
  "currentAction": "click"
}
```

---

## 💾 ARCHIVOS GUARDADOS

Cuando guardas el workflow, cada objeto se guarda con su número:

```
C:\Dev\aagw\OCR\workflows\
└── MiProyecto\
    ├── main.json
    ├── config.json
    ├── objects\
    │   ├── txtEmail.json      ← Contiene objectNumber: 2
    │   ├── txtPassword.json   ← Contiene objectNumber: 3
    │   └── btnLogin.json      ← Contiene objectNumber: 4
    ├── images\
    └── screenshots\
```

### Ejemplo de `objects/txtEmail.json`:

```json
{
  "objectNumber": 2,
  "sequenceId": "OBJ_002",
  "orderInFlow": 2,
  "varName": "txtEmail",
  "selector": "input[name='email']",
  "type": "input",
  "elementType": "input",
  "properties": {
    "name": "email",
    "type": "email",
    "placeholder": "Tu email",
    "date": "2024-12-07",
    "required": "true"
  },
  "captured": "2024-12-07T15:31:20.456Z",
  "capturedTimestamp": 1733589080456,
  "orderInFlow": 2,
  "currentAction": "type",
  "notes": "Campo de email para login"
}
```

---

## 🔍 EN LA CONSOLA DEL NAVEGADOR

Cuando captures objetos, verás en la consola (F12):

```
🎯 OBJETO #1 CAPTURADO: {
  objectNumber: 1,
  sequenceId: "OBJ_001",
  orderInFlow: 1,
  varName: "Ventana Principal",
  ...
}

🎯 OBJETO #2 CAPTURADO: {
  objectNumber: 2,
  sequenceId: "OBJ_002",
  orderInFlow: 2,
  varName: "txtEmail",
  ...
}

🎯 OBJETO #3 CAPTURADO: {
  objectNumber: 3,
  sequenceId: "OBJ_003",
  orderInFlow: 3,
  varName: "txtPassword",
  ...
}
```

---

## 📊 VENTAJAS DE LA NUMERACIÓN

### 1. Trazabilidad Completa
- Sabes exactamente en qué orden se capturó cada objeto
- Fácil de seguir el flujo del workflow

### 2. Identificación Única
- Cada objeto tiene un ID único (OBJ_001, OBJ_002...)
- No hay confusión entre objetos similares

### 3. Debugging Más Fácil
- Si hay un error en el objeto 5, sabes exactamente cuál es
- Puedes saltar directamente al objeto problemático

### 4. Documentación Automática
- El número indica el orden lógico de ejecución
- Fácil de compartir con el equipo: "Revisa el objeto 3"

### 5. Reutilización
- Puedes hacer referencia a objetos anteriores
- "Usa el mismo selector del objeto 2"

---

## 🎯 CASOS DE USO

### Caso 1: Workflow con Validación
```
OBJ_001: Navegar a formulario
OBJ_002: Llenar campo email
OBJ_003: Llenar campo password
OBJ_004: Click en submit
OBJ_005: Verificar mensaje de error
OBJ_006: Corregir email
OBJ_007: Click en submit nuevamente
```

### Caso 2: Proceso de Múltiples Páginas
```
OBJ_001: Página 1 - Login
OBJ_002: txtUsuario
OBJ_003: txtPassword
OBJ_004: btnLogin
OBJ_005: Página 2 - Dashboard
OBJ_006: btnNuevoRegistro
OBJ_007: Página 3 - Formulario
OBJ_008: txtNombre
OBJ_009: txtApellido
OBJ_010: btnGuardar
```

### Caso 3: Loop con Múltiples Elementos
```
OBJ_001: Tabla de productos
OBJ_002: Producto 1 - Precio
OBJ_003: Producto 1 - Stock
OBJ_004: Producto 2 - Precio
OBJ_005: Producto 2 - Stock
OBJ_006: Producto 3 - Precio
OBJ_007: Producto 3 - Stock
```

---

## ✅ VERIFICACIÓN

Para verificar que la numeración funciona:

1. **Inicia grabación**
2. **Captura 3-5 objetos**
3. **Abre la consola** (F12)
4. **Busca**: `🎯 OBJETO #`
5. **Verás**:
   ```
   🎯 OBJETO #1 CAPTURADO: {...}
   🎯 OBJETO #2 CAPTURADO: {...}
   🎯 OBJETO #3 CAPTURADO: {...}
   ```

6. **En la lista visual** verás círculos morados con números: 1, 2, 3...
7. **En cada título** verás: `OBJ_001`, `OBJ_002`, `OBJ_003`...

---

## 📝 RESUMEN

### Campos Agregados:
```javascript
{
  objectNumber: 1,          // Número simple: 1, 2, 3...
  sequenceId: "OBJ_001",    // ID formateado: OBJ_001, OBJ_002...
  orderInFlow: 1,           // Posición en el flujo
  ...
}
```

### Visualización:
- ⭕ **Círculo morado** con número (1, 2, 3...)
- 🏷️ **ID de Secuencia** en el título (OBJ_001, OBJ_002...)
- 📋 **Console log** con número: `🎯 OBJETO #1 CAPTURADO`

### Guardado:
- ✅ Cada objeto guardado incluye los 3 campos de numeración
- ✅ Se mantiene el orden en el archivo JSON
- ✅ Fácil de buscar y filtrar

---

## 🚀 ¡LISTO PARA USAR!

Reinicia el servidor y prueba:

```bash
npm start
```

Abre http://localhost:3000 y verás la numeración automática en acción! 🎉
