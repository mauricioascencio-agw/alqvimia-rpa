# 🚀 INSTALACIÓN DE LA EXTENSIÓN CHROME - ELEMENT SPY RPA

## ✅ PASO 1: Crear los Iconos

Antes de cargar la extensión, necesitas crear 3 archivos de iconos PNG simples.

### Opción A: Usar Paint (Windows)
1. Abre Paint
2. Crear imagen de 128x128 píxeles con fondo morado/azul
3. Escribe "RPA" en el centro
4. Guardar como:
   - `icon128.png` (128x128 píxeles)
   - `icon48.png` (48x48 píxeles) - redimensionar
   - `icon16.png` (16x16 píxeles) - redimensionar

Guarda estos archivos en: `C:\Dev\aagw\OCR\chrome-extension\`

### Opción B: Descargar iconos genéricos
Puedes usar cualquier imagen PNG de 128x128, 48x48 y 16x16 píxeles temporalmente.

---

## ✅ PASO 2: Verificar Archivos

Asegúrate de que la carpeta `chrome-extension` tenga estos archivos:

```
chrome-extension/
├── manifest.json          ✅ Creado
├── background.js          ✅ Creado
├── content-script.js      ✅ Creado
├── injected-recorder.js   ✅ Creado
├── popup.html             ✅ Creado
├── popup.js               ✅ Creado
├── icon16.png             ⚠️ DEBES CREAR
├── icon48.png             ⚠️ DEBES CREAR
└── icon128.png            ⚠️ DEBES CREAR
```

---

## ✅ PASO 3: Cargar la Extensión en Chrome

### 3.1 Abrir Chrome Extensions
1. Abre **Google Chrome**
2. Escribe en la barra de direcciones: `chrome://extensions/`
3. Presiona **Enter**

### 3.2 Activar Modo Desarrollador
1. En la esquina superior derecha, activa el switch **"Modo de desarrollador"**
2. Deberían aparecer 3 botones nuevos: "Cargar extensión sin empaquetar", "Empaquetar extensión", "Actualizar"

### 3.3 Cargar la Extensión
1. Click en **"Cargar extensión sin empaquetar"**
2. Navega a: `C:\Dev\aagw\OCR\chrome-extension\`
3. Selecciona la carpeta `chrome-extension`
4. Click en **"Seleccionar carpeta"**

### 3.4 Verificar Carga Exitosa
Deberías ver la extensión en la lista:

```
┌─────────────────────────────────────────────┐
│ 🟢 Element Spy RPA Recorder                │
│                                             │
│ ID: [ID generado automáticamente]          │
│ Versión: 2.0.0                             │
│ Captura acciones de usuario para...        │
│                                             │
│ ✅ Habilitada                               │
└─────────────────────────────────────────────┘
```

---

## ✅ PASO 4: Probar la Extensión

### 4.1 Abrir el Popup
1. Haz click en el **icono de extensiones** (🧩) en la barra de Chrome
2. Busca **"Element Spy RPA Recorder"**
3. Click en el nombre para abrir el popup

### 4.2 Configurar Proyecto
En el popup deberías ver:

```
┌─────────────────────────────────────────────┐
│ 🎯 Element Spy RPA                         │
│ Extensión de Chrome v2.0                    │
├─────────────────────────────────────────────┤
│ 🔴 Detenido                                 │
├─────────────────────────────────────────────┤
│ 📁 Carpeta del Proyecto:                   │
│ [C:\Dev\aagw\OCR\workflows            ]    │
│                                             │
│ 📝 Nombre del Proyecto:                    │
│ [________________________]                  │
│                                             │
│ 🌐 Navegador:                              │
│ [Google Chrome (Extensión)        ▼]       │
│                                             │
│ ℹ️ Esta extensión funciona en CUALQUIER    │
│    sitio web, sin limitaciones de CSP.     │
│                                             │
│ [🎬 Iniciar Grabación]                     │
└─────────────────────────────────────────────┘
```

### 4.3 Iniciar Grabación
1. Ingresa nombre de proyecto: `TestGoogle`
2. Click **"🎬 Iniciar Grabación"**
3. Deberías ver:
   - Popup cambia a vista de estadísticas
   - Aparece indicador rojo "🎬 GRABANDO" en la esquina superior derecha de la página

### 4.4 Capturar Objetos
1. Mantén presionado **Ctrl** o **Shift**
2. Mueve el cursor sobre elementos - deberían resaltarse en azul
3. Haz **Ctrl+Click** en un elemento
4. Debería aparecer notificación verde: "✅ Objeto capturado: [nombre]"

### 4.5 Detener y Guardar
1. Click **"⏹️ Detener"** en el popup
2. Click **"💾 Guardar"**
3. Debería aparecer: "✅ Proyecto guardado en: C:\Dev\aagw\OCR\workflows\TestGoogle"

---

## ✅ PASO 5: Verificar Guardado

```bash
cd C:\Dev\aagw\OCR\workflows\TestGoogle
dir
```

Deberías ver:
```
TestGoogle/
├── config.json
├── main.json
├── objects/
├── logs/
│   ├── events.json
│   ├── events.log
│   └── summary.json
├── images/
└── screenshots/
```

---

## 🎯 PROBAR EN GOOGLE

La gran ventaja de la extensión es que **funciona en Google y otros sitios externos**:

1. Abre **google.com**
2. Abre el popup de la extensión
3. Inicia grabación: `ProyectoGoogle`
4. Haz **Ctrl+Click** en elementos (campo de búsqueda, botón "Buscar con Google", etc.)
5. Detener y guardar

**¡Debería funcionar perfectamente sin errores de CSP!** 🎉

---

## 🐛 TROUBLESHOOTING

### Problema 1: "Failed to load extension"
**Causa:** Faltan archivos de iconos

**Solución:**
1. Crea archivos PNG simples para los iconos
2. O comenta las líneas de iconos en `manifest.json` temporalmente:
```json
// "icons": {
//   "16": "icon16.png",
//   "48": "icon48.png",
//   "128": "icon128.png"
// },
```

### Problema 2: "Service worker registration failed"
**Causa:** Error en `background.js`

**Solución:**
1. Abre `chrome://extensions/`
2. Click en **"Errores"** de la extensión
3. Revisa el mensaje de error
4. Verifica que `background.js` esté correctamente guardado

### Problema 3: Popup no aparece
**Causa:** Error en `popup.html` o `popup.js`

**Solución:**
1. Click derecho en el icono de la extensión
2. **"Inspeccionar ventana emergente"**
3. Revisa errores en la consola

### Problema 4: No se capturan eventos
**Causa:** `content-script.js` no se está inyectando

**Solución:**
1. Abre la consola de la página (F12)
2. Busca: "🟢 Element Spy RPA - Content Script cargado"
3. Si no aparece, recarga la extensión:
   - `chrome://extensions/` → Click en botón **"Actualizar"** (🔄)
   - Recarga la página web

### Problema 5: Error al guardar
**Causa:** Servidor no está corriendo

**Solución:**
```bash
cd C:\Dev\aagw\OCR
npm start
```

Verifica que aparezca:
```
✅ Servidor RPA corriendo en http://localhost:3000
```

---

## 🔄 ACTUALIZAR LA EXTENSIÓN

Si haces cambios en el código:

1. Abre `chrome://extensions/`
2. Busca **"Element Spy RPA Recorder"**
3. Click en el botón **"Actualizar"** (🔄)
4. Recarga la página web donde estás probando

---

## 📋 VERIFICACIÓN FINAL

- [ ] Extensión aparece en `chrome://extensions/`
- [ ] Extensión está **habilitada**
- [ ] Popup se abre correctamente
- [ ] Servidor RPA corriendo en puerto 3000
- [ ] Indicador "🎬 GRABANDO" aparece al iniciar
- [ ] Elementos se resaltan con Ctrl+Click
- [ ] Notificaciones de captura aparecen
- [ ] Proyecto se guarda correctamente en disco

---

## 🎉 ¡LISTO!

Si todos los pasos anteriores funcionan, tu extensión está **100% operativa** y puedes:

✅ Grabar en **Google.com** sin problemas de CSP
✅ Grabar en **Facebook, Twitter, LinkedIn**
✅ Grabar en **cualquier sitio web**
✅ Capturar objetos con auto-relleno de propiedades
✅ Logs completos de todos los eventos

---

## 🆕 PRÓXIMOS PASOS (OPCIONAL)

### 1. Publicar en Chrome Web Store
- Empaquetar la extensión
- Crear cuenta de desarrollador ($5 USD)
- Subir a Chrome Web Store

### 2. Crear Extensión para Edge
- Copiar carpeta `chrome-extension` → `edge-extension`
- Cargar en `edge://extensions/`
- ¡Funciona igual!

### 3. Crear Extensión para Firefox
- Adaptar `manifest.json` a formato v2
- Cambiar `service_worker` a `background.scripts`
- Cargar en `about:debugging`

---

**Versión:** 2.0
**Fecha:** 2025-12-07
**Creado por:** Claude Code

¡Gracias por usar Element Spy RPA Tool!
