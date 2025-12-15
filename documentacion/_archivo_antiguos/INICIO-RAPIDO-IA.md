# 🚀 Inicio Rápido - Configuración de IA para OCR

## ⚡ Empezar en 3 Pasos

### 1️⃣ Obtener API Key (Recomendado: Claude)

**Opción A: Claude (Anthropic)** - La más recomendada para documentos
1. Ve a: https://console.anthropic.com
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys"
4. Crea una nueva clave
5. Copia la clave (empieza con `sk-ant-api03-...`)

**Opción B: OpenAI** - Alternativa popular
1. Ve a: https://platform.openai.com/api-keys
2. Inicia sesión o crea cuenta
3. Crea nueva API Key
4. Copia la clave (empieza con `sk-...`)

**Opción C: Tesseract** - Gratis, no requiere API Key
- ✅ No requiere configuración
- ❌ Menor precisión

### 2️⃣ Iniciar el Sistema

```bash
# Terminal 1: Iniciar servidor
cd c:\OCR\alqvimia-rpa
npm start

# Abre tu navegador en:
# http://localhost:3000
```

### 3️⃣ Configurar en la Interfaz

1. **Abrir configuración**:
   - Click en "IA Dashboard" (menú lateral)
   - Click en "Configurar IA/OCR" (esquina superior derecha)

2. **Seleccionar Claude** (o tu proveedor preferido):
   - Click en la tarjeta de "Claude (Anthropic)"
   - Pega tu API Key en el campo
   - Selecciona modelo: `Claude 3.5 Sonnet` (recomendado)
   - Click en "Probar Configuración"
   - Si sale ✅ verde: Click en "Guardar Configuración"

3. **¡Listo!** Ya puedes analizar documentos

---

## 📄 Probar con tu PDF

### Opción 1: Usar el PDF de ejemplo del usuario

```
C:\Dev\Nom\Ale\Constancia de situación Físcal.pdf
```

### Opción 2: Usar cualquier PDF/imagen

1. En "IA Dashboard", click en "Generar Workflow Inteligente"
2. Arrastra tu archivo o click para seleccionar
3. Espera el análisis (10-30 segundos)
4. ✅ ¡Campos detectados automáticamente!

---

## 🎯 Qué Esperar

El sistema detectará automáticamente campos como:

### Para Facturas SAT:
- ✅ RFC Emisor
- ✅ RFC Receptor
- ✅ Folio Fiscal (UUID)
- ✅ Fecha
- ✅ Subtotal
- ✅ IVA
- ✅ Total

### Para Constancia de Situación Fiscal:
- ✅ RFC
- ✅ Nombre/Razón Social
- ✅ Régimen Fiscal
- ✅ Domicilio Fiscal
- ✅ Fecha de Inicio de Operaciones

### Para otros documentos:
- La IA detectará automáticamente los campos relevantes

---

## 💡 Ejemplo de Resultado

```json
{
  "documentType": "Constancia de Situación Fiscal",
  "fields": [
    {
      "name": "rfc",
      "label": "RFC",
      "type": "text",
      "value": "XAXX010101000",
      "confidence": 0.98
    },
    {
      "name": "razon_social",
      "label": "Razón Social",
      "type": "text",
      "value": "EMPRESA EJEMPLO SA DE CV",
      "confidence": 0.95
    }
  ],
  "confidence": 0.96
}
```

---

## ❓ Problemas Comunes

### "No hay configuración de IA"
✅ Configura un proveedor primero (ver Paso 3)

### "API Key inválida"
✅ Verifica que copiaste la clave completa
✅ Claude keys: `sk-ant-api03-...`
✅ OpenAI keys: `sk-...`

### "Error de conexión"
✅ Verifica tu conexión a internet
✅ Verifica que tienes créditos en tu cuenta

### Campos no detectados correctamente
✅ Asegúrate de que el PDF es legible
✅ Prueba con Claude 3.5 Sonnet (mejor modelo)
✅ Si es imagen escaneada, aumenta la resolución

---

## 🎓 Siguiente Paso

Una vez detectados los campos, puedes:

1. ✏️ **Editar** los campos manualmente si es necesario
2. ➕ **Agregar** campos personalizados
3. 🚀 **Generar workflow** automático
4. 💾 **Guardar** el workflow para reutilizar

El workflow generado puede:
- Leer PDFs automáticamente
- Extraer los campos configurados
- Guardar en base de datos
- Generar reportes
- Enviar notificaciones

---

## 📞 ¿Necesitas Ayuda?

Consulta la documentación completa:
- `CONFIGURACION-IA-OCR.md` - Documentación detallada
- Consola del navegador (F12) - Ver errores
- Logs del servidor - Ver estado de las llamadas

---

**¡Empieza a automatizar tus documentos ahora! 🎉**
