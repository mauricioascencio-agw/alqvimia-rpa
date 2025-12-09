# 🚀 INICIO RÁPIDO - EXTENSIÓN CHROME

## ⏱️ 5 MINUTOS PARA EMPEZAR

---

## PASO 1: Crear Iconos (2 minutos)

### Opción A - Generador Automático (RECOMENDADO):

1. Abre en tu navegador:
   ```
   C:\Dev\aagw\OCR\chrome-extension\crear-iconos.html
   ```

2. Verás 3 iconos morados con "RPA"

3. Haz click en cada botón:
   - **"📥 Descargar 128x128"** → Guardar como `icon128.png`
   - **"📥 Descargar 48x48"** → Guardar como `icon48.png`
   - **"📥 Descargar 16x16"** → Guardar como `icon16.png`

4. Guarda los 3 archivos en:
   ```
   C:\Dev\aagw\OCR\chrome-extension\
   ```

### Opción B - Paint (Si Opción A no funciona):

1. Abre Paint
2. Crear nueva imagen: 128x128 píxeles
3. Fondo azul/morado, escribir "RPA" en blanco
4. Guardar como `icon128.png` en `chrome-extension\`
5. Redimensionar a 48x48 → Guardar como `icon48.png`
6. Redimensionar a 16x16 → Guardar como `icon16.png`

---

## PASO 2: Cargar Extensión (1 minuto)

1. Abre **Google Chrome**

2. Escribe en la barra de direcciones:
   ```
   chrome://extensions/
   ```

3. Activa el switch **"Modo de desarrollador"** (esquina superior derecha)

4. Click en **"Cargar extensión sin empaquetar"**

5. Navega y selecciona la carpeta:
   ```
   C:\Dev\aagw\OCR\chrome-extension\
   ```

6. Click **"Seleccionar carpeta"**

7. ✅ Deberías ver la extensión en la lista:
   ```
   🟢 Element Spy RPA Recorder
   ID: [generado automáticamente]
   Versión: 2.0.0
   ✅ Habilitada
   ```

---

## PASO 3: Iniciar Servidor (30 segundos)

Abre una terminal y ejecuta:

```bash
cd C:\Dev\aagw\OCR
npm start
```

Verifica que aparezca:
```
✅ Servidor RPA corriendo en http://localhost:3000
```

**IMPORTANTE:** Deja esta ventana abierta mientras usas la extensión.

---

## PASO 4: Probar en Google (1 minuto)

1. Abre una nueva pestaña en Chrome

2. Navega a:
   ```
   https://www.google.com
   ```

3. Haz click en el **icono de extensiones** (🧩) en la barra de Chrome

4. Busca **"Element Spy RPA Recorder"** y ábrelo

5. En el popup, configura:
   - **Carpeta:** `C:\Dev\aagw\OCR\workflows` (ya está pre-llenado)
   - **Nombre:** `TestGoogle`
   - **Navegador:** `Google Chrome (Extensión)` (ya seleccionado)

6. Click **"🎬 Iniciar Grabación"**

7. Deberías ver:
   - ✅ Indicador rojo **"🎬 GRABANDO"** en la esquina superior derecha de Google
   - ✅ Popup cambia a vista de estadísticas

---

## PASO 5: Capturar Objeto (30 segundos)

1. Mantén presionado la tecla **Ctrl**

2. Mueve el cursor sobre el **campo de búsqueda de Google**
   - Debería resaltarse con un **borde azul**

3. Haz **Ctrl+Click** en el campo de búsqueda

4. Debería aparecer una notificación verde:
   ```
   ✅ Objeto capturado: txtSearch
   ```

5. Las estadísticas en el popup deberían actualizar:
   ```
   Eventos capturados: 5+
   Objetos capturados: 1
   ```

---

## PASO 6: Guardar Proyecto (30 segundos)

1. En el popup de la extensión, click **"⏹️ Detener"**

2. Click **"💾 Guardar"**

3. Debería aparecer:
   ```
   ✅ Proyecto guardado en: C:\Dev\aagw\OCR\workflows\TestGoogle
   ```

---

## PASO 7: Verificar Archivos (30 segundos)

Abre el explorador de archivos y navega a:
```
C:\Dev\aagw\OCR\workflows\TestGoogle
```

Deberías ver:
```
TestGoogle/
├── config.json          ✅
├── main.json            ✅
├── objects/             ✅
│   └── txtSearch.json   ✅ (Con propiedades auto-rellenadas)
├── logs/                ✅
│   ├── events.json      ✅
│   ├── events.log       ✅
│   └── summary.json     ✅
├── images/              ✅
└── screenshots/         ✅
```

---

## PASO 8: Ver Propiedades Auto-Rellenadas

Abre el archivo:
```
C:\Dev\aagw\OCR\workflows\TestGoogle\objects\txtSearch.json
```

Deberías ver algo como:
```json
{
  "objectNumber": 1,
  "sequenceId": "OBJ_001",
  "varName": "txtSearch",
  "selector": "#APjFqb",
  "type": "input",
  "properties": {
    "id": "APjFqb",
    "name": "q",
    "type": "text",
    "class": "gLFyf",
    "title": "Buscar",
    "role": "combobox",
    "aria-label": "Buscar",
    "autocomplete": "off",
    "width": "561px",
    "height": "44px"
  },
  "captured": "2025-12-07T23:45:00.000Z",
  "orderInFlow": 1
}
```

**¡TODAS las propiedades fueron AUTO-RELLENADAS!** 🎉

---

## ✅ ¡FELICITACIONES!

Si llegaste hasta aquí, tu extensión está **100% funcional** y puedes:

- ✅ Grabar acciones en **Google.com** (sin problemas de CSP)
- ✅ Grabar en **cualquier sitio web**
- ✅ Auto-relleno de propiedades HTML
- ✅ Logs completos de eventos
- ✅ Proyectos guardados profesionalmente

---

## 🎯 PRÓXIMOS PASOS

### Probar en Otros Sitios:

1. **Facebook:**
   ```
   https://www.facebook.com
   Proyecto: "TestFacebook"
   Capturar: campo de email, botón de login
   ```

2. **Twitter:**
   ```
   https://www.twitter.com
   Proyecto: "TestTwitter"
   Capturar: campo de búsqueda, botones
   ```

3. **Tu propia aplicación:**
   ```
   http://localhost:8080
   Proyecto: "MiApp"
   Capturar: formularios, botones, etc.
   ```

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Problema: Extensión no aparece
**Solución:**
1. Verifica que los 3 archivos `icon*.png` existan
2. Recarga la extensión: `chrome://extensions/` → Click en 🔄

### Problema: No se resaltan elementos
**Solución:**
1. Presiona F12 en la página
2. Busca en consola: "🟢 Element Spy RPA - Content Script cargado"
3. Si no aparece, recarga la página (F5)

### Problema: Error al guardar
**Solución:**
1. Verifica que el servidor esté corriendo: `npm start`
2. Verifica en consola (F12) el error específico

### Problema: Popup no se abre
**Solución:**
1. Click derecho en icono de extensión
2. "Inspeccionar ventana emergente"
3. Revisar errores en consola

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más información:

1. **[EXTENSION_CHROME_CREADA.md](EXTENSION_CHROME_CREADA.md)** - Resumen completo de la extensión
2. **[chrome-extension/INSTALACION.md](chrome-extension/INSTALACION.md)** - Guía detallada paso a paso
3. **[chrome-extension/README.md](chrome-extension/README.md)** - Documentación técnica
4. **[RESUMEN_COMPLETO_V2.md](RESUMEN_COMPLETO_V2.md)** - Resumen de todas las mejoras

---

## 🎉 ¡LISTO PARA AUTOMATIZAR!

Ahora tienes una **herramienta RPA profesional** que:

- ✅ Funciona en CUALQUIER sitio web
- ✅ Auto-rellena propiedades
- ✅ Guarda logs completos
- ✅ Es 100% gratis y código abierto

**¡Empieza a automatizar tus tareas!** 🤖

---

**Tiempo total:** ~5 minutos
**Dificultad:** Muy fácil ⭐
**Resultado:** Extensión funcional al 100% ✅

**Versión:** 2.0
**Fecha:** 2025-12-07
