# 🪟 Componente "Ventanas"

Componente de IA generado automáticamente para detectar y gestionar ventanas y pestañas abiertas del navegador.

## 📋 Descripción

El componente **Ventanas** permite interactuar con las ventanas y pestañas del navegador, proporcionando funcionalidades para:
- Listar todas las ventanas y pestañas abiertas
- Obtener información de la ventana activa
- Contar cuántas pestañas hay abiertas
- Filtrar ventanas por URL o título
- Exportar información en múltiples formatos

## 🎯 Categoría

**🪟 Acciones Windows** - Componente de gestión de ventanas del sistema

## 🔧 Propiedades

### 1. **Acción** (requerido)
- **Tipo:** Select
- **Default:** `list_all`
- **Opciones:**
  - `list_all` - Listar todas las ventanas y pestañas
  - `get_active` - Obtener ventana activa
  - `count_tabs` - Contar pestañas abiertas
  - `filter_by_url` - Filtrar por URL
  - `filter_by_title` - Filtrar por título

### 2. **Filtro** (opcional)
- **Tipo:** Text
- **Default:** `""`
- **Ejemplo:** `google.com` o `*facebook*`
- **Descripción:** Texto para filtrar ventanas/pestañas (solo si seleccionaste filtrar)

### 3. **Incluir detalles completos**
- **Tipo:** Checkbox
- **Default:** `true`
- **Descripción:** Incluir URL, título, ID y estado de cada pestaña

### 4. **Variable de salida** (requerido)
- **Tipo:** Text
- **Default:** `ventanas`
- **Descripción:** Nombre de la variable donde se guardará el resultado

### 5. **Formato de salida**
- **Tipo:** Select
- **Default:** `json`
- **Opciones:**
  - `json` - JSON (objeto completo)
  - `array` - Array de objetos
  - `count` - Solo cantidad
  - `urls` - Solo URLs
  - `titles` - Solo títulos

## 💡 Ejemplos de Uso

### Ejemplo 1: Listar todas las ventanas
```javascript
{
  "action": "list_all",
  "includeDetails": true,
  "outputVariable": "todasLasVentanas",
  "format": "json"
}
```

**Resultado esperado:**
```json
{
  "count": 5,
  "windows": [
    {
      "id": 1,
      "title": "Google - Búsqueda",
      "url": "https://www.google.com",
      "active": true
    },
    {
      "id": 2,
      "title": "GitHub",
      "url": "https://github.com",
      "active": false
    }
  ]
}
```

### Ejemplo 2: Obtener solo ventana activa
```javascript
{
  "action": "get_active",
  "includeDetails": true,
  "outputVariable": "ventanaActiva",
  "format": "json"
}
```

**Resultado esperado:**
```json
{
  "id": 1,
  "title": "Workflow Editor - RPA Tool",
  "url": "http://localhost:3000",
  "active": true
}
```

### Ejemplo 3: Contar pestañas abiertas
```javascript
{
  "action": "count_tabs",
  "outputVariable": "numeroPestanas",
  "format": "count"
}
```

**Resultado esperado:**
```javascript
5
```

### Ejemplo 4: Filtrar por URL
```javascript
{
  "action": "filter_by_url",
  "filter": "google.com",
  "includeDetails": true,
  "outputVariable": "ventanasGoogle",
  "format": "array"
}
```

**Resultado esperado:**
```json
[
  {
    "id": 1,
    "title": "Google - Búsqueda",
    "url": "https://www.google.com",
    "active": true
  },
  {
    "id": 3,
    "title": "Google Drive",
    "url": "https://drive.google.com",
    "active": false
  }
]
```

### Ejemplo 5: Obtener solo títulos
```javascript
{
  "action": "list_all",
  "outputVariable": "titulosVentanas",
  "format": "titles"
}
```

**Resultado esperado:**
```json
[
  "Google - Búsqueda",
  "GitHub",
  "Workflow Editor - RPA Tool",
  "Google Drive",
  "YouTube"
]
```

## 🔄 Integración con Workflow

### Paso 1: Agregar al Workflow
1. Abre el Workflow Editor
2. Busca "Ventanas" en la categoría **🪟 Acciones Windows**
3. Arrastra el componente al canvas

### Paso 2: Configurar
1. Selecciona la acción que deseas realizar
2. Configura los filtros si es necesario
3. Define el nombre de la variable de salida
4. Elige el formato de salida

### Paso 3: Usar los datos
Puedes usar la variable de salida en componentes posteriores:

```javascript
// Ejemplo: Usar ventanas filtradas en un loop
{
  "type": "loop",
  "items": "{{ventanasGoogle}}",
  "itemVariable": "ventana",
  "actions": [
    {
      "type": "log",
      "message": "Procesando ventana: {{ventana.title}}"
    }
  ]
}
```

## 🎨 Icono

El componente usa el icono **Font Awesome**: `fa-window-restore`

## 📊 Estructura de Datos

### Formato JSON completo:
```typescript
interface VentanasResult {
  count: number;
  windows: Array<{
    id: number;
    title: string;
    url: string;
    active: boolean;
    width?: number;
    height?: number;
    tabs?: Array<{
      id: number;
      title: string;
      url: string;
      active: boolean;
    }>;
  }>;
}
```

### Formato Array:
```typescript
Array<{
  id: number;
  title: string;
  url: string;
  active: boolean;
}>
```

### Formato Count:
```typescript
number
```

### Formato URLs:
```typescript
Array<string>
```

### Formato Titles:
```typescript
Array<string>
```

## ⚠️ Notas Importantes

1. **Permisos del navegador**: Este componente requiere permisos para acceder a información de pestañas
2. **Extensión requerida**: La extensión de navegador debe estar instalada y activa
3. **Filtros con wildcards**: Puedes usar `*` como comodín en los filtros (ej: `*google*`)
4. **Rendimiento**: Si tienes muchas pestañas abiertas (100+), considera usar filtros para mejorar el rendimiento
5. **Privacidad**: Las URLs y títulos de pestañas pueden contener información sensible

## 🔧 Implementación Técnica

El componente se comunica con la extensión del navegador a través de:

```javascript
// Ejemplo de implementación
async function getWindows(config) {
  // Enviar mensaje a la extensión
  const response = await browser.runtime.sendMessage({
    type: 'GET_WINDOWS',
    config: config
  });

  return response.windows;
}
```

## 📝 ID del Componente

```
windows_ventanas_miz32r6e
```

## 📅 Fecha de Generación

9 de diciembre de 2025, 21:19:35 UTC

## 🤖 Generado por

Sistema de Generación de Componentes con IA de Alqvimia RPA

---

**¿Necesitas más funcionalidades?** Puedes modificar el componente editando el archivo [ventanas.json](ventanas.json) o regenerándolo con el Generador de Componentes IA.
