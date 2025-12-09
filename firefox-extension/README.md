# 🦊 Element Spy RPA - Extensión para Firefox

## 📦 Instalación en Firefox

### Opción 1: Instalación Temporal (Desarrollo)

1. **Abre Firefox** y escribe en la barra de direcciones:
   ```
   about:debugging#/runtime/this-firefox
   ```

2. **Haz clic en "Cargar complemento temporal..."**

3. **Navega a la carpeta de la extensión:**
   ```
   C:\Dev\aagw\OCR\firefox-extension
   ```

4. **Selecciona el archivo `manifest.json`**

5. **¡Listo!** La extensión aparecerá en la barra de herramientas con el ícono del robot 🤖

**Nota:** La extensión temporal se desinstalará cuando cierres Firefox. Tendrás que repetir estos pasos cada vez que lo abras.

---

### Opción 2: Instalación Permanente (Firmada)

Para una instalación permanente, necesitas firmar la extensión con Mozilla:

1. **Crea una cuenta en [addons.mozilla.org](https://addons.mozilla.org)**

2. **Comprime la carpeta de la extensión:**
   ```bash
   # Desde la carpeta firefox-extension
   zip -r element-spy-rpa-firefox.zip *
   ```

3. **Sube el archivo ZIP a Mozilla Add-ons Developer Hub:**
   - Ve a https://addons.mozilla.org/developers/
   - Haz clic en "Submit a New Add-on"
   - Sube el archivo ZIP
   - Espera la firma automática (puede tardar unos minutos)

4. **Descarga el archivo .xpi firmado**

5. **Instala el archivo .xpi:**
   - Arrastra el archivo .xpi a Firefox
   - Confirma la instalación

---

## 🚀 Uso de la Extensión

### 1. Iniciar el Servidor RPA

Antes de usar la extensión, debes tener el servidor ejecutándose:

```bash
cd C:\Dev\aagw\OCR
npm start
```

El servidor iniciará en `http://localhost:3000`

### 2. Configurar Proyecto

1. **Haz clic en el ícono de la extensión** 🤖 en la barra de herramientas
2. **Configura tu proyecto:**
   - **Carpeta del proyecto**: Ruta donde se guardará (ej: `C:\Dev\proyectos_rpa`)
   - **Nombre del proyecto**: Sin espacios, usa guiones bajos (ej: `mi_proyecto_1`)
   - **Tipo de navegador**: Selecciona "Firefox Extension"

### 3. Iniciar Grabación

1. **Haz clic en "Iniciar Grabación" (▶️)**
2. **Navega por la página web** y realiza las acciones que quieres automatizar
3. **Todas tus acciones serán capturadas:**
   - ✅ Clicks
   - ✅ Escritura de texto
   - ✅ Selección de opciones
   - ✅ Navegación entre páginas
   - ✅ Y más...

### 4. Detener Grabación

1. **Haz clic en "Detener Grabación" (⏹️)**
2. **Haz clic en "Guardar Proyecto" (💾)**
3. **El proyecto se guardará** con todos los eventos capturados

---

## 📊 Estructura del Proyecto Guardado

```
C:\Dev\proyectos_rpa\mi_proyecto_1\
├── main.xaml          ← Workflow principal
├── project.json       ← Configuración del proyecto
├── objects\           ← Objetos capturados
│   └── obj_1.json
│   └── obj_2.json
└── logs\              ← Logs de ejecución
    └── events.json
    └── events.log
    └── events.csv
```

---

## 🔧 Características

- ✅ **Funciona en cualquier sitio web** (sin restricciones CSP)
- ✅ **Captura automática de eventos**
- ✅ **Auto-numeración de objetos**
- ✅ **Generación de selectores inteligentes**
- ✅ **Logs detallados en múltiples formatos**
- ✅ **Compatible con Firefox 78+**

---

## 🐛 Solución de Problemas

### La extensión no se carga

**Solución:** Verifica que el archivo `manifest.json` esté presente y correctamente formateado.

### No se capturan eventos

**Solución:**
1. Verifica que el servidor esté corriendo en `http://localhost:3000`
2. Abre la consola de Firefox (F12) y busca errores
3. Recarga la página web después de iniciar la grabación

### Error: "Could not establish connection"

**Solución:** Asegúrate de que el servidor RPA esté ejecutándose:
```bash
cd C:\Dev\aagw\OCR
npm start
```

### La extensión desaparece después de cerrar Firefox

**Solución:** Esto es normal con la instalación temporal. Para una instalación permanente, sigue la Opción 2 (Instalación Firmada).

---

## 📝 Diferencias con la Extensión de Chrome

| Característica | Chrome | Firefox |
|----------------|--------|---------|
| Manifest Version | V3 | V2 |
| API Background | Service Worker | Background Script |
| API de Tabs | `chrome.scripting.executeScript` | `browser.tabs.executeScript` |
| Instalación Temporal | Modo Desarrollador | about:debugging |
| Instalación Permanente | Chrome Web Store | Firma Mozilla |

---

## 🔗 Enlaces Útiles

- [Documentación de WebExtensions](https://developer.mozilla.org/es/docs/Mozilla/Add-ons/WebExtensions)
- [Portal de Desarrolladores de Firefox](https://addons.mozilla.org/developers/)
- [Guía de Migración de Chrome a Firefox](https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/)

---

## 📞 Soporte

¿Problemas con la extensión?

1. Revisa los logs de la consola del navegador (F12)
2. Verifica que el servidor esté corriendo
3. Asegúrate de estar usando Firefox 78 o superior

---

**¡Feliz automatización con Firefox! 🦊🤖**
