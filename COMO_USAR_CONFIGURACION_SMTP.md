# Cómo Usar la Configuración SMTP - Guía Rápida

## 🚀 Pasos para Configurar Email de Invitaciones

### 1️⃣ Abrir Configuraciones

```
Abrir navegador → http://localhost:3000
Click en icono ⚙️ en sidebar
Click en pestaña "Videoconferencia"
```

### 2️⃣ Habilitar Envío de Invitaciones

```
✅ Activar checkbox: "Habilitar envío de invitaciones por email"
```

**IMPORTANTE**: Los campos de abajo se habilitarán cuando actives este checkbox.

---

## 📧 Configuración para Gmail

### Paso 1: Obtener Contraseña de Aplicación

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Click en **"Seguridad"**
3. Activa **"Verificación en 2 pasos"** (si no está activada)
4. Scroll hacia abajo y busca **"Contraseñas de aplicaciones"**
5. Click en **"Contraseñas de aplicaciones"**
6. Selecciona aplicación: **"Correo"**
7. Selecciona dispositivo: **"Otro (nombre personalizado)"**
8. Escribe: **"Alqvimia RPA"**
9. Click en **"Generar"**
10. **Copia la contraseña de 16 caracteres** que aparece

### Paso 2: Completar Formulario

Llena los siguientes campos:

| Campo | Valor | Ejemplo |
|-------|-------|---------|
| **Servidor SMTP** | `smtp.gmail.com` | smtp.gmail.com |
| **Puerto** | `587` | 587 |
| **Usuario/Email** | Tu email de Gmail | tucorreo@gmail.com |
| **Contraseña** | Contraseña de aplicación (16 caracteres) | abcd efgh ijkl mnop |
| **Nombre del remitente** | Nombre que aparecerá en el email | Alqvimia Videoconferencia |
| **Email del remitente** | Tu email o uno personalizado | noreply@alqvimia.com |
| **Usar conexión segura (SSL/TLS)** | ❌ Dejar sin marcar para puerto 587 | |

### Paso 3: Probar Configuración

1. Click en botón **"Probar Conexión SMTP"**
2. Espera unos segundos
3. Verifica tu email
4. Deberías recibir un email de prueba con el asunto:
   ```
   ✅ Prueba de Configuración SMTP - Alqvimia Videoconferencia
   ```

---

## 📧 Configuración para Outlook/Office365

| Campo | Valor |
|-------|-------|
| **Servidor SMTP** | `smtp.office365.com` |
| **Puerto** | `587` |
| **Usuario/Email** | tu-email@outlook.com |
| **Contraseña** | Tu contraseña de Outlook |
| **Usar conexión segura** | ❌ Dejar sin marcar |

---

## 📧 Configuración para Otros Proveedores

### Yahoo Mail
- **Servidor**: `smtp.mail.yahoo.com`
- **Puerto**: `587`
- **Usuario**: tu-email@yahoo.com
- **Contraseña**: Usa contraseña de aplicación (activar 2FA primero)

### Hotmail
- **Servidor**: `smtp.live.com`
- **Puerto**: `587`
- **Usuario**: tu-email@hotmail.com

### SMTP Personalizado
- Consulta con tu proveedor de hosting/email

---

## 🧪 Probar el Sistema Completo

### 1. Configurar SMTP (ya lo hiciste arriba)

### 2. Abrir Videoconferencia

```
Click en "Videoconferencia" en sidebar
```

### 3. Crear Sesión con Invitados

**NOTA**: Esta funcionalidad estará integrada próximamente en la UI de videoconferencia.

Por ahora, puedes probar el endpoint manualmente:

```javascript
// Abrir consola del navegador (F12) y ejecutar:

const smtp = SettingsManager.settings.videoConference.smtp;

fetch('/api/videoconference/send-invitation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    smtp: smtp,
    invitation: {
      sessionTitle: 'Reunión de Prueba',
      sessionUrl: window.location.href + '?session=test123',
      sessionDate: new Date().toLocaleDateString(),
      sessionTime: new Date().toLocaleTimeString(),
      hostName: 'Tu Nombre',
      participants: [
        {
          name: 'Juan Pérez',
          email: 'juan@example.com'
        },
        {
          name: 'María García',
          email: 'maria@example.com'
        }
      ]
    }
  })
})
.then(r => r.json())
.then(result => console.log('✅ Resultado:', result))
.catch(err => console.error('❌ Error:', err));
```

---

## ❌ Solución de Problemas

### Los campos están deshabilitados (grises)

**Solución**: Debes activar el checkbox **"Habilitar envío de invitaciones por email"** primero.

### No puedo escribir en los campos

**Solución**:
1. Refrescar la página (F5)
2. Verificar que el checkbox esté activado
3. Si persiste, revisar consola de JavaScript (F12) por errores

### Error: "Authentication failed"

**Soluciones**:
- **Gmail**: Verifica que estés usando una "Contraseña de aplicación", no tu contraseña normal
- **Gmail**: Verifica que la "Verificación en 2 pasos" esté activada
- **Outlook**: Verifica que tu contraseña sea correcta
- **Todos**: Verifica que el usuario/email sea correcto

### Error: "Connection timeout"

**Soluciones**:
- Verifica tu conexión a internet
- Verifica que el servidor SMTP sea correcto
- Verifica que el puerto sea correcto (587 para TLS, 465 para SSL)
- Algunos proveedores bloquean SMTP, contacta soporte

### El email de prueba no llega

**Soluciones**:
1. Revisa la carpeta de **SPAM/Correo no deseado**
2. Espera 1-2 minutos (puede tardar)
3. Verifica que el servidor haya respondido "success"
4. Revisa logs del servidor en la consola

---

## 🎯 Configuraciones Adicionales

### Calidad de Video/Audio

En la misma pestaña "Videoconferencia", puedes configurar:

- **Carpeta de proyectos**: Dónde se guardan las grabaciones
- **Duración máxima**: Tiempo máximo de grabación (5-480 minutos)
- **Calidad de Video**: Baja (480p), Media (720p), Alta (1080p)
- **Calidad de Audio**: Baja (64 kbps), Media (128 kbps), Alta (192 kbps)
- **Filtro predeterminado**: Sin filtro, Desenfocar fondo, Sepia, etc.

### Características Habilitadas

Activa/desactiva funcionalidades:

- ✅ Iniciar grabación automáticamente
- ✅ Transcripción automática activada
- ✅ Habilitar chat
- ✅ Habilitar compartir pantalla
- ✅ Habilitar emojis en chat
- ✅ Habilitar filtros de video

---

## 📝 Notas Importantes

### Seguridad

- ⚠️ **NUNCA** compartas tu contraseña de aplicación
- ⚠️ La contraseña se guarda en localStorage del navegador
- ⚠️ En producción, considera usar variables de entorno (`.env`)

### Límites de Envío

- **Gmail**: 500 emails por día (cuentas gratuitas)
- **Outlook**: 300 emails por día
- **Yahoo**: 100 emails por día

Si necesitas enviar más, considera usar servicios dedicados como:
- SendGrid
- Mailgun
- AWS SES

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa este documento
2. Revisa `CONFIGURACION_VIDEOCONFERENCIA.md` para más detalles técnicos
3. Revisa `FIX_CAMPOS_CONFIGURACION.md` para problemas conocidos
4. Revisa logs del servidor en la terminal

---

**¡Listo! Ya puedes enviar invitaciones por email desde tu sistema de videoconferencia.** 🎉
