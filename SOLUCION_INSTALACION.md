# 🔧 Solución al Problema de Instalación

## ❌ Problema: Script se queda atascado

Si el script `setup-complete.bat` se queda atascado en "Verificando Node.js y npm...", usa esta solución:

---

## ✅ Solución Rápida (3 pasos)

### Paso 1: Instalar Dependencias Manualmente

Abre una **nueva terminal CMD** en la carpeta del proyecto y ejecuta:

```bash
npm install whatsapp-web.js node-telegram-bot-api
```

**Tiempo:** 2-3 minutos

**Nota:** Es normal que muestre muchos mensajes durante la instalación.

---

### Paso 2: Iniciar el Servidor

Usa el script existente **START.bat** o ejecuta:

```bash
npm start
```

Deberías ver:

```
🚀 Servidor iniciando en: http://localhost:3000
```

**⚠️ IMPORTANTE:** Deja esta ventana abierta (es el servidor).

---

### Paso 3: Configurar Omnicanalidad

Abre **otra terminal CMD nueva** y ejecuta:

```bash
node -e "console.log('Configuracion de Omnicanalidad\n'); const readline = require('readline'); const rl = readline.createInterface({input: process.stdin, output: process.stdout}); rl.question('Token de Telegram (Enter para omitir): ', (token) => { const config = {whatsapp: {enabled: true, provider: 'whatsapp-web.js', autoReply: false, headless: false}, telegram: {enabled: token.length > 0, token: token || '', polling: true}}; require('fs').writeFileSync('omnichannel-config.js', 'module.exports = ' + JSON.stringify(config, null, 2)); console.log('\nArchivo omnichannel-config.js creado!'); rl.close(); });"
```

O simplemente **crea este archivo manualmente:**

**Archivo: `omnichannel-config.js`**

```javascript
module.exports = {
  whatsapp: {
    enabled: true,
    provider: 'whatsapp-web.js',
    autoReply: false,
    headless: false
  },
  telegram: {
    enabled: false,  // Cambia a true si tienes token
    token: '',       // Pon tu token aquí si tienes
    polling: true
  }
};
```

---

## 🚀 Alternativa: Usar Script Simplificado

He creado un script más simple que NO se queda atascado:

### Opción A: Usar INSTALAR.bat

```bash
INSTALAR.bat
```

Este script solo instala las dependencias sin verificaciones complicadas.

### Opción B: Usar setup-quick.bat

```bash
setup-quick.bat
```

---

## 📱 Inicializar WhatsApp y Telegram

Una vez que el servidor esté corriendo, en **otra terminal**:

### Método 1: Usando PowerShell

```powershell
$config = Get-Content omnichannel-config.js -Raw | ConvertFrom-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/omnichannel/initialize" -Body (@{config=$config} | ConvertTo-Json) -ContentType "application/json"
```

### Método 2: Crear un script Node.js

**Archivo: `init.js`**

```javascript
const fetch = require('node-fetch');
const config = require('./omnichannel-config');

async function init() {
  try {
    const response = await fetch('http://localhost:3000/api/omnichannel/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config })
    });

    const data = await response.json();
    console.log('Resultado:', JSON.stringify(data, null, 2));

    // Obtener QR de WhatsApp
    if (data.channels && data.channels.whatsapp && data.channels.whatsapp.status === 'qr_ready') {
      console.log('\nEsperando QR de WhatsApp...');
      setTimeout(async () => {
        const qrRes = await fetch('http://localhost:3000/api/omnichannel/whatsapp/qr');
        const qrData = await qrRes.json();
        if (qrData.success && qrData.qr) {
          console.log('\n=== QR CODE DISPONIBLE ===');
          console.log('Ve a: https://qrcode.show/');
          console.log('Pega este codigo:\n');
          console.log(qrData.qr);
        }
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nAsegurate de que el servidor este corriendo (npm start)');
  }
}

init();
```

Luego ejecuta:

```bash
node init.js
```

---

## 📋 Resumen de Comandos

```bash
# 1. Instalar dependencias
npm install whatsapp-web.js node-telegram-bot-api

# 2. Iniciar servidor (en una terminal)
npm start

# 3. En OTRA terminal, inicializar (elige uno):

# Opción A: Crear archivo de config manualmente
notepad omnichannel-config.js
# (copia el contenido de arriba)

# Opción B: Usar el script init.js
node init.js

# 4. Ver el QR de WhatsApp
# Ve a: http://localhost:3000/api/omnichannel/whatsapp/qr
# En tu navegador
```

---

## 🔍 Verificar que Todo Funciona

### Ver Estado del Sistema

Abre tu navegador en:

```
http://localhost:3000/api/omnichannel/status
```

Deberías ver un JSON con el estado de WhatsApp y Telegram.

---

## 💡 Consejos

### Si node --version se queda atascado:

1. **Cierra la terminal**
2. **Abre una nueva terminal CMD como Administrador**
3. **Navega a la carpeta del proyecto:**
   ```bash
   cd c:\AlqVimia\alqvimia-rpa
   ```
4. **Ejecuta los comandos directamente:**
   ```bash
   npm install whatsapp-web.js node-telegram-bot-api
   npm start
   ```

### Si npm install toma mucho tiempo:

Es normal. Puede tomar 3-5 minutos dependiendo de tu conexión a internet.

### Si ves errores durante npm install:

Mientras no diga "FATAL ERROR", generalmente está bien. Muchos son warnings que puedes ignorar.

---

## ✅ Checklist de Verificación

Después de seguir los pasos:

- [ ] ✅ Dependencias instaladas (carpeta `node_modules` existe)
- [ ] ✅ Servidor corriendo (muestra "Servidor corriendo en: http://localhost:3000")
- [ ] ✅ Archivo `omnichannel-config.js` creado
- [ ] ✅ Puedes acceder a `http://localhost:3000` en el navegador
- [ ] ✅ Puedes ver el estado en `http://localhost:3000/api/omnichannel/status`

---

## 📞 Soporte

Si sigues teniendo problemas, verifica:

1. **¿Tienes Node.js instalado?**
   ```bash
   node --version
   ```
   Debe mostrar algo como `v18.x.x` o `v20.x.x`

2. **¿Estás en la carpeta correcta?**
   ```bash
   dir
   ```
   Debes ver archivos como `package.json`, `server`, `public`, etc.

3. **¿El puerto 3000 está ocupado?**
   ```bash
   netstat -ano | findstr :3000
   ```
   Si ves algo, otro programa está usando el puerto.

   Solución: Cambia el puerto en `server/index.js` línea 782:
   ```javascript
   const PORT = process.env.PORT || 3001; // Cambiar a 3001 u otro
   ```

---

## 🎯 Flujo Completo Funcional

```bash
# Terminal 1 (Servidor)
cd c:\AlqVimia\alqvimia-rpa
npm install whatsapp-web.js node-telegram-bot-api
npm start
# Dejar corriendo

# Terminal 2 (Inicialización)
cd c:\AlqVimia\alqvimia-rpa
# Crear omnichannel-config.js (manual o con script)
node init.js
# Escanear QR cuando aparezca

# Listo!
```

---

¡Con estos pasos deberías tener el sistema funcionando sin problemas! 🚀
