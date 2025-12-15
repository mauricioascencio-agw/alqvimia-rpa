# Fix - Campos de Configuración No Editables

## Problema Reportado:

Usuario reportó: **"NO funciona la configuracion no deja escribir ni guardar"**

Los campos de configuración SMTP en la pestaña Videoconferencia no permitían escribir ni guardar datos.

---

## Causa del Problema:

### 1. Uso de `onchange` en lugar de `oninput`

Los campos de texto usaban el evento `onchange`, que solo se dispara **después** de que el usuario termina de escribir y sale del campo (blur event).

```javascript
// ❌ ANTES (no permitía ver el texto mientras se escribe):
<input type="text" onchange="..." />
```

Esto causaba que:
- El usuario escribiera pero no viera el texto actualizado en tiempo real
- La función de guardado no se disparaba hasta salir del campo

### 2. Notificaciones en cada tecla

Si se usaba `oninput` directamente, se guardaría y mostraría una notificación en cada tecla presionada, lo cual es molesto.

---

## Solución Aplicada:

### 1. Cambiar `onchange` a `oninput` en todos los campos de texto

**Archivo**: `public/js/settings-manager.js`

Se actualizaron **6 campos** (líneas 326-375):

```javascript
// ✅ DESPUÉS (permite escribir en tiempo real):
<input type="text" id="vcSmtpHost"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.host', this.value)">

<input type="number" id="vcSmtpPort"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.port', parseInt(this.value))">

<input type="email" id="vcSmtpUser"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.user', this.value)">

<input type="password" id="vcSmtpPassword"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.password', this.value)">

<input type="text" id="vcFromName"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.fromName', this.value)">

<input type="email" id="vcFromEmail"
       oninput="SettingsManager.updateVideoConferenceSetting('smtp.fromEmail', this.value)">
```

### 2. Implementar Debouncing para Guardar

Se agregó un timer de debounce para evitar guardar y notificar en cada tecla:

**Línea 5**: Se agregó propiedad `_saveTimeout`
```javascript
const SettingsManager = {
    // Debounce timer para guardar configuración
    _saveTimeout: null,

    settings: { ... }
}
```

**Líneas 999-1032**: Se actualizó `updateVideoConferenceSetting()`:
```javascript
updateVideoConferenceSetting(path, value) {
    const keys = path.split('.');
    let obj = this.settings.videoConference;

    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }

    obj[keys[keys.length - 1]] = value;

    // Si se activa/desactiva SMTP, mostrar/ocultar campos
    if (path === 'smtp.enabled') {
        const fields = document.getElementById('smtpConfigFields');
        if (fields) {
            if (value) {
                fields.style.opacity = '1';
                fields.style.pointerEvents = 'auto';
            } else {
                fields.style.opacity = '0.5';
                fields.style.pointerEvents = 'none';
            }
        }
        // Guardar inmediatamente si es checkbox
        this.saveSettings();
        showNotification('Configuración de videoconferencia actualizada', 'success');
    } else {
        // Debounce para campos de texto (esperar 500ms después de la última tecla)
        clearTimeout(this._saveTimeout);
        this._saveTimeout = setTimeout(() => {
            this.saveSettings();
            showNotification('Configuración guardada', 'success');
        }, 500);
    }
}
```

---

## Cómo Funciona Ahora:

### Para Checkboxes:
- Se guarda **inmediatamente** al hacer click
- Muestra notificación al instante
- Habilita/deshabilita los campos SMTP en tiempo real

### Para Campos de Texto:
- Permite escribir en **tiempo real** (cada tecla actualiza el valor)
- Espera **500ms** después de la última tecla para guardar
- Si el usuario sigue escribiendo, resetea el timer
- Solo muestra notificación cuando termina de escribir

---

## Ejemplo de Uso:

### Antes (no funcionaba):
```
1. Usuario hace click en campo "Servidor SMTP"
2. Usuario escribe "smtp.gmail.com"
3. ❌ No ve el texto aparecer mientras escribe
4. Usuario sale del campo (blur)
5. Recién ahí se guarda
```

### Ahora (funcionando):
```
1. Usuario hace click en "Habilitar envío de invitaciones"
2. ✅ Campos se habilitan inmediatamente
3. Usuario hace click en campo "Servidor SMTP"
4. Usuario escribe "smtp.gmail.com"
5. ✅ Ve cada letra aparecer en tiempo real
6. Usuario deja de escribir por 500ms
7. ✅ Se guarda automáticamente
8. ✅ Aparece notificación "Configuración guardada"
```

---

## Archivos Modificados:

1. **`public/js/settings-manager.js`**
   - Línea 5: Agregado `_saveTimeout`
   - Líneas 331, 340, 349, 357, 366, 374: Cambio `onchange` → `oninput`
   - Líneas 999-1032: Actualizada función `updateVideoConferenceSetting()`

---

## Próximos Pasos para el Usuario:

1. **Refrescar el navegador** (F5 o Ctrl+R)
2. Ir a **Configuraciones → Videoconferencia**
3. Hacer click en **"Habilitar envío de invitaciones por email"**
4. Los campos ahora estarán habilitados y editables
5. Escribir la configuración SMTP
6. Esperar 500ms después de escribir para que se guarde automáticamente
7. Click en **"Probar Conexión SMTP"** para verificar

---

## Beneficios del Fix:

✅ **Experiencia de usuario mejorada**: Se ve el texto mientras se escribe
✅ **Guardado inteligente**: No guarda en cada tecla, solo cuando terminas
✅ **Menos notificaciones**: Solo una notificación después de terminar
✅ **Mejor rendimiento**: No hace requests en cada tecla
✅ **Comportamiento estándar**: Funciona como usuarios esperan

---

**Estado:** ✅ CORREGIDO
**Fecha:** 2024-12-12
**Archivos afectados:** 1
**Líneas modificadas:** ~40
