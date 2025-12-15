# CHANGELOG - Alqvimia RPA

> Registro de todos los cambios, mejoras y correcciones del sistema.
> **Formato**: [Fecha] - [Version] - [Descripcion]

---

## Como Usar Este Documento

Cada vez que se realice un cambio, agregar una entrada en la seccion correspondiente:

```markdown
### [YYYY-MM-DD] - vX.X.X

#### Agregado
- Nueva funcionalidad X

#### Modificado
- Cambio en funcionalidad Y

#### Corregido
- Bug Z solucionado

#### Archivos Afectados
- `archivo1.js` - Descripcion del cambio
- `archivo2.css` - Descripcion del cambio
```

---

## Versiones

### [2024-12-12] - v2.1.0

#### Agregado

**Videoconferencia**:
- Modal de configuracion de guardado antes de finalizar sesion
- Seleccion de formato de video: WebM o MP4
- Seleccion de ubicacion: Predeterminada o Personalizada
- File System Access API para selector de carpetas
- 16 stickers animados reemplazan emojis Unicode
- Stickers GIF de Google Noto Emoji

**Configuraciones**:
- Seccion completa de configuracion SMTP
- Campos editables para servidor, puerto, usuario, contrasena
- Boton "Probar Conexion SMTP"
- Guardado automatico con debouncing (500ms)

#### Modificado

**Frontend**:
- `video-conference.js`: Array `emojis` reemplazado por `stickers`
- `video-conference.js`: Funcion `loadEmojis()` ahora carga stickers
- `video-conference.js`: Nueva funcion `insertSticker()`
- `video-conference.js`: Nueva funcion `processStickerMarkers()`
- `video-conference-features.js`: Funcion `endSession()` ahora llama a `showSaveConfigModal()`
- `settings-manager.js`: Inputs cambiados de `onchange` a `oninput`
- `settings-manager.js`: Agregado atributo `disabled` dinamico

**Backend**:
- `video-conference-routes.js`: Corregido typo `createTransporter` -> `createTransport`

#### Corregido

| Bug | Archivo | Linea | Solucion |
|-----|---------|-------|----------|
| Campos SMTP no editables | settings-manager.js | 327-392 | Cambiado a `oninput` + `disabled` |
| `createTransporter is not a function` | video-conference-routes.js | 256 | Cambiado a `createTransport` |
| URL SMTP incorrecta | settings-manager.js | 1058 | `/api/videoconference` -> `/api/video-conference` |
| Emojis no funcionan | video-conference.js | 56-73 | Reemplazados por stickers GIF |

#### Archivos Afectados

```
Modificados:
- public/js/settings-manager.js (+50 lineas)
- public/js/video-conference.js (+80 lineas)
- public/js/video-conference-features.js (+200 lineas)
- server/video-conference-routes.js (1 linea corregida)
- public/index.html (+1 linea)

Creados:
- public/css/video-conference-save-config.css (120 lineas)
- documentacion/FRONTEND.md
- documentacion/BACKEND.md
- documentacion/BASE_DE_DATOS.md
- documentacion/CHANGELOG.md
```

---

### [2024-12-11] - v2.0.0

#### Agregado

**Videoconferencia v2.0**:
- Sistema completo de videoconferencia
- Panel AS-IS / TO-BE
- Generador de minutas con IA
- Barra de progreso de 8 pasos
- Modal de confirmacion exitosa
- Selector de proyecto/workflow
- Avatares de participantes
- Filtros de video (desenfoque, sepia, etc.)
- Chat en tiempo real
- Notas de sesion
- Grabacion de video

**Omnicanalidad**:
- Interfaz de gestion omnicanal
- Integracion con multiples canales

#### Archivos Creados

```
- public/js/video-conference.js
- public/js/video-conference-features.js
- public/css/video-conference.css
- server/video-conference-routes.js
```

---

### [2024-12-10] - v1.5.0

#### Agregado

- Generador de componentes
- Sistema de categorias de workflows
- Mejoras en editor visual
- Variables globales

---

### [2024-12-01] - v1.0.0

#### Lanzamiento Inicial

- Sistema RPA base
- Grabador de acciones
- Editor de workflows
- Ejecutor de workflows
- Extension Chrome
- Extension Firefox
- Conectores MCP
- Dashboard de IA

---

## Plantilla para Nuevas Entradas

```markdown
### [YYYY-MM-DD] - vX.X.X

#### Agregado
-

#### Modificado
-

#### Corregido
-

#### Eliminado
-

#### Archivos Afectados
- `archivo.js` - Descripcion
```

---

## Convenciones

### Tipos de Cambios

| Tipo | Descripcion | Ejemplo |
|------|-------------|---------|
| **Agregado** | Nueva funcionalidad | "Nuevo boton de exportar" |
| **Modificado** | Cambio en existente | "Mejorado rendimiento de X" |
| **Corregido** | Bug fix | "Corregido error en login" |
| **Eliminado** | Funcionalidad removida | "Eliminado soporte para IE11" |
| **Deprecado** | Marcado para eliminar | "Funcion X sera eliminada en v3.0" |
| **Seguridad** | Fix de seguridad | "Corregida vulnerabilidad XSS" |

### Versionado Semantico

- **MAJOR** (X.0.0): Cambios incompatibles
- **MINOR** (0.X.0): Nueva funcionalidad compatible
- **PATCH** (0.0.X): Correcciones de bugs

---

> **Importante**: Actualizar este documento con CADA cambio realizado. Incluir fecha, version, descripcion y archivos afectados.
