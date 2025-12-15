# ⚡ Inicio Rápido - Element Spy RPA

## 🚀 Comenzar en 3 Pasos

### Paso 1: Instalar Dependencias
```bash
cd C:\Dev\aagw\OCR
npm install
```

### Paso 2: Iniciar el Servidor
```bash
npm start
```

O en Windows, simplemente hacer doble clic en:
```
START.bat
```

### Paso 3: Abrir el Navegador
Ir a: **http://localhost:3000**

---

## 🎯 Tu Primer Workflow en 5 Minutos

### Opción 1: Usando el Grabador (Recomendado para principiantes)

1. **Ve a la pestaña "Grabador"**
2. **Haz clic en "Iniciar Grabación"**
3. **Ingresa una URL**: `https://www.google.com`
4. **Interactúa normalmente**:
   - Escribe algo en la barra de búsqueda
   - Haz clic en buscar
   - Navega por los resultados
5. **Detén la grabación**
6. **Guarda como workflow**
7. **¡Listo!** Ya puedes ejecutarlo desde "Ejecutor"

### Opción 2: Usando Element Spy

1. **Ve a la pestaña "Element Spy"**
2. **Ingresa una URL**: `https://www.google.com`
3. **Haz clic en "Lanzar Spy"**
4. **Pasa el mouse** sobre elementos para ver sus selectores
5. **Haz clic** en un elemento para capturarlo
6. **Agrega al workflow** con el botón correspondiente
7. **Ve a "Workflows"** y continúa agregando acciones

### Opción 3: Creación Manual

1. **Ve a "Workflows"**
2. **Haz clic en "Nuevo Workflow"**
3. **Arrastra acciones** desde la paleta de la izquierda
4. **Configura cada acción**:
   - Navigate: URL destino
   - Type: Selector + texto
   - Click: Selector del elemento
5. **Guarda el workflow**
6. **Ejecuta desde "Ejecutor"**

---

## 📋 Workflow de Ejemplo Listo para Usar

Copia este contenido y guárdalo como `ejemplo.json`, luego impórtalo:

```json
{
  "name": "Mi Primer Workflow",
  "actions": [
    {
      "type": "navigate",
      "url": "https://www.google.com"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "type",
      "selector": "input[name='q']",
      "text": "RPA automation"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "screenshot",
      "path": "mi-primera-captura.png",
      "fullPage": false
    }
  ]
}
```

**Para importar:**
1. Ve a "Workflows"
2. Clic en "Importar"
3. Selecciona el archivo `ejemplo.json`
4. ¡Ejecuta!

---

## 🎨 Interfaz Principal

### Barra Lateral:
- 🔍 **Element Spy**: Inspector de elementos
- 🎥 **Grabador**: Captura acciones automáticamente
- 📊 **Workflows**: Editor visual
- ▶️ **Ejecutor**: Ejecuta workflows
- 📚 **Biblioteca**: Gestiona workflows guardados

### Panel Superior:
- 🟢 **Estado de Conexión**: Verde = Conectado, Rojo = Desconectado

---

## 💡 Consejos Rápidos

### Selectores CSS Comunes:
```css
#id                    /* Por ID */
.clase                 /* Por clase */
input[name='email']    /* Por atributo */
button:nth-child(2)    /* Por posición */
.parent > .child       /* Jerarquía */
```

### Tiempos de Espera Recomendados:
- Después de navigate: `2000-3000ms`
- Después de click: `500-1000ms`
- Para animaciones: `1000-2000ms`

### Prioridad de Selectores:
1. ✅ **ID** (`#login-button`) - Más confiable
2. ✅ **Data attributes** (`[data-test='submit']`) - Muy confiable
3. ⚠️ **Clases** (`.btn-primary`) - Puede cambiar
4. ⚠️ **nth-child** (`button:nth-child(3)`) - Puede romperse

---

## 🔥 Casos de Uso Inmediatos

### 1. Testing Manual Repetitivo
- Graba tu flujo de testing una vez
- Ejecútalo automáticamente cada vez

### 2. Llenar Formularios
- Crea un workflow con datos de prueba
- Llena formularios en segundos

### 3. Monitoreo de Sitios
- Programa capturas periódicas
- Compara cambios visualmente

### 4. Extracción de Datos
- Captura listas, tablas, precios
- Exporta a JSON automáticamente

---

## ❓ Preguntas Frecuentes

### ¿Funciona con cualquier sitio web?
✅ Sí, pero algunos sitios con protecciones anti-bot pueden bloquear Puppeteer.

### ¿Necesito saber programar?
❌ No, puedes usar el grabador o el editor visual.

### ¿Puedo programar ejecuciones?
⚠️ En la versión actual no, pero está en el roadmap.

### ¿Los workflows son portables?
✅ Sí, exporta a JSON y comparte con tu equipo.

### ¿Funciona en páginas con login?
✅ Sí, pero no guardes credenciales reales en workflows.

---

## 🐛 Problemas Comunes

### "Error: Cannot find module..."
```bash
npm install
```

### "Puerto 3000 ya en uso"
```bash
# Cambiar puerto
PORT=8080 npm start
```

### "Puppeteer no se instala"
```bash
npm install puppeteer --unsafe-perm=true --allow-root
```

### "Element Spy no funciona"
- Verifica que permites ventanas emergentes
- Algunas páginas bloquean por CORS (usa el grabador)

---

## 📞 Necesitas Ayuda?

1. **Lee la documentación completa**: `README.md`
2. **Revisa los ejemplos**: `EXAMPLES.md`
3. **Verifica la consola** del navegador (F12)
4. **Revisa los logs** del servidor

---

## ✅ Checklist de Verificación

Antes de comenzar, verifica:

- [ ] Node.js instalado (v16+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (puerto 3000)
- [ ] Navegador abierto en `http://localhost:3000`
- [ ] Conexión verde en la esquina superior derecha
- [ ] Popup blocker deshabilitado

---

## 🎓 Próximos Pasos

1. ✅ Completa tu primer workflow
2. 📚 Explora los ejemplos en `EXAMPLES.md`
3. 🎨 Experimenta con el editor visual
4. 🔄 Comparte workflows con tu equipo
5. 🚀 Automatiza tareas diarias

---

**¡Estás listo para automatizar! 🤖**

Tiempo estimado de setup: **5 minutos**
Tu primer workflow: **5 minutos más**
**Total: 10 minutos para comenzar a automatizar** ⚡
