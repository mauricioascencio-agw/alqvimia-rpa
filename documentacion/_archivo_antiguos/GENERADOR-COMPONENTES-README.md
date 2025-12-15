# 🤖 Sistema Generador de Componentes con IA

## Descripción General

Sistema completo para generar componentes de automatización mediante prompts de lenguaje natural, con integración automática al workflow y al grabador.

## 📋 Características Principales

### 1. **Generador de Componentes con IA**
- Genera componentes automáticamente a partir de descripciones en lenguaje natural
- Detecta automáticamente la categoría del componente
- Infiere el tipo de propiedades necesarias
- Selecciona iconos apropiados
- Crea IDs únicos para cada componente

### 2. **Barra de Búsqueda Inteligente**
- Filtrado en tiempo real de componentes
- Búsqueda por nombre o ID
- Resaltado de términos coincidentes
- Estadísticas de resultados
- Atajos de teclado (Ctrl+K para enfocar, ESC para limpiar)

### 3. **Integración Automática**
- Los componentes generados se integran automáticamente al workflow
- Aparecen en el palette como componentes arrastrables
- Se registran en MCPProperties para el grabador
- Persistencia en localStorage

---

## 🚀 Cómo Usar

### Generar un Nuevo Componente

1. **Abrir el Generador**
   - En la vista de Workflows, haz clic en el botón **"Generar Componente con IA"**

2. **Describir el Componente**
   ```
   Ejemplo: "Quiero un componente que envíe mensajes de WhatsApp.
   Debe tener campos para número de teléfono, mensaje, y opción
   para adjuntar imagen."
   ```

3. **Opciones Adicionales**
   - **Nombre**: Dejar vacío para generación automática
   - **Categoría**: Seleccionar categoría o usar auto-detección

4. **Generar**
   - El sistema analizará la descripción
   - Creará las propiedades necesarias
   - Registrará el componente automáticamente

### Buscar Componentes

1. **Usar la Barra de Búsqueda**
   - En el palette de workflows, escribe en la barra de búsqueda
   - Los componentes se filtrarán en tiempo real

2. **Atajos de Teclado**
   - `Ctrl+K` o `Cmd+K`: Enfocar búsqueda
   - `ESC`: Limpiar búsqueda

### Ver Componentes Generados

1. **Lista de Componentes**
   - Haz clic en **"Ver Componentes Generados"**
   - Verás todos los componentes que has creado

2. **Eliminar Componentes**
   - Desde la lista, usa el botón de eliminar (🗑️)

---

## 📁 Archivos del Sistema

### JavaScript

#### `component-generator.js`
Sistema principal de generación de componentes con IA.

**Funciones Principales:**
- `showGeneratorModal()`: Muestra el modal de generación
- `generateComponent()`: Genera el componente a partir del prompt
- `analyzeAndGenerate()`: Analiza el prompt y crea la estructura
- `detectCategory()`: Detecta la categoría automáticamente
- `extractProperties()`: Extrae propiedades del prompt
- `registerComponent()`: Registra el componente en el sistema

**Patrones de Detección:**

```javascript
// Categorías detectadas por palabras clave
web: ['navegador', 'browser', 'click', 'web', 'url']
windows: ['ventana', 'window', 'aplicación', 'app']
excel: ['excel', 'hoja', 'celda', 'fila', 'columna']
files: ['archivo', 'file', 'carpeta', 'folder']
data: ['base de datos', 'database', 'sql', 'query']
flow: ['condición', 'if', 'loop', 'repetir', 'while']
mcp: ['api', 'servicio', 'integración', 'conector']
```

#### `component-search.js`
Sistema de búsqueda y filtrado de componentes.

**Funciones Principales:**
- `handleSearch()`: Maneja la búsqueda en tiempo real
- `filterComponents()`: Filtra componentes por término
- `highlightSearchTerm()`: Resalta términos coincidentes
- `updateSearchStats()`: Muestra estadísticas de búsqueda

#### `component-integrator.js`
Integra componentes generados al workflow y grabador.

**Funciones Principales:**
- `injectGeneratedComponents()`: Inyecta componentes en el palette
- `initializeDragAndDrop()`: Habilita arrastrar y soltar
- `integrateToRecorder()`: Integra al grabador
- `observeComponentChanges()`: Observa cambios en componentes

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Componente de WhatsApp

**Prompt:**
```
Quiero un componente para enviar mensajes de WhatsApp. Necesito campos
para número de teléfono, mensaje, y opción para adjuntar imagen.
```

**Resultado:**
- **Nombre**: Enviar WhatsApp
- **Categoría**: MCP Connectors
- **Propiedades**:
  - phoneNumber (text, requerido)
  - message (textarea, requerido)
  - imagePath (text_or_variable, opcional)
  - resultVariable (text)

### Ejemplo 2: Validación de Email

**Prompt:**
```
Crear un componente que valide si un email es correcto. Debe recibir
el email y guardar el resultado en una variable.
```

**Resultado:**
- **Nombre**: Validar Email
- **Categoría**: Data Processing
- **Propiedades**:
  - email (text, requerido)
  - resultVariable (text, requerido)

### Ejemplo 3: Leer Archivo JSON

**Prompt:**
```
Necesito un componente que lea archivos JSON y guarde el contenido
en una variable. Debe tener opción para especificar la ruta del archivo.
```

**Resultado:**
- **Nombre**: Leer JSON
- **Categoría**: Files
- **Propiedades**:
  - filePath (text_or_variable, requerido)
  - resultVariable (text, requerido)

---

## 🔧 Configuración Técnica

### Almacenamiento

Los componentes generados se guardan en `localStorage`:

```javascript
localStorage.getItem('generated_components')
```

**Estructura de Datos:**
```json
[
  {
    "id": "custom_enviar_whatsapp_abc123",
    "title": "Enviar WhatsApp",
    "icon": "fa-whatsapp",
    "category": "mcp",
    "properties": [
      {
        "name": "phoneNumber",
        "label": "Número de Teléfono",
        "type": "text",
        "required": true,
        "placeholder": "+521234567890"
      }
    ],
    "description": "Componente para enviar mensajes...",
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "prompt": "Quiero un componente que..."
  }
]
```

### Eventos Personalizados

El sistema emite eventos para sincronización:

```javascript
// Cuando se actualizan componentes
document.dispatchEvent(new Event('componentsUpdated'));

// Escuchar cambios
document.addEventListener('componentsUpdated', () => {
    // Tu código aquí
});
```

---

## 📊 Categorías de Componentes

| Categoría | Prefijo ID | Palabras Clave | Icono Predeterminado |
|-----------|-----------|----------------|---------------------|
| Web | `web_` | navegador, browser, click, url | fa-globe |
| Windows | `windows_` | ventana, aplicación, app | fa-window-maximize |
| Excel | `excel_` | excel, hoja, celda | fa-file-excel |
| Archivos | `files_` | archivo, carpeta, folder | fa-folder |
| Data | `data_` | database, sql, query | fa-database |
| Flow | `flow_` | condición, if, loop | fa-random |
| MCP | `mcp_` | api, servicio, integración | fa-plug |
| Custom | `custom_` | (otros) | fa-cog |

---

## 🎨 Tipos de Propiedades Soportadas

### Tipos Básicos
- `text`: Entrada de texto simple
- `textarea`: Área de texto multilínea
- `number`: Entrada numérica
- `password`: Entrada de contraseña
- `checkbox`: Casilla de verificación

### Tipos Especiales
- `text_or_variable`: Permite seleccionar texto o variable
- `select`: Lista desplegable con opciones
- `datetime-local`: Selector de fecha y hora

### Propiedades Automáticas

El sistema detecta automáticamente estas propiedades comunes:

| Palabra Clave | Propiedad Generada |
|---------------|-------------------|
| "número", "teléfono" | phoneNumber (text) |
| "mensaje", "texto" | message (textarea) |
| "email", "correo" | email (text) |
| "archivo", "ruta" | filePath (text_or_variable) |
| "imagen", "foto" | imagePath (text_or_variable) |
| "url", "enlace" | url (text) |
| "usuario" | username (text) |
| "contraseña" | password (password) |
| "timeout", "espera" | timeout (number) |

---

## 🔍 Búsqueda de Componentes

### Sintaxis de Búsqueda

La búsqueda funciona con:
- **Nombre del componente**: "whatsapp", "excel", "email"
- **ID del componente**: "mcp_", "web_", "custom_"
- **Palabras parciales**: "env" coincide con "Enviar Email"

### Funcionalidades

1. **Filtrado en Tiempo Real**: Los resultados se actualizan mientras escribes
2. **Resaltado**: Los términos coincidentes aparecen destacados
3. **Estadísticas**: Muestra cantidad de coincidencias
4. **Por Categoría**: Oculta categorías sin coincidencias

---

## 🛠️ API para Desarrolladores

### Crear Componente Programáticamente

```javascript
// Crear estructura de componente
const newComponent = {
    id: 'custom_mi_componente_' + Date.now().toString(36),
    title: 'Mi Componente',
    icon: 'fa-cog',
    category: 'custom',
    properties: [
        {
            name: 'value',
            label: 'Valor',
            type: 'text',
            required: true
        }
    ],
    description: 'Descripción del componente',
    generatedAt: new Date().toISOString()
};

// Agregar a la lista
ComponentGenerator.generatedComponents.push(newComponent);

// Guardar y registrar
ComponentGenerator.saveGeneratedComponents();
ComponentGenerator.registerComponent(newComponent);
```

### Filtrar Componentes

```javascript
// Filtrar por término
ComponentSearch.handleSearch('whatsapp');

// Limpiar búsqueda
ComponentSearch.handleSearch('');

// Obtener todos los componentes
const allComponents = ComponentSearch.getAllComponentNames();
```

### Refrescar Integración

```javascript
// Refrescar componentes en palette
ComponentIntegrator.refresh();

// Integrar al grabador
ComponentIntegrator.integrateAllToRecorder();
```

---

## 📝 Notas Importantes

1. **Persistencia**: Los componentes se guardan en `localStorage`, por lo que persisten entre sesiones

2. **IDs Únicos**: Cada componente tiene un ID único basado en:
   - Categoría
   - Nombre (slug)
   - Timestamp

3. **Eventos**: El sistema emite eventos `componentsUpdated` para sincronización

4. **Drag & Drop**: Los componentes generados son completamente arrastrables como componentes nativos

5. **MCPProperties**: Los componentes se registran automáticamente en `MCPProperties` para funcionar con el grabador

---

## 🐛 Solución de Problemas

### Los componentes no aparecen en el palette

**Solución:**
```javascript
// Verificar que ComponentIntegrator esté cargado
console.log(typeof ComponentIntegrator);

// Refrescar manualmente
ComponentIntegrator.refresh();
```

### La búsqueda no funciona

**Solución:**
```javascript
// Verificar que ComponentSearch esté inicializado
console.log(typeof ComponentSearch);

// Reinicializar
ComponentSearch.init();
```

### Componentes duplicados

**Solución:**
```javascript
// Limpiar localStorage
localStorage.removeItem('generated_components');

// Recargar página
location.reload();
```

---

## 🚀 Mejoras Futuras

- [ ] Exportar/Importar componentes como JSON
- [ ] Plantillas de componentes predefinidas
- [ ] IA más avanzada con GPT para generar código funcional
- [ ] Versionado de componentes
- [ ] Compartir componentes entre usuarios
- [ ] Editor visual de propiedades
- [ ] Validación de componentes antes de agregar
- [ ] Categorías personalizadas
- [ ] Temas visuales para componentes

---

## 📄 Licencia

Este sistema es parte del proyecto Element Spy RPA.

---

## 👥 Contribuciones

Para agregar nuevos tipos de detección o mejorar el sistema, editar:
- `component-generator.js` (lógica de generación)
- `component-search.js` (búsqueda y filtrado)
- `component-integrator.js` (integración)

---

**¡Disfruta creando componentes con IA!** 🎉
