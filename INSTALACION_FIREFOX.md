# 🦊 Guía de Instalación Rápida - Firefox

## 📦 Extensión Element Spy RPA para Firefox

### ⚡ Instalación Rápida (2 opciones)

---

## 🎯 OPCIÓN 1: Instalación Temporal (Recomendada para Desarrollo)

### **Paso 1: Abre el Panel de Depuración de Firefox**

1. Abre **Firefox**
2. En la barra de direcciones, escribe:
   ```
   about:debugging#/runtime/this-firefox
   ```
3. Presiona **Enter**

---

#### **Paso 2: Carga la Extensión**

1. Haz clic en el botón **"Cargar complemento temporal..."** (Load Temporary Add-on)
2. Navega a la carpeta:
   ```
   C:\Dev\aagw\OCR\firefox-extension
   ```
3. Selecciona el archivo **`manifest.json`**
4. Haz clic en **"Abrir"**

---

#### **Paso 3: ¡Listo! Usa la Extensión**

1. Verás el ícono del robot 🤖 en la barra de herramientas de Firefox
2. **Inicia el servidor RPA** (si no lo has hecho):
   ```bash
   cd C:\Dev\aagw\OCR
   npm start
   ```
3. **Haz clic en el ícono** 🤖 para abrir el panel de la extensión
4. **Configura tu proyecto** y comienza a grabar

---

## 📦 OPCIÓN 2: Empaquetado para Distribución

Si necesitas crear un archivo `.zip` para firmar la extensión con Mozilla:

### **Método A: Con PowerShell (Más Simple)**

1. **Ejecuta el script de empaquetado:**
   ```bash
   C:\Dev\aagw\OCR\firefox-extension\package-firefox-powershell.bat
   ```

2. **Se creará el archivo:**
   ```
   C:\Dev\aagw\OCR\firefox-extension\element-spy-rpa-firefox.zip
   ```

### **Método B: Con 7-Zip (Si lo tienes instalado)**

1. **Ejecuta el script alternativo:**
   ```bash
   C:\Dev\aagw\OCR\firefox-extension\package-firefox.bat
   ```

### **Método C: Manual**

1. **Selecciona estos archivos:**
   - manifest.json
   - background.js
   - content-script.js
   - injected-recorder.js
   - popup.html
   - popup.js
   - icon16.png
   - icon48.png
   - icon128.png

2. **Comprime en ZIP** (clic derecho → Enviar a → Carpeta comprimida)

3. **Renombra a:** `element-spy-rpa-firefox.zip`

---

### 🔐 Firmar la Extensión con Mozilla

Una vez que tengas el archivo `.zip`:

1. **Ve a:** https://addons.mozilla.org/developers/
2. **Inicia sesión** o crea una cuenta Mozilla
3. **Haz clic en "Submit a New Add-on"**
4. **Sube el archivo:** `element-spy-rpa-firefox.zip`
5. **Espera la firma automática** (~5-10 minutos)
6. **Descarga el archivo `.xpi` firmado**
7. **Instala en Firefox:** Arrastra el `.xpi` a Firefox

---

## 🎯 Uso Básico

### 1️⃣ Configurar Proyecto

```
Carpeta: C:\Dev\proyectos_rpa
Nombre:  mi_proyecto (sin espacios)
Tipo:    Firefox Extension
```

### 2️⃣ Iniciar Grabación

- Haz clic en **"▶️ Iniciar Grabación"**
- Navega por la web y realiza las acciones
- Se capturarán automáticamente:
  - ✅ Clicks
  - ✅ Escritura de texto
  - ✅ Navegación
  - ✅ Selección de elementos

### 3️⃣ Guardar Proyecto

- Haz clic en **"⏹️ Detener Grabación"**
- Haz clic en **"💾 Guardar Proyecto"**
- Tu proyecto se guardará en la carpeta especificada

---

## ⚠️ Notas Importantes

### Instalación Temporal

- La extensión se **desinstalará automáticamente** cuando cierres Firefox
- Tendrás que **repetir los pasos** cada vez que abras Firefox
- Esto es normal en el modo de desarrollo

### Instalación Permanente

Si quieres que la extensión permanezca instalada:

1. **Firma la extensión** con Mozilla (gratis)
2. Sigue las instrucciones en:
   ```
   C:\Dev\aagw\OCR\firefox-extension\README.md
   ```

---

## 🔧 Solución de Problemas

### ❌ "No se pudo cargar el complemento"

**Solución:** Asegúrate de seleccionar el archivo `manifest.json`, no la carpeta.

### ❌ "Could not establish connection"

**Solución:** Verifica que el servidor esté corriendo:
```bash
cd C:\Dev\aagw\OCR
npm start
```

### ❌ La extensión no captura eventos

**Solución:**
1. Recarga la página web después de iniciar la grabación
2. Abre la consola de Firefox (F12) y busca errores
3. Verifica que hayas hecho clic en "Iniciar Grabación"

---

## 📊 Comparación: Chrome vs Firefox

| Característica | Chrome | Firefox |
|----------------|--------|---------|
| **Instalación Temporal** | Modo Desarrollador | about:debugging |
| **Ruta de Instalación** | chrome://extensions | about:debugging |
| **Archivo de Instalación** | Carpeta completa | manifest.json |
| **Persistencia** | Permanece hasta deshabilitar | Se elimina al cerrar |
| **Manifest Version** | V3 (Service Worker) | V2 (Background Script) |

---

## ✅ Ventajas de la Extensión

- ✅ Funciona en **cualquier sitio web** (sin restricciones CSP)
- ✅ No requiere permisos especiales del sistema
- ✅ Captura eventos de forma automática
- ✅ Compatible con todas las versiones de Firefox 78+
- ✅ Código 100% abierto y modificable

---

## 📁 Archivos de la Extensión

```
firefox-extension/
├── manifest.json          ← Configuración de la extensión
├── background.js          ← Lógica de fondo
├── content-script.js      ← Script de contenido
├── injected-recorder.js   ← Captura de eventos
├── popup.html             ← Interfaz de usuario
├── popup.js               ← Lógica del popup
├── icon16.png             ← Ícono 16x16
├── icon48.png             ← Ícono 48x48
├── icon128.png            ← Ícono 128x128
└── README.md              ← Documentación completa
```

---

## 🚀 ¡Ya Puedes Automatizar con Firefox!

**Disfruta de todas las capacidades de Element Spy RPA en Firefox:**

1. 🎯 Captura automática de acciones
2. 🤖 Generación de workflows
3. 💾 Guardado de proyectos
4. 📊 Logs detallados
5. 🔄 Reproducción de automatizaciones

---

**¿Necesitas ayuda?** Consulta el README completo en:
```
C:\Dev\aagw\OCR\firefox-extension\README.md
```

---

**¡Feliz automatización! 🦊🤖**
