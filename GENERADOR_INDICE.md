# 📑 Índice del Generador de Componentes

Sistema completo para crear componentes personalizados en Alqvimia RPA.

---

## 📂 Archivos del Sistema

### 🔧 Scripts Principales

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| [generar-componentes.js](generar-componentes.js) | 16 KB | Script principal con asistente interactivo |
| [plantillas-componentes.js](plantillas-componentes.js) | 19 KB | Biblioteca de 14+ plantillas predefinidas |

### 📝 Documentación

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| [GENERADOR_COMPONENTES_INICIO_RAPIDO.md](GENERADOR_COMPONENTES_INICIO_RAPIDO.md) | 4.2 KB | ⚡ **EMPIEZA AQUÍ** - Guía rápida de 5 minutos |
| [GENERADOR_COMPONENTES_GUIA.md](GENERADOR_COMPONENTES_GUIA.md) | 15 KB | Guía completa con ejemplos detallados |
| [GENERADOR-COMPONENTES-README.md](GENERADOR-COMPONENTES-README.md) | 12 KB | Documentación técnica del sistema IA |

### ⚡ Archivos de Acceso Rápido (Windows)

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| [crear-componentes-rapido.bat](crear-componentes-rapido.bat) | 3.4 KB | 🌟 **RECOMENDADO** - Menú interactivo |
| [generar-componente.bat](generar-componente.bat) | 778 B | Asistente completo |
| [crear-desde-plantilla.bat](crear-desde-plantilla.bat) | 925 B | Crear desde plantilla específica |

---

## 🚀 Inicio Rápido

### Para Principiantes

1. **Doble clic** en: [crear-componentes-rapido.bat](crear-componentes-rapido.bat)
2. Selecciona un número del menú
3. ¡Listo!

### Para Usuarios Avanzados

```bash
# Ver plantillas disponibles
node plantillas-componentes.js

# Crear desde plantilla
node plantillas-componentes.js whatsapp

# Crear personalizado
node generar-componentes.js
```

---

## 📚 Guías por Nivel

### 🟢 Nivel Básico

**Lee primero:**
- [GENERADOR_COMPONENTES_INICIO_RAPIDO.md](GENERADOR_COMPONENTES_INICIO_RAPIDO.md)

**Usa:**
- [crear-componentes-rapido.bat](crear-componentes-rapido.bat)

**Tiempo estimado:** 5 minutos

### 🟡 Nivel Intermedio

**Lee primero:**
- [GENERADOR_COMPONENTES_GUIA.md](GENERADOR_COMPONENTES_GUIA.md)

**Usa:**
- [generar-componente.bat](generar-componente.bat)
- [crear-desde-plantilla.bat](crear-desde-plantilla.bat)

**Tiempo estimado:** 15 minutos

### 🔴 Nivel Avanzado

**Lee primero:**
- [GENERADOR-COMPONENTES-README.md](GENERADOR-COMPONENTES-README.md)
- [GENERADOR_COMPONENTES_GUIA.md](GENERADOR_COMPONENTES_GUIA.md)

**Usa:**
- Scripts JS directamente
- API programática
- Personalización de código

**Tiempo estimado:** 30+ minutos

---

## 🎯 Por Caso de Uso

### Quiero crear un componente de WhatsApp

```batch
# Opción 1: Menú rápido
crear-componentes-rapido.bat
# Selecciona [1]

# Opción 2: Directamente
crear-desde-plantilla.bat whatsapp
```

### Quiero crear un componente personalizado

```batch
# Windows
generar-componente.bat

# O línea de comandos
node generar-componentes.js
```

### Quiero ver todas las plantillas

```batch
# Windows
crear-desde-plantilla.bat

# O línea de comandos
node plantillas-componentes.js
```

### Quiero usar el generador en mi código

```javascript
const GeneradorComponentes = require('./generar-componentes.js');

const componente = GeneradorComponentes.crearComponenteProgramatico({
    title: 'Mi Componente',
    category: 'custom',
    properties: [...]
});
```

**Ver:** [GENERADOR_COMPONENTES_GUIA.md#uso-programático](GENERADOR_COMPONENTES_GUIA.md#-uso-programático)

---

## 📦 Plantillas Disponibles (14+)

### Comunicación (4)
- ✉️ WhatsApp - `whatsapp`
- 📱 Telegram - `telegram`
- 📧 Email - `email`
- 🔌 API REST - `api-rest`

### Excel (2)
- 📊 Leer - `excel-leer`
- ✏️ Escribir - `excel-escribir`

### Archivos (2)
- 📖 Leer - `archivo-leer`
- 📝 Escribir - `archivo-escribir`

### Base de Datos (1)
- 🗄️ Query SQL - `database-query`

### Web (1)
- 🌐 Navegar - `web-navegacion`

### Utilidades (4)
- ✅ Validar Email - `validar-email`
- ⏱️ Esperar - `delay`
- 📋 Log - `log`

**Ver todas:** [GENERADOR_COMPONENTES_GUIA.md#plantillas](GENERADOR_COMPONENTES_GUIA.md#-plantillas-predefinidas)

---

## 🛠️ Flujo de Trabajo

```
┌─────────────────────────────────────┐
│  ¿Qué tipo de componente necesitas? │
└────────────┬────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
   ¿Existe       ¿Es muy
   plantilla?    específico?
      │             │
      SÍ            NO
      │             │
      ▼             ▼
  [Plantilla]  [Asistente]
      │             │
      └──────┬──────┘
             │
      [Generador crea
       componente JSON]
             │
      [Se guarda en
       public/js/components/]
             │
      [Aparece en
       palette del sistema]
             │
      [¡Listo para usar!]
```

---

## 📊 Estructura de Archivos

```
alqvimia-rpa/
│
├── 🔧 Scripts de Generación
│   ├── generar-componentes.js          # Script principal
│   └── plantillas-componentes.js       # Plantillas
│
├── ⚡ Accesos Rápidos (Windows)
│   ├── crear-componentes-rapido.bat    # Menú interactivo
│   ├── generar-componente.bat          # Asistente completo
│   └── crear-desde-plantilla.bat       # Desde plantilla
│
├── 📚 Documentación
│   ├── GENERADOR_INDICE.md             # Este archivo
│   ├── GENERADOR_COMPONENTES_INICIO_RAPIDO.md
│   ├── GENERADOR_COMPONENTES_GUIA.md
│   └── GENERADOR-COMPONENTES-README.md
│
└── 📦 Componentes Generados
    └── public/js/components/
        ├── [componente1].json
        ├── [componente2].json
        └── generated-components.json
```

---

## ❓ FAQ Rápido

### ¿Cómo empiezo?

Doble clic en [crear-componentes-rapido.bat](crear-componentes-rapido.bat)

### ¿Dónde se guardan los componentes?

En `public/js/components/`

### ¿Cómo uso un componente creado?

1. Recarga la interfaz del sistema RPA
2. Busca el componente en el palette
3. Arrastra y suelta en tu workflow

### ¿Puedo editar un componente después?

Sí, edita el archivo JSON en `public/js/components/`

### ¿Cómo borro un componente?

Elimina su archivo JSON de `public/js/components/` y actualiza `generated-components.json`

### ¿Funciona en Linux/Mac?

Sí! Usa los comandos `node` directamente (los .bat son solo para Windows)

---

## 🔗 Enlaces Rápidos

### Empezar

- [Inicio Rápido](GENERADOR_COMPONENTES_INICIO_RAPIDO.md)
- [Menú Interactivo](crear-componentes-rapido.bat)

### Aprender

- [Guía Completa](GENERADOR_COMPONENTES_GUIA.md)
- [Documentación Técnica](GENERADOR-COMPONENTES-README.md)

### Usar

- [Scripts](generar-componentes.js)
- [Plantillas](plantillas-componentes.js)

### Referencia

- [Instalación del Sistema](INSTALACION_RAPIDA_OMNICANALIDAD.md)
- [Omnicanalidad](OMNICANALIDAD_README.md)
- [README Principal](README.md)

---

## ✅ Checklist de Verificación

Antes de usar el generador:

- [ ] Node.js instalado (v12+)
- [ ] En directorio correcto (`c:\AlqVimia\alqvimia-rpa`)
- [ ] Carpeta `public/js/components/` existe
- [ ] Sistema RPA instalado y funcionando

---

## 📞 Soporte

### Problemas Comunes

Ver sección "Solución de Problemas" en:
- [Inicio Rápido](GENERADOR_COMPONENTES_INICIO_RAPIDO.md#-problemas-comunes)
- [Guía Completa](GENERADOR_COMPONENTES_GUIA.md#-solución-de-problemas)

### Más Ayuda

Consulta la documentación principal del proyecto.

---

## 🎉 ¡Comienza Ahora!

**Opción más rápida:**

```
Doble clic → crear-componentes-rapido.bat
```

**O desde terminal:**

```bash
node plantillas-componentes.js
```

---

**Actualizado:** Diciembre 2024
**Versión:** 1.0
**Parte de:** Alqvimia RPA System
