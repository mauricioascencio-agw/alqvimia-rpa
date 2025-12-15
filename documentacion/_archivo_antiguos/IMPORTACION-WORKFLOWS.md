# 📥 Sistema Inteligente de Importación de Workflows

## 🎯 Descripción General

El sistema de importación inteligente de **Alqvimia** permite importar workflows desde múltiples formatos (JSON, Markdown, Mermaid) con análisis automático, validación, generación de componentes faltantes con IA, y guardado automático.

## ✨ Características Principales

### 1. **Múltiples Formatos de Importación**

- **📄 JSON**: Formato estándar con estructura completa
- **📝 Markdown (.md)**: Documentación con bloques de configuración JSON
- **🔷 Mermaid Chart**: Diagramas de flujo visuales

### 2. **Análisis Inteligente Automático**

El sistema analiza automáticamente tu workflow importado en 7 pasos:

1. **📊 Análisis de Secuencia**: Detecta todos los pasos y valida su estructura
2. **🔍 Propuesta de Componentes**: Identifica componentes existentes y faltantes
3. **📂 Categorización Automática**: Clasifica componentes en Web, Variables, Lógica, Datos, IA
4. **✅ Validación de Viabilidad**: Verifica que el flujo sea ejecutable
5. **🤖 Generación con IA**: Crea componentes faltantes automáticamente
6. **📋 Resumen Visual**: Muestra diagrama y listado paso a paso
7. **💾 Guardado Automático**: Almacena el workflow procesado

### 3. **Categorías de Componentes**

El sistema clasifica automáticamente los componentes en:

| Categoría | Descripción | Ejemplos |
|-----------|-------------|----------|
| 🌐 **Web** | Acciones de navegador | `click`, `browser_open`, `screenshot`, `scroll`, `navigate` |
| 💾 **Variables** | Gestión de datos | `set_variable`, `get_variable`, `store`, `load` |
| 🔀 **Lógica** | Control de flujo | `if_condition`, `loop`, `while`, `for`, `decision` |
| 📊 **Datos** | Procesamiento | `extract_data`, `save_to_excel`, `csv_read`, `json_parse` |
| 🤖 **IA** | Inteligencia Artificial | `ai_analyze`, `ocr`, `vision`, `gpt`, `claude` |
| ⚙️ **General** | Otros componentes | Componentes que no encajan en las categorías anteriores |

## 🚀 Cómo Usar

### Paso 1: Preparar tu Archivo

#### Opción A: JSON

```json
{
  "name": "Mi Workflow",
  "steps": [
    {
      "id": "step-1",
      "type": "browser_open",
      "name": "Abrir Google",
      "config": {
        "url": "https://www.google.com",
        "browser": "chrome"
      }
    },
    {
      "id": "step-2",
      "type": "ai_analyze",
      "name": "Analizar con IA",
      "config": {
        "prompt": "Analiza esta página",
        "model": "claude"
      }
    }
  ]
}
```

#### Opción B: Markdown

```markdown
# Mi Workflow

## Pasos

### 1. Abrir Google

**Tipo:** `browser_open`

**Configuración:**

\`\`\`json
{
  "url": "https://www.google.com",
  "browser": "chrome"
}
\`\`\`

### 2. Analizar con IA

**Tipo:** `ai_analyze`

**Configuración:**

\`\`\`json
{
  "prompt": "Analiza esta página",
  "model": "claude"
}
\`\`\`
```

#### Opción C: Mermaid

```markdown
\`\`\`mermaid
flowchart TD
    Start([Inicio])
    Step1[Abrir Google]
    Step2[Analizar con IA]
    End([Fin])

    Start --> Step1
    Step1 --> Step2
    Step2 --> End
\`\`\`
```

### Paso 2: Importar en Alqvimia

1. Abre **Alqvimia** en http://localhost:3000
2. Ve a la pestaña **"Workflows"**
3. Click en **"Importar"** (botón con ícono 📥)
4. Selecciona el **formato** de tu archivo (JSON, Markdown, Mermaid)
5. Click en **"Seleccionar Archivo"** y elige tu archivo
6. El sistema comenzará el análisis automático

### Paso 3: Análisis Automático

El sistema mostrará:

#### 📊 Análisis de Secuencia
```
✅ Pasos detectados: 11
✅ step 1: Abrir Google (browser_open)
✅ step 2: Analizar con IA (ai_analyze)
...
```

#### 🔧 Análisis de Componentes
```
✅ Componentes Existentes: 5
   - browser_open (web)
   - type (general)
   - click (web)
   - wait (ai)
   - screenshot (web)

❌ Componentes Faltantes: 6
   - extract_data (datos)
   - set_variable (variables)
   - ai_analyze (ai)
   - if_condition (lógica)
   - save_to_excel (datos)
   - send_email (ai)
```

#### 📂 Categorías
```
🌐 Web: 3
💾 Variables: 1
🔀 Lógica: 1
📊 Datos: 2
🤖 IA: 3
```

#### ✅ Validación de Viabilidad
```
✅ El workflow es VIABLE

⚠️ Advertencias:
- 6 componente(s) necesitan ser generados
```

### Paso 4: Generar Componentes Faltantes (Opcional)

Si hay componentes faltantes:

1. Click en **"Generar Componentes Faltantes con IA"**
2. Aparecerá un modal de progreso:
   ```
   [67%] 4 de 6 componentes
   Generando: if_condition
   ```
3. El sistema generará automáticamente:
   - ID del componente
   - Título formateado
   - Ícono según categoría
   - Propiedades específicas
   - Guardado en localStorage

### Paso 5: Revisar Resumen

El sistema mostrará dos vistas:

#### Vista Diagrama
Representación visual del flujo:
```
┌─────────────────────┐
│ 1. Abrir Google     │
│    browser_open     │
└─────────────────────┘
          ↓
┌─────────────────────┐
│ 2. Analizar con IA  │
│    ai_analyze       │
└─────────────────────┘
          ↓
         ...
```

#### Vista Listado
Detalles completos de cada paso:
```
🌐 1. Abrir Google [browser_open]
   Configuración:
   {
     "url": "https://www.google.com",
     "browser": "chrome"
   }

🤖 2. Analizar con IA [ai_analyze]
   Configuración:
   {
     "prompt": "Analiza esta página",
     "model": "claude"
   }
```

### Paso 6: Guardar Workflow

1. Revisa el resumen general:
   ```
   📌 Nombre: Mi Workflow
   📊 Total de pasos: 11
   ✅ Componentes existentes: 5
   🤖 Componentes generados: 6
   ✅ Estado: VIABLE
   ```

2. Click en **"Guardar Workflow Importado"**
3. El workflow se guardará automáticamente
4. Se cargará en el editor para edición
5. Aparecerá en la biblioteca de workflows

## 📋 Detalles Técnicos

### Formato JSON Esperado

```json
{
  "name": "Nombre del Workflow",
  "version": "1.0.0",
  "description": "Descripción opcional",
  "steps": [
    {
      "id": "identificador-único",
      "type": "tipo_de_componente",
      "name": "Nombre descriptivo",
      "config": {
        "parametro1": "valor1",
        "parametro2": "valor2"
      }
    }
  ]
}
```

### Campos Requeridos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del workflow |
| `steps` | array | Sí | Lista de pasos del workflow |
| `steps[].id` | string | No | Identificador único (se genera si falta) |
| `steps[].type` | string | Sí | Tipo de componente |
| `steps[].name` | string | No | Nombre descriptivo del paso |
| `steps[].config` | object | Sí | Configuración específica del componente |

### Propiedades Generadas por Categoría

#### 🌐 Web
```javascript
[
  { name: 'selector', label: 'Selector CSS', type: 'text', required: true },
  { name: 'waitTime', label: 'Tiempo de espera (ms)', type: 'number', default: 1000 }
]
```

#### 💾 Variables
```javascript
[
  { name: 'variableName', label: 'Nombre de variable', type: 'text', required: true },
  { name: 'value', label: 'Valor', type: 'text', required: false }
]
```

#### 🔀 Lógica
```javascript
[
  { name: 'condition', label: 'Condición', type: 'text', required: true },
  { name: 'action', label: 'Acción', type: 'select', options: ['continue', 'break', 'skip'] }
]
```

#### 📊 Datos
```javascript
[
  { name: 'source', label: 'Fuente de datos', type: 'text', required: true },
  { name: 'format', label: 'Formato', type: 'select', options: ['json', 'csv', 'xml'] }
]
```

#### 🤖 IA
```javascript
[
  { name: 'prompt', label: 'Prompt', type: 'textarea', required: true },
  { name: 'model', label: 'Modelo', type: 'select', options: ['gpt-4', 'claude', 'gemini'] }
]
```

## 🔍 Validaciones Automáticas

### 1. Validación de Estructura
- ✅ Todos los pasos tienen `type`
- ✅ Todos los pasos tienen `config`
- ✅ El workflow tiene al menos un paso

### 2. Validación de Secuencia
- ⚠️ Acciones web requieren `browser_open` antes
- ⚠️ Variables deben definirse antes de usarse
- ⚠️ Loops deben tener condición de salida

### 3. Validación de Viabilidad
- ✅ **Viable**: Sin problemas críticos
- ⚠️ **Viable con advertencias**: Funcional pero puede mejorarse
- ❌ **No viable**: Problemas críticos que impiden ejecución

## 🎨 Ejemplos de Uso

### Ejemplo 1: Workflow de Scraping Web

```json
{
  "name": "Scraping de Productos",
  "steps": [
    {
      "type": "browser_open",
      "name": "Abrir sitio",
      "config": { "url": "https://example.com" }
    },
    {
      "type": "extract_data",
      "name": "Extraer productos",
      "config": { "selector": ".product", "multiple": true }
    },
    {
      "type": "save_to_excel",
      "name": "Guardar en Excel",
      "config": { "filePath": "productos.xlsx" }
    }
  ]
}
```

**Resultado del análisis:**
- ✅ 1 componente existente (`browser_open`)
- ❌ 2 componentes faltantes (`extract_data`, `save_to_excel`)
- 🤖 Se generarán automáticamente con propiedades de la categoría Datos
- ✅ Workflow viable

### Ejemplo 2: Workflow con IA

```json
{
  "name": "Análisis Inteligente",
  "steps": [
    {
      "type": "set_variable",
      "name": "Cargar texto",
      "config": { "variableName": "texto", "value": "Contenido a analizar" }
    },
    {
      "type": "ai_analyze",
      "name": "Analizar con Claude",
      "config": { "prompt": "Resume este texto", "model": "claude" }
    },
    {
      "type": "if_condition",
      "name": "Verificar resultado",
      "config": { "condition": "${analysis} != null", "action": "continue" }
    }
  ]
}
```

**Resultado del análisis:**
- ❌ 3 componentes faltantes
- 📂 Categorías: Variables (1), IA (1), Lógica (1)
- 🤖 Generación automática con propiedades específicas por categoría
- ✅ Workflow viable

### Ejemplo 3: Importar desde Markdown

**Archivo:** `workflow.md`

```markdown
# Automatización de Email

## Descripción de Pasos

### 1. Abrir navegador

**Tipo:** `browser_open`

**Configuración:**

\`\`\`json
{
  "url": "https://mail.google.com",
  "browser": "chrome"
}
\`\`\`

### 2. Leer emails

**Tipo:** `extract_data`

**Configuración:**

\`\`\`json
{
  "selector": ".email-row",
  "multiple": true
}
\`\`\`

### 3. Analizar contenido

**Tipo:** `ai_analyze`

**Configuración:**

\`\`\`json
{
  "prompt": "Clasifica estos emails por urgencia",
  "model": "claude"
}
\`\`\`
```

**Proceso de importación:**
1. Selecciona formato "Markdown"
2. Carga el archivo `workflow.md`
3. El sistema extrae:
   - Nombre: "Automatización de Email"
   - 3 pasos con sus configuraciones JSON
4. Análisis detecta:
   - ✅ 1 existente (`browser_open`)
   - ❌ 2 faltantes (`extract_data`, `ai_analyze`)
5. Generación automática de componentes
6. Guardado exitoso

## 🛠️ Configuración Avanzada

### Personalizar Categorización

Puedes agregar palabras clave personalizadas para la categorización:

```javascript
// En workflow-importer.js, línea 341
inferCategory(type) {
    const customKeywords = {
        web: ['custom_click', 'mi_navegacion'],
        data: ['mi_extractor', 'custom_parser']
    };

    // Lógica de categorización...
}
```

### Agregar Propiedades Personalizadas

```javascript
// En workflow-importer.js, línea 602
generateProperties(type, category) {
    // Propiedades personalizadas para tipos específicos
    if (type === 'mi_componente_custom') {
        return [
            { name: 'propiedad1', label: 'Etiqueta', type: 'text' },
            { name: 'propiedad2', label: 'Número', type: 'number' }
        ];
    }

    // Lógica estándar...
}
```

## 📊 Estadísticas y Monitoreo

Durante la importación, el sistema muestra:

- **Progreso en tiempo real**: Porcentaje de componentes generados
- **Componente actual**: Qué componente se está generando
- **Tiempo estimado**: Basado en la cantidad de componentes faltantes
- **Resumen final**: Estadísticas completas del workflow importado

## 🐛 Solución de Problemas

### Error: "No se encontró un workflow válido"

**Causa:** El archivo no tiene la estructura esperada

**Solución:**
- Verifica que el JSON sea válido
- Asegúrate de tener un campo `steps` con al menos un paso
- Revisa que cada paso tenga `type` y `config`

### Error: "Componente no categorizable"

**Causa:** El tipo de componente no coincide con ninguna categoría

**Solución:**
- El componente se asignará automáticamente a "General"
- Puedes personalizar la categorización en el código

### Advertencia: "Se requiere abrir navegador primero"

**Causa:** Acciones web sin `browser_open` previo

**Solución:**
- El workflow sigue siendo viable
- Considera agregar un paso `browser_open` al inicio
- O ignora la advertencia si no aplica a tu caso

### Los componentes generados no aparecen

**Causa:** Error al guardar en localStorage

**Solución:**
- Limpia el localStorage: `localStorage.clear()`
- Recarga la página y vuelve a importar
- Verifica la consola del navegador para errores

## 📈 Mejoras Futuras

1. **Importación desde URLs**
   - Cargar workflows directamente desde GitHub
   - Sincronización automática con repositorios

2. **Validación avanzada**
   - Detección de dependencias circulares
   - Análisis de rendimiento estimado
   - Sugerencias de optimización

3. **Plantillas predefinidas**
   - Workflows de ejemplo por categoría
   - Templates industriales
   - Buenas prácticas incorporadas

4. **Migración de formatos**
   - Convertir entre Selenium, Puppeteer, Playwright
   - Importar desde UiPath, Automation Anywhere
   - Exportar a código Python/JavaScript

5. **Colaboración**
   - Compartir workflows con equipo
   - Control de versiones integrado
   - Comentarios y revisiones

## 🔐 Seguridad

- ✅ Validación de estructura antes de ejecutar
- ✅ Sanitización de nombres de archivos
- ✅ Componentes generados marcados como "generated"
- ✅ Verificación de tipos de datos
- ⚠️ No ejecutar workflows de fuentes no confiables sin revisar

## 📱 Responsive

El modal de importación es completamente responsive:

- ✅ Desktop: Ancho máximo 900px
- ✅ Tablet: Ajuste automático
- ✅ Mobile: Optimizado para pantallas pequeñas

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: soporte@alqvimia.com
- 📚 Documentación: https://docs.alqvimia.com
- 💬 Chat: https://chat.alqvimia.com
- 🐛 Issues: https://github.com/alqvimia/rpa/issues

---

**Creado con ❤️ por el equipo de Alqvimia**

*Versión 1.0.0 - Diciembre 2025*

## 🎯 Resumen Rápido

| Característica | Descripción |
|----------------|-------------|
| **Formatos** | JSON, Markdown, Mermaid |
| **Análisis** | 7 pasos automáticos |
| **Categorías** | Web, Variables, Lógica, Datos, IA, General |
| **Generación** | Automática con IA |
| **Validación** | Secuencia, estructura y viabilidad |
| **Vistas** | Diagrama y listado |
| **Guardado** | Automático al finalizar |

¡Importa workflows en segundos y deja que Alqvimia haga el trabajo pesado! 🚀
