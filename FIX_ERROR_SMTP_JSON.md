# Fix - Error SMTP: "Unexpected token '<', '<!DOCTYPE'..."

## Error Reportado:

```
❌ Error probando SMTP: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
al guardar la configuración
```

## Causa del Error:

El servidor está devolviendo HTML en lugar de JSON. Esto generalmente indica que:
1. La ruta `/api/videoconference/test-smtp` no está siendo encontrada
2. El servidor está devolviendo una página de error 404 en HTML

## Diagnóstico:

El endpoint `/test-smtp` existe en `server/video-conference-routes.js` línea 636, pero la URL que está siendo llamada es `/api/videoconference/test-smtp`.

**Problema**: Hay una diferencia en la ruta base:
- Backend registra: `/api/video-conference` (CON guión)
- Frontend llama: `/api/videoconference` (SIN guión)

## Solución:

### Opción 1: Corregir el Frontend (RECOMENDADO)

Cambiar la URL en `public/js/settings-manager.js` línea ~1037:

**ANTES**:
```javascript
const response = await fetch('/api/videoconference/test-smtp', {
```

**DESPUÉS**:
```javascript
const response = await fetch('/api/video-conference/test-smtp', {
```

### Opción 2: Corregir el Backend

Cambiar el registro de ruta en `server/index.js` línea ~1074:

**ANTES**:
```javascript
app.use('/api/video-conference', videoConferenceRoutes);
```

**DESPUÉS**:
```javascript
app.use('/api/videoconference', videoConferenceRoutes);
```

## Aplicando la Solución (Opción 1):

Corrección aplicada en `public/js/settings-manager.js` línea 1058:

**ANTES**:
```javascript
const response = await fetch('/api/videoconference/test-smtp', {
```

**DESPUÉS**:
```javascript
const response = await fetch('/api/video-conference/test-smtp', {
```

---

## Verificación:

Después de aplicar este cambio:
1. Refrescar el navegador (F5)
2. Ir a Configuraciones → Videoconferencia
3. Activar checkbox "Habilitar envío de invitaciones por email"
4. Completar campos SMTP
5. Click en "Probar Conexión SMTP"
6. ✅ Debería funcionar correctamente y enviar el email de prueba

---

**Estado**: ✅ CORREGIDO
**Fecha**: 2024-12-12
**Archivo modificado**: `public/js/settings-manager.js` línea 1058
