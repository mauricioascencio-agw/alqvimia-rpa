# 🔔 Sistema de Notificaciones Mejorado

Sistema completo de notificaciones con apilamiento inteligente, gestión de errores y configuración personalizable.

## 📋 Características Principales

### ✅ 1. Apilamiento Inteligente de Notificaciones

**Problema Resuelto**: Múltiples notificaciones se traslapaban unas sobre otras.

**Solución Implementada**:
- ✅ Sistema de contenedores por posición (6 contenedores independientes)
- ✅ Notificaciones se apilan verticalmente sin traslaparse
- ✅ Espaciado automático de 10px entre notificaciones
- ✅ Animaciones suaves de entrada/salida

**Posiciones Disponibles**:
- Superior: Izquierda, Centro, Derecha
- Inferior: Izquierda, Centro, Derecha

### ✅ 2. Gestión de Errores Avanzada

**Para Notificaciones de Error**:

Cada error muestra **3 botones de acción**:

1. **📋 Copiar**
   - Copia el mensaje de error al portapapeles
   - Útil para compartir errores rápidamente

2. **💾 Guardar**
   - Guarda el error en `logs/errors.log` en el servidor
   - Si no hay servidor, descarga el log localmente
   - Incluye timestamp completo

3. **📜 Ver Log (N)**
   - Muestra contador de errores acumulados
   - Abre modal con historial completo de errores
   - Acceso a todas las acciones del log

### ✅ 3. Modal de Historial de Errores

Cuando se hace click en **"Ver Log"**:

**Vista del Modal**:
- Lista completa de todos los errores
- Timestamp de cada error
- Mensaje completo formateado
- Código de color por tipo

**Acciones Disponibles**:
1. **Copiar Todo**: Copia todos los errores al portapapeles
2. **Descargar Todo**: Descarga archivo `.txt` con todos los errores
3. **Limpiar Log**: Borra el historial (con confirmación)
4. **Copiar Individual**: Botón por cada error

### ✅ 4. Configuración Personalizable

**Ubicación**: `Configuraciones > General > Notificaciones > Configurar Notificaciones`

**Por Cada Tipo de Notificación** (Error, Success, Info, Warning):

1. **Posición**:
   - ⬆️ Arriba: Izquierda / Centro / Derecha
   - ⬇️ Abajo: Izquierda / Centro / Derecha

2. **Duración**:
   - Rango: 1 a 60 segundos
   - Valores sugeridos:
     - Errores: 10 segundos (tiempo para leer y actuar)
     - Success: 3 segundos (confirmación rápida)
     - Info: 3 segundos
     - Warnings: 5 segundos

3. **Color**:
   - Selector de color visual
   - Colores por defecto:
     - 🔴 Error: `#ef4444` (rojo)
     - 🟢 Success: `#10b981` (verde)
     - 🔵 Info: `#2563eb` (azul)
     - 🟡 Warning: `#f59e0b` (amarillo)

**Vista Previa**:
- Botón de prueba por cada tipo
- Prueba la configuración antes de guardar

## 🏗️ Arquitectura Técnica

### Clase `NotificationManager`

**Propiedades**:
```javascript
{
  notifications: [],      // IDs de notificaciones activas
  containers: {},         // Contenedores por posición
  errorLog: []           // Historial de errores
}
```

**Métodos Principales**:

1. **`show(message, type)`**
   - Crea y muestra una notificación
   - La agrega al contenedor correspondiente
   - Registra errores en el log
   - Retorna ID de la notificación

2. **`close(notificationId)`**
   - Cierra una notificación específica
   - Animación de salida suave
   - Limpia del array de notificaciones

3. **`copyError(notificationId)`**
   - Copia mensaje de error al portapapeles
   - Muestra confirmación

4. **`saveToLog(notificationId)`**
   - Envía error al servidor (`/api/save-error-log`)
   - Si falla, descarga localmente
   - Formato: `[timestamp] ERROR: mensaje`

5. **`viewAllErrors()`**
   - Abre modal con historial completo
   - Lista cronológica de errores
   - Acciones en batch (copiar/descargar todo)

### Sistema de Contenedores

**6 Contenedores Fijos**:
```
top-left        top-center        top-right
    │               │                  │
    │               │                  │
    ▼               ▼                  ▼
 [Notif 1]      [Notif 1]         [Notif 1]
 [Notif 2]      [Notif 2]         [Notif 2]
 [Notif 3]      [Notif 3]         [Notif 3]
    │               │                  │
    │               │                  │
    ▼               ▼                  ▼
bottom-left   bottom-center    bottom-right
```

**Características**:
- `position: fixed`
- `display: flex; flex-direction: column`
- `gap: 10px` (separación automática)
- `pointer-events: none` (contenedor)
- `pointer-events: all` (notificaciones individuales)

## 📡 API Endpoints

### `POST /api/save-error-log`

**Request Body**:
```json
{
  "timestamp": "2025-12-13T12:34:56.789Z",
  "message": "Error al parsear archivo XAML",
  "type": "error"
}
```

**Response Success**:
```json
{
  "success": true,
  "message": "Error guardado en logs/errors.log"
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "No se pudo escribir en el archivo"
}
```

**Archivo de Log**: `logs/errors.log`

**Formato de Entrada**:
```
[2025-12-13T12:34:56.789Z] ERROR: Error al parsear archivo XAML
[2025-12-13T12:35:10.123Z] ERROR: No se encontró el archivo project.json
[2025-12-13T12:36:45.456Z] ERROR: Timeout en la conexión a la base de datos
```

## 🎨 Estilos CSS

### Botones de Acción en Notificaciones

```css
.notif-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
}

.notif-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}
```

### Animaciones

```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
```

## 📊 Persistencia de Datos

### `localStorage`

**Configuración de Notificaciones**:
```javascript
// Key: 'notificationConfig'
{
  "error": {
    "position": "top-left",
    "duration": 10000,
    "color": "#ef4444"
  },
  "success": {
    "position": "top-right",
    "duration": 3000,
    "color": "#10b981"
  },
  "info": {
    "position": "top-right",
    "duration": 3000,
    "color": "#2563eb"
  },
  "warning": {
    "position": "top-right",
    "duration": 5000,
    "color": "#f59e0b"
  }
}
```

### Servidor

**Archivo**: `logs/errors.log`
- Ubicación: Raíz del proyecto
- Formato: Texto plano
- Encoding: UTF-8
- Rotación: Manual (se puede implementar rotación automática)

## 🔄 Flujo de Uso

### Caso 1: Error Único

```
1. Usuario ejecuta acción
2. Ocurre error
3. Sistema llama: showNotification('Error...', 'error')
4. NotificationManager:
   - Crea notificación en contenedor top-left
   - Agrega a errorLog
   - Muestra botones: Copiar | Guardar | Ver Log (1)
5. Usuario puede:
   - Copiar el error
   - Guardarlo en log del servidor
   - Ver historial completo
   - Cerrar manualmente (X)
   - Esperar auto-cierre (10s)
```

### Caso 2: Múltiples Errores

```
1. Proceso genera 5 errores seguidos
2. Sistema crea 5 notificaciones
3. Se apilan verticalmente:
   ┌─────────────────────┐
   │ Error 1             │  <- Más antiguo (arriba)
   ├─────────────────────┤
   │ Error 2             │
   ├─────────────────────┤
   │ Error 3             │
   ├─────────────────────┤
   │ Error 4             │
   ├─────────────────────┤
   │ Error 5             │  <- Más reciente (abajo)
   └─────────────────────┘
4. Cada uno muestra: Ver Log (5)
5. Click en "Ver Log" muestra modal con todos
6. Usuario puede:
   - Copiar todo
   - Descargar todo en archivo .txt
   - Copiar individual
   - Limpiar log
```

### Caso 3: Configuración Personalizada

```
1. Usuario va a: Configuraciones > General > Notificaciones
2. Click en "Configurar Notificaciones"
3. Modal se abre con 4 pestañas (Error, Success, Info, Warning)
4. Para "Error" cambia:
   - Posición: top-left → bottom-right
   - Duración: 10s → 15s
   - Color: #ef4444 → #dc2626 (rojo más oscuro)
5. Click "Probar Error" para ver preview
6. Click "Cerrar" (auto-guarda en localStorage)
7. Próximos errores aparecen con nueva configuración
```

## 🎯 Casos de Uso Específicos

### Migración de UiPath con Errores

**Escenario**: Importar 10 workflows XAML, 3 fallan

**Comportamiento**:
```
1. Workflow 1: ✅ Success (top-right, verde, 3s)
2. Workflow 2: ✅ Success (top-right, verde, 3s)
3. Workflow 3: ❌ Error "temp.xaml: Faltan parámetros" (top-left, rojo, 10s)
   - Botones: [Copiar] [Guardar] [Ver Log (1)]
4. Workflow 4: ✅ Success
5. Workflow 5: ❌ Error "Timeout al parsear" (top-left, rojo, 10s)
   - Botones: [Copiar] [Guardar] [Ver Log (2)]
   - Se apila debajo del Error 3
6. Workflow 6: ❌ Error "Archivo corrupto" (top-left, rojo, 10s)
   - Botones: [Copiar] [Guardar] [Ver Log (3)]
   - Se apila debajo del Error 5
...

Usuario click en "Ver Log (3)":

┌────────────────────────────────────────────────┐
│  Log de Errores (3)                        [X] │
├────────────────────────────────────────────────┤
│                                                 │
│  [2025-12-13 12:34:56]                    [📋] │
│  Error en temp.xaml: Faltan parámetros         │
│                                                 │
│  [2025-12-13 12:35:10]                    [📋] │
│  Timeout al parsear workflow.xaml               │
│                                                 │
│  [2025-12-13 12:35:45]                    [📋] │
│  Archivo Main.xaml corrupto                    │
│                                                 │
├────────────────────────────────────────────────┤
│ [Limpiar Log] [Descargar] [Copiar] [Cerrar]   │
└────────────────────────────────────────────────┘
```

## 🚀 Ventajas del Sistema

### 1. **Sin Traslape**
- Las notificaciones nunca se superponen
- Cada una tiene su espacio definido
- Lectura clara de múltiples mensajes

### 2. **Gestión Eficiente**
- Errores se registran automáticamente
- Acceso rápido al historial
- Exportación flexible (clipboard o archivo)

### 3. **Experiencia de Usuario**
- Configuración personalizable
- Vista previa antes de guardar
- Acciones contextuales (solo errores tienen botones extra)

### 4. **Debugging Facilitado**
- Log persistente de errores
- Timestamps exactos
- Fácil compartir con equipo técnico

### 5. **Escalabilidad**
- Soporta cualquier cantidad de notificaciones
- Rendimiento óptimo (DOM eficiente)
- Memoria controlada (auto-cierre)

## 📝 Archivos Modificados

1. **`public/js/notification-config.js`**
   - Nueva clase `NotificationManager`
   - Sistema de contenedores
   - Gestión de error log
   - Modal de historial
   - Funciones de copiar/guardar

2. **`public/js/settings-manager.js`**
   - Botón de configuración en Settings
   - Método `openNotificationConfig()`
   - Integración con modal de configuración

3. **`server/index.js`**
   - Nuevo endpoint `POST /api/save-error-log`
   - Creación de carpeta `logs/`
   - Escritura en `errors.log`

4. **`public/index.html`**
   - Script de `notification-config.js` agregado

## 🔧 Configuración Recomendada

### Para Desarrollo
```javascript
error:   { position: 'top-left',    duration: 15000, color: '#ef4444' }
success: { position: 'top-right',   duration: 2000,  color: '#10b981' }
info:    { position: 'top-right',   duration: 2000,  color: '#2563eb' }
warning: { position: 'top-center',  duration: 5000,  color: '#f59e0b' }
```

### Para Producción
```javascript
error:   { position: 'bottom-left',  duration: 10000, color: '#ef4444' }
success: { position: 'bottom-right', duration: 3000,  color: '#10b981' }
info:    { position: 'bottom-right', duration: 3000,  color: '#2563eb' }
warning: { position: 'bottom-right', duration: 5000,  color: '#f59e0b' }
```

### Para Presentaciones/Demos
```javascript
error:   { position: 'top-center',    duration: 8000,  color: '#dc2626' }
success: { position: 'top-center',    duration: 3000,  color: '#059669' }
info:    { position: 'bottom-center', duration: 4000,  color: '#1d4ed8' }
warning: { position: 'top-center',    duration: 6000,  color: '#d97706' }
```

## 🎓 Ejemplos de Código

### Mostrar Error con Log Automático

```javascript
// Error simple
showNotification('Error al conectar con la base de datos', 'error');

// Se guarda automáticamente en errorLog
// Usuario ve botones: [Copiar] [Guardar] [Ver Log (N)]
```

### Mostrar Success

```javascript
showNotification('✅ Workflow importado exitosamente', 'success');

// Solo muestra mensaje y botón X
// No guarda en errorLog
// Auto-cierra según duración configurada
```

### Múltiples Errores en Secuencia

```javascript
files.forEach(file => {
    try {
        parseFile(file);
    } catch (error) {
        showNotification(`Error en ${file}: ${error.message}`, 'error');
        // Cada error se apila sin traslaparse
        // Todos se guardan en errorLog
    }
});
```

### Acceso Manual al Log

```javascript
// Ver historial completo
notificationManager.viewAllErrors();

// Copiar todos los errores
notificationManager.copyAllErrors();

// Descargar log completo
notificationManager.downloadAllErrors();

// Limpiar historial
notificationManager.clearErrorLog();
```

---

**Versión**: 2.0
**Última actualización**: 2025-12-13
**Estado**: ✅ Completo y funcional
**Compatibilidad**: Chrome, Edge, Firefox, Safari (moderno)
