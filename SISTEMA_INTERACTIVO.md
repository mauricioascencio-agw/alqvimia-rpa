# 🎯 SISTEMA DE GRABACIÓN INTERACTIVO

## ✅ ¡PROBLEMA RESUELTO!

Ahora cada click te preguntará qué hacer y guardará correctamente.

---

## 🚀 LO QUE ACABO DE IMPLEMENTAR

### ✨ Características Nuevas:

1. **📋 Diálogo por Cada Elemento**
   - Al hacer click en cualquier elemento, aparece un formulario completo
   - Configuras TODO antes de agregar la acción

2. **🏷️ Identificación Automática**
   - Detecta si es imagen (🖼️) o elemento web
   - Sugiere nombre de variable automático
   - Muestra tipo de elemento (button, input, img, etc.)

3. **⚙️ Configuración Completa**
   - **Nombre de variable**: `btnLogin`, `txtUsuario`, `imgLogo`
   - **Tipo de acción**: Click, Type, Extract, Screenshot, Hover
   - **Selector CSS**: Múltiples opciones (ID, Class, XPath)
   - **Delay personalizado**: Tiempo de espera en ms
   - **Notas**: Descripción de la acción
   - **Keystrokes**: Checkbox para simular teclas especiales

4. **💾 Guardado con Nombre**
   - Al detener, te pregunta el nombre del workflow
   - No se pierde ninguna acción
   - Todo se guarda en la biblioteca

---

## 🎬 CÓMO USAR (Paso a Paso)

### Paso 1: Reiniciar Servidor

```bash
# Detén el servidor (Ctrl+C)
# Luego:
npm start
```

### Paso 2: Abrir Aplicación

```
http://localhost:3000
```

### Paso 3: Iniciar Grabación

1. Ve a pestaña **"Grabador"**
2. Click en **"Iniciar Grabación"**
3. Ingresa la URL (ej: `https://www.google.com`)
4. Se abre la ventana con indicador **verde** que dice "🎯 MODO INTERACTIVO"

### Paso 4: Hacer Click en Elementos

1. **Pasa el mouse** sobre elementos → Se resaltan en **verde**
2. **Haz click** en el elemento que quieres capturar
3. **Automáticamente** vuelves a la ventana principal
4. **Aparece un formulario** con toda la información del elemento

### Paso 5: Configurar la Acción

El formulario muestra:

```
╔══════════════════════════════════════════════╗
║  📋 Configurar Acción: BUTTON               ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🎯 ELEMENTO WEB                             ║
║  Tag: <button>                               ║
║  ID: submit-btn                              ║
║  Texto: "Enviar"                             ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🎬 Tipo de Acción:                          ║
║  [🖱️ CLICK - Hacer click ▼]                 ║
║                                              ║
║  🏷️ Nombre de la Variable:                   ║
║  [btnEnviar_______________]                  ║
║                                              ║
║  🎯 Selector CSS:                            ║
║  [#submit-btn_____________▼]                 ║
║                                              ║
║  ⏱️ Delay (ms):                              ║
║  [500_____________________]                  ║
║                                              ║
║  📝 Notas:                                   ║
║  [Botón principal de envío]                  ║
║                                              ║
╠══════════════════════════════════════════════╣
║         [Cancelar]  [Confirmar]              ║
╚══════════════════════════════════════════════╝
```

### Paso 6: Confirmar

- Click en **"Confirmar"**
- La acción se agrega a la lista
- Vuelves automáticamente a la ventana de grabación
- Continúa haciendo click en más elementos

### Paso 7: Detener y Guardar

1. Click en **"Detener"** cuando termines
2. Te pregunta: **"Nombre del workflow:"**
3. Ingresa un nombre descriptivo
4. ✅ ¡Guardado en la biblioteca!

---

## 🎨 EJEMPLO COMPLETO

### Automatizar Búsqueda en Google:

#### 1. Iniciar Grabación
```
URL: https://www.google.com
```

#### 2. Click en Barra de Búsqueda
```
Elemento detectado:
- Tag: <input>
- Name: q
- Tipo sugerido: TYPE ✅

Configuración:
- Tipo: ⌨️ TYPE
- Variable: txtBusqueda
- Selector: input[name="q"]
- Texto: "automation rpa"
- Keystroke: ☑ Sí
- Delay: 500ms
- Notas: "Campo principal de búsqueda"
```

#### 3. Click en Botón Buscar
```
Elemento detectado:
- Tag: <button>
- Tipo: submit
- Tipo sugerido: CLICK ✅

Configuración:
- Tipo: 🖱️ CLICK
- Variable: btnBuscar
- Selector: button[type="submit"]
- Delay: 2000ms
- Notas: "Ejecuta la búsqueda"
```

#### 4. Click en Logo (Imagen)
```
Elemento detectado:
- 🖼️ IMAGEN DETECTADA
- Tag: <img>
- Src: logo.png
- Tipo sugerido: CLICK

Configuración:
- Tipo: 🖱️ CLICK
- Variable: imgLogo
- Selector: img[alt="Google"]
- Delay: 500ms
- Notas: "Logo de Google"
```

#### 5. Detener
```
Acciones capturadas: 4

1. navegacion1 - NAVIGATE: https://www.google.com
2. txtBusqueda - TYPE: "automation rpa" + Keystroke
3. btnBuscar - CLICK: button[type="submit"]
4. imgLogo 🖼️ - CLICK en imagen

Nombre del workflow: "Buscar en Google"
✅ Guardado
```

---

## 🎯 CAMPOS DEL FORMULARIO

### 🎬 Tipo de Acción
- **🖱️ CLICK**: Hacer click en el elemento
- **⌨️ TYPE**: Escribir texto (muestra campo adicional)
- **📥 EXTRACT**: Extraer el texto del elemento
- **📸 SCREENSHOT**: Capturar imagen del elemento
- **👆 HOVER**: Pasar el mouse sobre el elemento

### 🏷️ Nombre de Variable
- Identificador único para el elemento
- Auto-generado inteligentemente:
  - `btn` para botones
  - `txt` para inputs
  - `img` para imágenes
  - `lnk` para links
  - `sel` para selects

### 🎯 Selector CSS
- Múltiples opciones disponibles
- Ordenadas por prioridad (ID primero)
- Dropdown para elegir el mejor

### ⏱️ Delay
- Tiempo de espera después de la acción
- En milisegundos
- Default: 500ms (medio segundo)

### 📝 Notas
- Descripción opcional
- Te ayuda a recordar qué hace la acción
- Se muestra en la lista

### ⌨️ Keystrokes (solo para TYPE)
- Checkbox especial
- Simula teclas como Enter, Tab, etc.
- Útil para enviar formularios

---

## 📊 LISTA DE ACCIONES

Cada acción se muestra con:

```
┌──────────────────────────────────────────┐
│ 🖱️ btnLogin                              │
│ CLICK: #login-button • Delay: 500ms     │
│ 💬 Botón principal de login              │
│                             [✏️] [🗑️]    │
├──────────────────────────────────────────┤
│ ⌨️ txtUsuario                            │
│ TYPE: "admin" + Keystroke • Delay: 500ms│
│ 💬 Campo de nombre de usuario            │
│                             [✏️] [🗑️]    │
├──────────────────────────────────────────┤
│ 🖼️ imgLogo IMAGEN                        │
│ CLICK en imagen • Delay: 500ms           │
│                             [✏️] [🗑️]    │
└──────────────────────────────────────────┘
```

---

## ✅ VENTAJAS DEL SISTEMA INTERACTIVO

1. ✅ **Control Total**: Configuras cada acción antes de agregarla
2. ✅ **Sin Pérdidas**: Nada se graba sin tu confirmación
3. ✅ **Nombres Descriptivos**: Variables con significado claro
4. ✅ **Delays Personalizados**: Ajustas tiempos según necesites
5. ✅ **Documentación Incluida**: Campo de notas para cada acción
6. ✅ **Keystrokes Soportados**: Simula teclas especiales
7. ✅ **Detección de Imágenes**: Identifica automáticamente imágenes
8. ✅ **Múltiples Selectores**: Eliges el más confiable

---

## 🎨 INDICADORES VISUALES

### En la Ventana de Grabación:
```
┌──────────────────────────────┐
│ ⚪ 🎯 MODO INTERACTIVO  [3]  │  ← Verde pulsante
└──────────────────────────────┘
```

### Elementos al Pasar Mouse:
```
┌─────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Verde brillante
│ ▓ ELEMENTO    ▓ │    Outline destacado
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────┘
```

### En la Lista:
```
🖼️ IMAGEN badge → Identifica clicks en imágenes
💬 Notas → Aparecen debajo de cada acción
✅ Contador → Se actualiza en tiempo real
```

---

## 🔧 FLUJO COMPLETO

```
1. Iniciar Grabación
   ↓
2. Ingresa URL
   ↓
3. Se abre ventana con indicador verde
   ↓
4. Haz click en elemento
   ↓
5. Aparece formulario de configuración
   ↓
6. Completa los campos
   ↓
7. Click en "Confirmar"
   ↓
8. Acción agregada a la lista
   ↓
9. Vuelve a paso 4 o continúa
   ↓
10. Click en "Detener"
    ↓
11. Ingresa nombre del workflow
    ↓
12. ✅ Guardado en biblioteca
    ↓
13. Ejecuta desde "Ejecutor"
```

---

## 💡 TIPS IMPORTANTES

### ✅ HACER:
- Espera que aparezca el indicador verde
- Pasa el mouse para ver el highlight
- Lee la información del elemento antes de confirmar
- Usa nombres de variables descriptivos
- Agrega notas para acciones complejas
- Ajusta delays según la velocidad del sitio

### ❌ EVITAR:
- Hacer click muy rápido sin confirmar
- Cerrar el formulario sin confirmar o cancelar
- Usar nombres de variables genéricos
- Olvidar agregar delays adecuados
- No agregar notas en acciones importantes

---

## 🎉 RESULTADO FINAL

Tendrás workflows con:

```json
{
  "name": "Login Automático",
  "actions": [
    {
      "varName": "navegacion1",
      "type": "navigate",
      "url": "https://app.ejemplo.com",
      "delay": 2000,
      "notes": "Navegación inicial"
    },
    {
      "varName": "txtEmail",
      "type": "type",
      "selector": "#email",
      "text": "usuario@ejemplo.com",
      "keystroke": false,
      "delay": 500,
      "notes": "Campo de email"
    },
    {
      "varName": "txtPassword",
      "type": "type",
      "selector": "#password",
      "text": "password123",
      "keystroke": true,
      "delay": 500,
      "notes": "Campo de contraseña + Enter"
    },
    {
      "varName": "imgLogo",
      "type": "click",
      "selector": "img[alt='Logo']",
      "delay": 500,
      "notes": "Click en logo",
      "element": {
        "isImage": true
      }
    }
  ]
}
```

---

## 📞 ¿TIENES DUDAS?

### No aparece el formulario:
- Verifica que el indicador verde esté visible
- Asegúrate de que la ventana principal esté activa
- Revisa la consola (F12) por errores

### No se resaltan los elementos:
- Verifica que la página haya cargado completamente
- Puede ser una página externa (CORS)
- El indicador verde debe estar presente

### No se guardan las acciones:
- Asegúrate de hacer click en "Confirmar"
- No cierres el formulario con la X
- Verifica que aparezcan en la lista

---

## 🚀 PRÓXIMOS PASOS

1. **Reinicia el servidor**: `npm start`
2. **Abre la aplicación**: http://localhost:3000
3. **Ve a Grabador**
4. **Inicia grabación**
5. **Haz click en elementos**
6. **Configura cada acción**
7. **Detén y guarda**
8. **¡Ejecuta tu workflow!**

---

**¡Ahora SÍ tienes un sistema de grabación PROFESIONAL! 🎊**

Cada click → Formulario → Configuración → Confirmación → Guardado

**¡Imposible perder acciones!** 🔒
