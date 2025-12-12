# 🤖 Generador de Componentes - Guía Completa

Sistema completo para generar componentes personalizados para el sistema Alqvimia RPA de forma automática e interactiva.

---

## 📋 Contenido

- [Descripción](#descripción)
- [Archivos Incluidos](#archivos-incluidos)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Plantillas Predefinidas](#plantillas-predefinidas)
- [Ejemplos](#ejemplos)
- [Uso Programático](#uso-programático)
- [Estructura de Componentes](#estructura-de-componentes)

---

## 🎯 Descripción

El **Generador de Componentes** es una herramienta interactiva que permite crear componentes personalizados para el sistema RPA de forma rápida y sencilla. Incluye:

- ✅ Asistente interactivo por consola
- ✅ 14+ plantillas predefinidas
- ✅ Soporte para 8 tipos de propiedades
- ✅ Categorización automática
- ✅ Generación de IDs únicos
- ✅ Integración automática con el sistema
- ✅ Uso programático (API)

---

## 📦 Archivos Incluidos

### 1. `generar-componentes.js`

Script principal que proporciona un asistente interactivo para crear componentes paso a paso.

**Características:**
- Asistente guiado por preguntas
- Selección de categorías
- Configuración de propiedades
- Validación de datos
- Guardado automático

### 2. `plantillas-componentes.js`

Biblioteca de plantillas predefinidas para componentes comunes.

**Incluye plantillas para:**
- WhatsApp, Telegram, Email
- Excel (leer/escribir)
- APIs REST
- Base de datos
- Archivos
- Validaciones
- Y más...

---

## 🚀 Instalación

### Prerequisitos

- Node.js instalado (v12 o superior)
- Sistema Alqvimia RPA configurado

### Pasos

1. Los archivos ya están en tu proyecto en la raíz

2. Verifica que exista la carpeta `public/js/components/`
   ```bash
   mkdir -p public/js/components
   ```

3. ¡Listo para usar!

---

## 🎮 Uso Básico

### Modo Interactivo

Ejecuta el generador con el asistente interactivo:

```bash
node generar-componentes.js
```

Responde las preguntas:

1. **Nombre del componente**: Ej: "Validar RUT"
2. **Categoría**: Selecciona del 1 al 8
3. **Descripción**: Opcional
4. **Propiedades**: Agrega todas las que necesites
   - Nombre de la propiedad
   - Tipo (text, number, select, etc.)
   - Etiqueta visible
   - Si es requerida

### Usando Plantillas

Para crear componentes rápidamente desde plantillas:

```bash
node plantillas-componentes.js
```

O directamente con el nombre:

```bash
node plantillas-componentes.js whatsapp
node plantillas-componentes.js excel-leer
node plantillas-componentes.js api-rest
```

---

## 📚 Plantillas Predefinidas

### Comunicación (MCP)

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **WhatsApp** | `whatsapp` | Enviar mensajes vía WhatsApp |
| **Telegram** | `telegram` | Enviar mensajes vía Telegram Bot |
| **Email** | `email` | Enviar correos electrónicos |
| **API REST** | `api-rest` | Llamadas a APIs REST |

### Excel

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **Leer Excel** | `excel-leer` | Leer datos de archivos Excel |
| **Escribir Excel** | `excel-escribir` | Escribir datos en Excel |

### Archivos

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **Leer Archivo** | `archivo-leer` | Leer archivos de texto |
| **Escribir Archivo** | `archivo-escribir` | Escribir archivos de texto |

### Base de Datos

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **Query SQL** | `database-query` | Ejecutar consultas SQL |

### Web Automation

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **Navegar URL** | `web-navegacion` | Navegar a una página web |

### Utilidades

| Plantilla | Comando | Descripción |
|-----------|---------|-------------|
| **Validar Email** | `validar-email` | Validar formato de email |
| **Esperar** | `delay` | Pausar ejecución |
| **Log** | `log` | Registrar mensajes en log |

---

## 💡 Ejemplos

### Ejemplo 1: Crear componente personalizado

```bash
$ node generar-componentes.js

╔════════════════════════════════════════════════════════════════╗
║  🤖 GENERADOR DE COMPONENTES - Alqvimia RPA                    ║
╚════════════════════════════════════════════════════════════════╝

Este asistente te ayudará a crear un componente personalizado.

📝 INFORMACIÓN BÁSICA DEL COMPONENTE:

Nombre del componente: Validar RUT Chileno

📂 CATEGORÍAS DISPONIBLES:
  [1] fa-globe Web Automation
  [2] fa-window-maximize Windows
  [3] fa-file-excel Excel
  [4] fa-folder Files
  [5] fa-database Data Processing
  [6] fa-random Flow Control
  [7] fa-plug MCP Connectors
  [8] fa-cog Custom

Selecciona una categoría (1-8): 5

ID generado: data_validar_rut_chileno_abc123

Descripción (opcional): Valida si un RUT chileno es válido

⚙️  PROPIEDADES DEL COMPONENTE:

Nombre de la propiedad: rut

Tipos de propiedad:
  [1] Texto simple
  [2] Área de texto (multilínea)
  [3] Número
  [4] Contraseña (oculto)
  [5] Casilla de verificación
  [6] Texto o Variable
  [7] Lista desplegable
  [8] Fecha y hora

Tipo de propiedad (1-8): 1
Etiqueta (visible en UI): RUT
Placeholder (opcional): 12345678-9
¿Es requerida? (s/n): s

✓ Propiedad "rut" agregada

Nombre de la propiedad: [Enter para terminar]

═══════════════════════════════════════════════════════════
📋 RESUMEN DEL COMPONENTE:
═══════════════════════════════════════════════════════════

ID: data_validar_rut_chileno_abc123
Nombre: Validar RUT Chileno
Categoría: data
Icono: fa-database
Descripción: Valida si un RUT chileno es válido

Propiedades (2):
  1. rut (text)* - RUT
  2. resultVariable (text) - Variable de Resultado

¿Deseas guardar este componente? (s/n): s

✓ Componente guardado en: c:\AlqVimia\alqvimia-rpa\public\js\components\data_validar_rut_chileno_abc123.json
✓ Componente agregado a la lista de generados
```

### Ejemplo 2: Usar plantilla de WhatsApp

```bash
$ node plantillas-componentes.js whatsapp

╔════════════════════════════════════════════════════════════════╗
║  📦 PLANTILLAS DE COMPONENTES - Alqvimia RPA                   ║
╚════════════════════════════════════════════════════════════════╝

✓ Plantilla seleccionada: Enviar WhatsApp
Envía mensajes a través de WhatsApp Business API

¿Deseas personalizar el nombre? (s/n): n

Generando componente...

✓ ¡Componente creado exitosamente!

ID: mcp_enviar_whatsapp_xyz789
Título: Enviar WhatsApp
Categoría: mcp
Propiedades: 4
```

### Ejemplo 3: Listar todas las plantillas

```bash
$ node plantillas-componentes.js

╔════════════════════════════════════════════════════════════════╗
║  📦 PLANTILLAS DE COMPONENTES - Alqvimia RPA                   ║
╚════════════════════════════════════════════════════════════════╝

📋 PLANTILLAS DISPONIBLES:

MCP:
  whatsapp             fa-whatsapp Enviar WhatsApp
    Envía mensajes a través de WhatsApp Business API
  telegram             fa-telegram Enviar Telegram
    Envía mensajes a través de Telegram Bot API
  email                fa-envelope Enviar Email
    Envía correos electrónicos via SMTP
  api-rest             fa-exchange-alt Llamada API REST
    Realiza llamadas a APIs REST

EXCEL:
  excel-leer           fa-file-excel Leer Excel
    Lee datos de un archivo Excel
  excel-escribir       fa-file-excel Escribir Excel
    Escribe datos en un archivo Excel

[... más plantillas ...]

Selecciona una plantilla:
```

---

## 🔧 Uso Programático

Puedes usar el generador desde tu código JavaScript:

### Crear componente con código

```javascript
const GeneradorComponentes = require('./generar-componentes.js');

// Crear un componente programáticamente
const miComponente = GeneradorComponentes.crearComponenteProgramatico({
    title: 'Mi Componente Personalizado',
    category: 'custom',
    icon: 'fa-star',
    description: 'Hace algo increíble',
    properties: [
        {
            name: 'valor1',
            label: 'Valor 1',
            type: 'text',
            required: true,
            placeholder: 'Ingresa un valor'
        },
        {
            name: 'valor2',
            label: 'Valor 2',
            type: 'number',
            required: false
        }
    ]
});

console.log('Componente creado:', miComponente.id);
```

### Usar plantillas desde código

```javascript
const { PlantillasComponentes, plantillas } = require('./plantillas-componentes.js');

// Obtener una plantilla
const plantillaWhatsApp = PlantillasComponentes.obtenerPlantilla('whatsapp');

// Listar todas las plantillas
const todasLasPlantillas = PlantillasComponentes.listarPlantillas();
console.log('Plantillas disponibles:', todasLasPlantillas);

// Crear desde plantilla con modificaciones
const GeneradorComponentes = require('./generar-componentes.js');

const config = {
    ...plantillaWhatsApp,
    title: 'WhatsApp Personalizado',
    description: 'Mi versión personalizada'
};

const componente = GeneradorComponentes.crearComponenteProgramatico(config);
```

---

## 📊 Estructura de Componentes

### Formato JSON

Los componentes se guardan en formato JSON:

```json
{
  "id": "mcp_enviar_whatsapp_abc123",
  "title": "Enviar WhatsApp",
  "icon": "fa-whatsapp",
  "category": "mcp",
  "description": "Envía mensajes a través de WhatsApp Business API",
  "generatedAt": "2024-12-10T10:30:00.000Z",
  "properties": [
    {
      "name": "phoneNumber",
      "label": "Número de Teléfono",
      "type": "text",
      "required": true,
      "placeholder": "+5215512345678"
    },
    {
      "name": "message",
      "label": "Mensaje",
      "type": "textarea",
      "required": true,
      "placeholder": "Escribe tu mensaje aquí..."
    }
  ]
}
```

### Categorías Disponibles

| ID | Nombre | Icono | Prefijo |
|----|--------|-------|---------|
| `web` | Web Automation | fa-globe | `web_` |
| `windows` | Windows | fa-window-maximize | `windows_` |
| `excel` | Excel | fa-file-excel | `excel_` |
| `files` | Files | fa-folder | `files_` |
| `data` | Data Processing | fa-database | `data_` |
| `flow` | Flow Control | fa-random | `flow_` |
| `mcp` | MCP Connectors | fa-plug | `mcp_` |
| `custom` | Custom | fa-cog | `custom_` |

### Tipos de Propiedades

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `text` | Texto simple | Input de una línea |
| `textarea` | Área de texto | Input multilínea |
| `number` | Número | Input numérico |
| `password` | Contraseña | Input oculto |
| `checkbox` | Casilla | true/false |
| `text_or_variable` | Texto o Variable | Permite variables |
| `select` | Lista desplegable | Opciones predefinidas |
| `datetime-local` | Fecha y hora | Selector de fecha |

### Propiedades de una Property

```javascript
{
  name: 'nombrePropiedad',        // Nombre interno (camelCase)
  label: 'Etiqueta Visible',      // Texto que ve el usuario
  type: 'text',                   // Tipo de campo
  required: true,                 // ¿Es obligatorio?
  placeholder: 'Texto de ayuda',  // Placeholder opcional
  options: [                      // Solo para 'select'
    { value: 'val1', label: 'Opción 1' },
    { value: 'val2', label: 'Opción 2' }
  ]
}
```

---

## 📁 Ubicación de Archivos

Los componentes generados se guardan en:

```
public/js/components/
├── [id_componente].json           # Componente individual
└── generated-components.json      # Lista de todos los componentes
```

---

## 🔄 Integración con el Sistema

Los componentes generados se integran automáticamente con:

1. **Palette de Workflows**: Aparecen como componentes arrastrables
2. **MCPProperties**: Se registran para el grabador
3. **localStorage**: Se persisten entre sesiones

### Cargar componentes en tu aplicación

```javascript
// En tu HTML
<script src="/js/components/component-integrator.js"></script>

// Los componentes se cargarán automáticamente desde:
// /js/components/generated-components.json
```

---

## 🛠️ Scripts de Ayuda

### Crear archivo .bat para Windows

Crea `generar-componente.bat`:

```batch
@echo off
echo.
echo ========================================
echo   GENERADOR DE COMPONENTES - RPA
echo ========================================
echo.
node generar-componentes.js
pause
```

### Crear desde plantilla

Crea `crear-desde-plantilla.bat`:

```batch
@echo off
echo.
echo ========================================
echo   PLANTILLAS DE COMPONENTES - RPA
echo ========================================
echo.
node plantillas-componentes.js %1
pause
```

Uso:
```batch
crear-desde-plantilla.bat whatsapp
```

---

## 📝 Casos de Uso

### 1. Integración con API Externa

```bash
node plantillas-componentes.js api-rest
```

Personaliza para tu API específica.

### 2. Validación de Datos

```bash
node generar-componentes.js
# Crea un componente de validación personalizado
```

### 3. Automatización de Excel

```bash
node plantillas-componentes.js excel-leer
node plantillas-componentes.js excel-escribir
```

### 4. Sistema de Notificaciones

```bash
node plantillas-componentes.js whatsapp
node plantillas-componentes.js telegram
node plantillas-componentes.js email
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"

Asegúrate de estar en el directorio correcto:
```bash
cd c:\AlqVimia\alqvimia-rpa
```

### Los componentes no aparecen

1. Verifica que exista `public/js/components/generated-components.json`
2. Recarga la página del sistema
3. Revisa la consola del navegador

### Error al guardar

Verifica permisos de escritura en `public/js/components/`

---

## 🚀 Próximas Mejoras

- [ ] Interfaz web para el generador
- [ ] Importar/Exportar componentes
- [ ] Plantillas por industria (banca, retail, etc.)
- [ ] Generación de código funcional automático
- [ ] Versionado de componentes
- [ ] Marketplace de componentes

---

## 📄 Licencia

Parte del proyecto Alqvimia RPA.

---

## 💬 Soporte

Para dudas o problemas, consulta la documentación principal del proyecto.

---

**¡Disfruta creando componentes personalizados para tu sistema RPA!** 🎉
