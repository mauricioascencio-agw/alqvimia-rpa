# 📋 SISTEMA DE LOGGING COMPLETO

## ✅ IMPLEMENTADO

Se ha implementado un sistema de logging completo que registra **TODOS** los eventos que ocurren durante la grabación.

---

## 🎯 ¿QUÉ SE REGISTRA?

### Eventos de Mouse:
- ✅ **CLICK** - Click izquierdo
- ✅ **RIGHT_CLICK** - Click derecho (menú contextual)
- ✅ **DOUBLE_CLICK** - Doble click
- ✅ **CLICK_IGNORED** - Clicks que se ignoraron (por estar pausado o click en indicador)

### Eventos de Teclado:
- ✅ **KEY_DOWN** - Tecla presionada
- ✅ **KEY_UP** - Tecla soltada
- ✅ **INPUT** - Cambio de valor en input
- ✅ **CHANGE** - Evento change disparado

### Eventos de Ventana:
- ✅ **WINDOW_RESIZE** - Ventana redimensionada
- ✅ **WINDOW_FOCUS** - Ventana obtuvo foco
- ✅ **WINDOW_BLUR** - Ventana perdió foco
- ✅ **SCROLL** - Scroll en la página

### Estado de Ventana:
Cada evento incluye el estado completo de la ventana:
- Dimensiones (width, height)
- Posición (screenX, screenY)
- Scroll (scrollX, scrollY)
- URL actual
- Si tiene foco

---

## 📁 ESTRUCTURA DE ARCHIVOS

Cuando guardas un workflow, se crea esta estructura:

```
C:\Dev\aagw\OCR\workflows\
└── MiProyecto\
    ├── main.json
    ├── config.json
    ├── objects\
    │   └── txtBusqueda.json
    ├── images\
    ├── screenshots\
    └── logs\                    ← NUEVA CARPETA
        ├── events.json          ← Todos los eventos en JSON
        ├── events.log           ← Eventos en formato texto legible
        └── summary.json         ← Resumen de eventos por tipo
```

---

## 📄 ARCHIVOS DE LOG

### 1. `logs/events.json`
Contiene TODOS los eventos capturados en formato JSON:

```json
[
  {
    "timestamp": "2024-12-07T16:30:45.123Z",
    "timestampMs": 1733589045123,
    "eventType": "CLICK",
    "details": {
      "tagName": "INPUT",
      "id": "search",
      "className": "search-box",
      "text": "",
      "coordinates": { "x": 450, "y": 200, "pageX": 450, "pageY": 200 },
      "button": 0,
      "ctrlKey": false,
      "shiftKey": false,
      "altKey": false
    },
    "windowState": {
      "status": "open",
      "outerWidth": 1200,
      "outerHeight": 800,
      "innerWidth": 1184,
      "innerHeight": 760,
      "screenX": 100,
      "screenY": 100,
      "scrollX": 0,
      "scrollY": 0,
      "url": "https://www.google.com",
      "focused": true
    }
  },
  {
    "timestamp": "2024-12-07T16:30:46.456Z",
    "timestampMs": 1733589046456,
    "eventType": "KEY_DOWN",
    "details": {
      "key": "a",
      "code": "KeyA",
      "keyCode": 65,
      "ctrlKey": false,
      "shiftKey": false,
      "altKey": false,
      "target": {
        "tagName": "INPUT",
        "id": "search",
        "value": ""
      }
    },
    "windowState": { ... }
  }
]
```

### 2. `logs/summary.json`
Resumen de cuántos eventos de cada tipo se registraron:

```json
{
  "totalEvents": 47,
  "eventsByType": {
    "CLICK": 5,
    "KEY_DOWN": 15,
    "KEY_UP": 15,
    "INPUT": 10,
    "WINDOW_FOCUS": 1,
    "WINDOW_BLUR": 1
  },
  "generated": "2024-12-07T16:31:00.000Z"
}
```

### 3. `logs/events.log`
Formato de texto legible:

```
# LOG DE EVENTOS - MiProyecto

Generado: 2024-12-07T16:31:00.000Z
Total de eventos: 47

════════════════════════════════════════════════════════════════════════════════

[1] 2024-12-07T16:30:45.123Z
Tipo: CLICK
Detalles: {
  "tagName": "INPUT",
  "id": "search",
  "className": "search-box",
  "coordinates": { "x": 450, "y": 200 }
}
Ventana: 1184x760 @ https://www.google.com
────────────────────────────────────────────────────────────────────────────────

[2] 2024-12-07T16:30:46.456Z
Tipo: KEY_DOWN
Detalles: {
  "key": "a",
  "code": "KeyA",
  "keyCode": 65
}
Ventana: 1184x760 @ https://www.google.com
────────────────────────────────────────────────────────────────────────────────

...
```

---

## 🔍 CÓMO VER LOS LOGS EN TIEMPO REAL

### En la Consola del Navegador (F12):

Mientras grabas, verás logs en tiempo real:

```
📋 LOG [CLICK]: {
  timestamp: "2024-12-07T16:30:45.123Z",
  eventType: "CLICK",
  details: { ... },
  windowState: { ... }
}

📋 LOG [KEY_DOWN]: {
  timestamp: "2024-12-07T16:30:46.456Z",
  eventType: "KEY_DOWN",
  details: { key: "a", code: "KeyA" }
}

📋 LOG [INPUT]: {
  timestamp: "2024-12-07T16:30:46.500Z",
  eventType: "INPUT",
  details: { value: "a" }
}
```

### Ver todos los logs acumulados:

```javascript
// En la consola, ejecuta:
ProfessionalRecorder.eventLogs

// Verás un array con todos los eventos
```

### Ver resumen de eventos:

```javascript
// Ejecuta en consola:
const summary = {};
ProfessionalRecorder.eventLogs.forEach(log => {
  summary[log.eventType] = (summary[log.eventType] || 0) + 1;
});
console.table(summary);
```

Verás una tabla como:
```
┌───────────────┬────────┐
│    (index)    │ Values │
├───────────────┼────────┤
│ CLICK         │   5    │
│ KEY_DOWN      │   15   │
│ KEY_UP        │   15   │
│ INPUT         │   10   │
│ WINDOW_FOCUS  │   1    │
│ WINDOW_BLUR   │   1    │
└───────────────┴────────┘
```

---

## 🐛 DEBUGGING - ¿POR QUÉ NO SE CAPTURAN MÁS ACCIONES?

Con este sistema de logging, podrás ver EXACTAMENTE qué está pasando:

### Caso 1: Los clicks se registran pero no se capturan

**Busca en logs:**
```
📋 LOG [CLICK]: ...
📋 LOG [CLICK_IGNORED]: { reason: 'paused' }
```

**Solución:** El sistema estaba pausado.

### Caso 2: No aparecen logs de CLICK

**Busca en consola:**
```
✅ Sistema de captura profesional activado con LOGGING COMPLETO
```

Si NO aparece este mensaje, el sistema de inyección falló (CORS).

### Caso 3: Hay logs de CLICK pero la ventana pierde foco

**Busca en logs:**
```
📋 LOG [CLICK]: ...
📋 LOG [WINDOW_BLUR]: { url: "https://..." }
```

**Solución:** La ventana está perdiendo foco al hacer click. Puede ser que el modal se abra y la ventana pierda foco.

### Caso 4: Cambios de tamaño de ventana

**Busca en logs:**
```
📋 LOG [WINDOW_RESIZE]: {
  width: 1184,
  height: 400  <- Ventana se minimizó!
}
```

**Solución:** La ventana se está minimizando o redimensionando.

---

## 📊 EJEMPLO DE USO COMPLETO

### 1. Inicia Grabación

```bash
# Consola del navegador mostrará:
✅ Sistema de captura profesional activado con LOGGING COMPLETO
```

### 2. Interactúa con la Página

Haz clicks, escribe, mueve el mouse, etc.

Verás en consola:
```
📋 LOG [CLICK]: { tagName: "INPUT", id: "search" }
📋 LOG [KEY_DOWN]: { key: "a" }
📋 LOG [INPUT]: { value: "a" }
📋 LOG [KEY_DOWN]: { key: "u" }
📋 LOG [INPUT]: { value: "au" }
...
```

### 3. Guarda el Workflow

Click en "Guardar como Workflow"

### 4. Revisa los Logs

Ve a la carpeta del proyecto:
```
C:\Dev\aagw\OCR\workflows\MiProyecto\logs\
```

Abre:
- `events.json` - Para análisis programático
- `events.log` - Para lectura humana
- `summary.json` - Para estadísticas

### 5. Analiza el Problema

Si solo se capturó 1 acción pero hiciste 5 clicks:

**Revisa `summary.json`:**
```json
{
  "totalEvents": 15,
  "eventsByType": {
    "CLICK": 5,          <- ¡Se detectaron los 5 clicks!
    "CLICK_IGNORED": 4   <- Pero 4 fueron ignorados
  }
}
```

**Revisa `events.json`** para ver por qué se ignoraron:
```json
{
  "eventType": "CLICK_IGNORED",
  "details": { "reason": "paused" }
}
```

**Conclusión:** El sistema estaba en pausa o la ventana no tenía foco.

---

## 🎯 SOLUCIONES COMUNES

### Problema: Solo se captura la primera acción

**Revisa los logs y busca:**
1. ¿Hay eventos CLICK después del primero?
   - **SÍ:** El click se detecta pero no se captura
   - **NO:** El sistema de eventos dejó de funcionar

2. Si hay CLICK pero no se capturan:
   - Busca CLICK_IGNORED
   - Revisa WINDOW_BLUR (ventana perdió foco)
   - Verifica que el modal se cierre correctamente

### Problema: La ventana se minimiza o pierde foco

**Revisa:**
```
📋 LOG [WINDOW_BLUR]: ...
📋 LOG [WINDOW_RESIZE]: { height: 400 }  <- Minimizada
```

**Solución:**
- No minimices la ventana manualmente
- Asegúrate de que el modal de configuración se cierre
- Verifica que la ventana vuelva a tener foco

### Problema: Eventos de teclado no se registran

**Revisa:**
```
📋 LOG [KEY_DOWN]: ...
```

Si NO aparece, el sistema de eventos no está funcionando (CORS).

---

## 🚀 CÓMO PROBAR

1. **Reinicia el servidor:**
   ```bash
   npm start
   ```

2. **Abre la aplicación:**
   ```
   http://localhost:3000
   ```

3. **Abre la consola del navegador (F12)**

4. **Inicia grabación**

5. **Verás en consola:**
   ```
   ✅ Sistema de captura profesional activado con LOGGING COMPLETO
   ```

6. **Haz algunos clicks y escribe algo**

7. **Observa los logs en tiempo real:**
   ```
   📋 LOG [CLICK]: ...
   📋 LOG [KEY_DOWN]: ...
   📋 LOG [INPUT]: ...
   ```

8. **Guarda el workflow**

9. **Ve a la carpeta `logs/` y revisa los archivos**

---

## 💡 TIPS

### Ver logs en consola en cualquier momento:
```javascript
// Ver todos los logs
console.table(ProfessionalRecorder.eventLogs)

// Ver últimos 10 logs
console.table(ProfessionalRecorder.eventLogs.slice(-10))

// Filtrar solo CLICK
ProfessionalRecorder.eventLogs.filter(log => log.eventType === 'CLICK')

// Contar eventos por tipo
const counts = {};
ProfessionalRecorder.eventLogs.forEach(log => {
  counts[log.eventType] = (counts[log.eventType] || 0) + 1;
});
console.table(counts);
```

### Exportar logs manualmente:
```javascript
// Copiar logs como JSON
copy(JSON.stringify(ProfessionalRecorder.eventLogs, null, 2))

// Se copió al portapapeles, pega en un archivo .json
```

---

## ✅ RESUMEN

Con este sistema:
- ✅ TODOS los eventos se registran (clicks, teclas, ventana, etc.)
- ✅ Cada evento incluye detalles completos
- ✅ Estado de ventana en cada evento
- ✅ Logs en consola en tiempo real
- ✅ Logs guardados en 3 formatos (JSON, texto, resumen)
- ✅ Fácil de analizar y debuggear

**¡Ahora podrás ver EXACTAMENTE qué está pasando y por qué no se capturan más acciones!** 🎉

---

**Próximo paso:** Haz una prueba, guarda el workflow, y revisa los archivos en `logs/` para entender qué eventos se están detectando.
