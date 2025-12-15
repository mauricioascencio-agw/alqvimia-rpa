# 📄 Sistema Avanzado de Exportación de Workflows

## 🎯 Descripción General

El sistema de exportación de workflows de **Alqvimia** permite guardar tus flujos de automatización en múltiples formatos con análisis inteligente de componentes.

## ✨ Características Principales

### 1. **Múltiples Formatos de Exportación**

- **📄 JSON**: Formato estándar para workflows, ideal para integración
- **🔷 Mermaid Chart**: Diagramas de flujo visuales automáticos
- **📝 Markdown (.md)**: Documentación estructurada legible
- **📘 Word (.docx)**: Documentos profesionales (requiere conversión)
- **📕 PDF**: Archivos portables para compartir (requiere conversión)

### 2. **Análisis Inteligente de Componentes**

El sistema analiza automáticamente tu workflow y:

✅ **Identifica componentes existentes**: Verifica qué componentes ya están definidos en el sistema

❌ **Detecta componentes faltantes**: Encuentra componentes que necesitan ser creados

🤖 **Genera componentes automáticamente**: Usa IA para crear definiciones de componentes faltantes

### 3. **Flujo de Trabajo Intuitivo**

```
1. Diseñas tu workflow
2. Click en "Guardar Como..."
3. Seleccionas el formato deseado
4. El sistema analiza los componentes
5. Opcionalmente, genera componentes faltantes
6. Seleccionas la carpeta destino
7. ¡Archivo guardado!
```

## 🚀 Cómo Usar

### Paso 1: Crear un Workflow

1. Abre **Alqvimia** en http://localhost:3000
2. Ve a la vista **"Workflows"**
3. Arrastra y suelta componentes para crear tu flujo
4. Dale un nombre a tu workflow

### Paso 2: Exportar con Formato

1. Click en **"Guardar Como..."** (botón verde con gradiente)
2. Selecciona el **formato de salida** del combo:
   - JSON
   - Mermaid Chart
   - Markdown
   - Word
   - PDF

### Paso 3: Revisar Análisis de Componentes

El sistema mostrará:

#### ✅ Componentes Existentes
```
✓ Componentes que ya están definidos en el sistema
✓ Puedes usar estos componentes sin problemas
```

#### ❌ Componentes No Encontrados
```
! Componentes que faltan en el sistema
! Opción para generarlos automáticamente con IA
```

#### 📊 Resumen del Workflow
```
• Total de pasos
• Componentes únicos
• Formato seleccionado
```

### Paso 4: Generar Componentes Faltantes (Opcional)

Si hay componentes faltantes:

1. Click en **"Generar Componentes Faltantes con IA"**
2. El sistema crea automáticamente las definiciones
3. Los componentes se guardan en `localStorage`
4. El análisis se actualiza automáticamente

### Paso 5: Seleccionar Carpeta

1. Click en **"Seleccionar Carpeta y Guardar"**
2. Ingresa la ruta donde quieres guardar:
   ```
   Ejemplo: C:\Proyectos\Workflows\MiWorkflow
   ```
3. Click en **"Confirmar"**

### Paso 6: Verificar Archivo Generado

El sistema creará la carpeta y guardará el archivo en el formato seleccionado.

## 📋 Formatos de Salida

### 1. JSON (.json)

**Contenido:**
```json
{
  "name": "Mi Workflow",
  "version": "1.0.0",
  "created": "2025-12-13T10:30:00.000Z",
  "steps": [
    {
      "type": "click",
      "name": "Click en botón",
      "config": {
        "selector": "#submit-btn"
      }
    }
  ]
}
```

**Ideal para:**
- ✅ Versionamiento en Git
- ✅ Integración con APIs
- ✅ Importación/exportación

### 2. Mermaid Chart (.md)

**Contenido:**
```markdown
\`\`\`mermaid
flowchart TD
    Start([Inicio])
    Step1[Click en botón]
    Step2[Escribir texto]
    End([Fin])

    Start --> Step1
    Step1 --> Step2
    Step2 --> End
\`\`\`
```

**Ideal para:**
- ✅ Documentación visual
- ✅ Presentaciones
- ✅ GitHub/GitLab README

### 3. Markdown (.md)

**Contenido:**
```markdown
# Mi Workflow

**Creado:** 13/12/2025 10:30:00
**Total de pasos:** 3

---

## Diagrama de Flujo

[Diagrama Mermaid aquí]

---

## Descripción de Pasos

### 1. Click en botón
**Tipo:** `click`
**Configuración:**
\`\`\`json
{
  "selector": "#submit-btn"
}
\`\`\`
```

**Ideal para:**
- ✅ Documentación completa
- ✅ Wikis y bases de conocimiento
- ✅ Revisión y aprobación

### 4. Word (.docx)

**Contenido:**
- Encabezado con nombre y fecha
- Lista de pasos numerados
- Configuración de cada paso
- Formato profesional

**Ideal para:**
- ✅ Reportes ejecutivos
- ✅ Documentación formal
- ✅ Archivos corporativos

### 5. PDF (.pdf)

**Contenido:**
- Documento portátil con diagrama
- Descripción detallada de pasos
- Marca de agua Alqvimia

**Ideal para:**
- ✅ Archivado permanente
- ✅ Compartir con clientes
- ✅ Auditorías

## 🛠️ Endpoints del Servidor

### Guardar Archivo

**POST** `/api/save-workflow-file`

```javascript
{
  "folderPath": "C:\\Proyectos\\Workflows",
  "fileName": "MiWorkflow.json",
  "content": "{ ... }",
  "format": "json"
}
```

**Respuesta:**
```javascript
{
  "success": true,
  "fullPath": "C:\\Proyectos\\Workflows\\MiWorkflow.json",
  "format": "json",
  "message": "Archivo MiWorkflow.json guardado exitosamente"
}
```

### Generar Word

**POST** `/api/generate-workflow-word`

```javascript
{
  "folderPath": "C:\\Proyectos\\Workflows",
  "fileName": "MiWorkflow.docx",
  "workflow": {
    "name": "Mi Workflow",
    "steps": [ ... ]
  }
}
```

### Generar PDF

**POST** `/api/generate-workflow-pdf`

```javascript
{
  "folderPath": "C:\\Proyectos\\Workflows",
  "fileName": "MiWorkflow.pdf",
  "workflow": {
    "name": "Mi Workflow",
    "steps": [ ... ],
    "mermaidDiagram": "..."
  }
}
```

## 🔧 Configuración Técnica

### Archivos Involucrados

1. **Frontend:**
   - `public/js/workflow-exporter.js` - Lógica de exportación
   - `public/index.html` - Modal de exportación (líneas 1843-1883)

2. **Backend:**
   - `server/index.js` - Endpoints de guardado (líneas 1071-1210)

3. **Estilos:**
   - Usa clases CSS existentes de Alqvimia
   - Modal responsive y accesible

### Dependencias

**Actuales:**
- ✅ Express.js
- ✅ fs/promises
- ✅ path

**Futuras (para mejoras):**
- 📦 `docx` - Generación real de archivos Word
- 📦 `puppeteer` - Conversión HTML a PDF
- 📦 `pdfkit` - Generación nativa de PDF

## 🎨 Personalización

### Agregar Nuevo Formato

1. **Añadir opción en el combo:**
```html
<option value="mi_formato">🎨 Mi Formato</option>
```

2. **Añadir descripción:**
```javascript
const descriptions = {
    // ...
    mi_formato: 'Descripción de mi formato personalizado'
};
```

3. **Crear generador:**
```javascript
generateMiFormato() {
    let content = '...';
    // Tu lógica aquí
    return content;
}
```

4. **Añadir caso en switch:**
```javascript
case 'mi_formato':
    fileContent = this.generateMiFormato();
    fileName = `${workflowName}.ext`;
    mimeType = 'application/mi-formato';
    break;
```

## 📊 Análisis de Componentes

### Cómo Funciona

```javascript
// 1. Recopilar componentes usados
const usedComponents = new Set();
workflow.forEach(action => {
    usedComponents.add(action.type);
});

// 2. Verificar existencia
usedComponents.forEach(compType => {
    // Buscar en MCPProperties
    if (MCPProperties[compType]) {
        existingComponents.push(compType);
    }
    // Buscar en localStorage
    else if (localStorage.getItem('generated_components')) {
        // ...
    }
    // No encontrado
    else {
        missingComponents.push(compType);
    }
});

// 3. Generar faltantes (opcional)
missingComponents.forEach(comp => {
    generateComponent(comp);
});
```

### Generación Automática

Cuando generas componentes faltantes:

1. Se crea una definición básica
2. Se incluyen propiedades comunes
3. Se guarda en `localStorage`
4. Se marca como "Generated"

## 🔐 Seguridad

- ✅ Validación de rutas de archivo
- ✅ Sanitización de nombres de archivo
- ✅ Creación segura de carpetas
- ✅ Manejo de errores robusto

## 📱 Responsive

El modal de exportación es completamente responsive:

- ✅ Desktop: 600px ancho máximo
- ✅ Tablet: Se ajusta automáticamente
- ✅ Mobile: Ocupa el 90% del ancho

## 🐛 Solución de Problemas

### "No hay workflow para exportar"
**Causa:** No has creado ningún paso en el workflow
**Solución:** Arrastra al menos un componente al área de trabajo

### "Error: Faltan parámetros requeridos"
**Causa:** Datos incompletos enviados al servidor
**Solución:** Verifica que el workflow tenga nombre y pasos

### "Error guardando archivo"
**Causa:** Permisos de carpeta o ruta inválida
**Solución:**
- Verifica que la ruta existe
- Comprueba permisos de escritura
- Usa rutas absolutas (C:\...)

### Componentes no se generan
**Causa:** ComponentGenerator no está disponible
**Solución:** Verifica que el script esté cargado en index.html

## 📈 Mejoras Futuras

1. **Exportación a la nube:**
   - Google Drive
   - Dropbox
   - OneDrive

2. **Formatos adicionales:**
   - Excel (.xlsx)
   - PowerPoint (.pptx)
   - HTML interactivo

3. **Plantillas personalizadas:**
   - Estilos corporativos
   - Logos y marca de agua
   - Temas de color

4. **Colaboración:**
   - Compartir enlaces
   - Comentarios en línea
   - Control de versiones

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: soporte@alqvimia.com
- 📚 Documentación: https://docs.alqvimia.com
- 💬 Chat: https://chat.alqvimia.com

---

**Creado con ❤️ por el equipo de Alqvimia**

*Versión 1.0.0 - Diciembre 2025*
