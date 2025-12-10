# 🤖 Configuración de IA/OCR - Alqvimia RPA

## ✨ Características Nuevas

El sistema ahora incluye un **wizard de configuración de IA/OCR** que te permite elegir entre múltiples proveedores de inteligencia artificial para el análisis automático de documentos.

### Proveedores Soportados

#### 1. **Claude (Anthropic)** 🧠 - Recomendado
- **Ventajas**: Excelente para análisis de documentos complejos, extracción estructurada
- **Modelos disponibles**:
  - Claude 3.5 Sonnet (Recomendado) - Balance perfecto
  - Claude 3 Opus - Más potente y preciso
  - Claude 3 Haiku - Más rápido y económico
- **Costo**: ~$3 por millón de tokens de entrada
- **Configuración**:
  - API Key: Obtén en [console.anthropic.com](https://console.anthropic.com)
  - Formato: `sk-ant-api03-...`

#### 2. **OpenAI GPT-4 Vision** 🎯
- **Ventajas**: Excelente OCR, análisis visual de documentos
- **Modelos disponibles**:
  - GPT-4o (Recomendado) - El más reciente
  - GPT-4 Turbo - Rápido y económico
  - GPT-4 Vision Preview
- **Costo**: ~$10 por millón de tokens de entrada
- **Configuración**:
  - API Key: Obtén en [platform.openai.com](https://platform.openai.com/api-keys)
  - Formato: `sk-proj-...` o `sk-...`

#### 3. **Google Cloud Vision** 🔍
- **Ventajas**: OCR especializado de alta precisión
- **Características**: Detección de texto, análisis de formularios
- **Costo**: ~$1.50 por 1000 imágenes
- **Configuración**:
  - API Key: Obtén en [Google Cloud Console](https://console.cloud.google.com)
  - Habilita Vision API en tu proyecto

#### 4. **Azure Document Intelligence** ☁️
- **Ventajas**: Especializado en formularios y facturas
- **Modelos preentrenados**: Facturas, recibos, documentos generales
- **Costo**: ~$1 por 1000 páginas
- **Configuración**:
  - Endpoint: Tu endpoint de Azure Cognitive Services
  - API Key: De tu recurso de Document Intelligence

#### 5. **Tesseract OCR** 📝 - Gratuito
- **Ventajas**: 100% gratuito, procesamiento local, sin límites
- **Limitaciones**: Menor precisión que servicios de pago
- **Ideal para**: Documentos simples, textos legibles
- **Configuración**: No requiere API Key

---

## 📋 Cómo Usar

### Paso 1: Configurar Proveedor

1. Abre la aplicación en `http://localhost:3000`
2. Ve a **IA Dashboard** en el menú lateral
3. Haz clic en **"Configurar IA/OCR"** (botón en la esquina superior derecha)
4. Selecciona tu proveedor preferido
5. Ingresa tus credenciales (API Key, endpoint, etc.)
6. Haz clic en **"Probar Configuración"** para verificar
7. Guarda la configuración

### Paso 2: Analizar Documentos

1. En el **IA Dashboard**, haz clic en **"Generar Workflow Inteligente"**
2. Selecciona o arrastra tu documento (PDF, PNG, JPG)
3. El sistema analizará automáticamente con el proveedor configurado
4. Revisa y ajusta los campos detectados
5. Genera el workflow automático

---

## 🔐 Seguridad de API Keys

### Importante ⚠️

- **Las API Keys se almacenan localmente** en tu máquina
- **NO se comparten** con servicios externos excepto el proveedor de IA seleccionado
- Para producción, considera encriptar las claves usando:
  ```javascript
  // Implementar encriptación en producción
  const encryptedKey = encrypt(apiKey, secretKey);
  ```

### Recomendaciones

1. ✅ **Usar variables de entorno** para claves sensibles
2. ✅ **Rotar API Keys regularmente**
3. ✅ **Monitorear uso** para detectar accesos no autorizados
4. ✅ **Limitar permisos** de las API Keys (solo lo necesario)
5. ❌ **NO compartir** claves en repositorios públicos

---

## 💰 Costos Aproximados por Proveedor

### Ejemplo: Analizar 100 facturas PDF (1 página cada una)

| Proveedor | Costo Aprox. | Tiempo Promedio | Precisión |
|-----------|-------------|-----------------|-----------|
| Claude 3.5 Sonnet | ~$0.30 | 3-5 seg/doc | ⭐⭐⭐⭐⭐ |
| GPT-4o | ~$1.00 | 2-4 seg/doc | ⭐⭐⭐⭐⭐ |
| Google Vision | ~$0.15 | 1-2 seg/doc | ⭐⭐⭐⭐ |
| Azure Doc Intelligence | ~$0.10 | 2-3 seg/doc | ⭐⭐⭐⭐⭐ |
| Tesseract | **GRATIS** | 5-10 seg/doc | ⭐⭐⭐ |

---

## 🚀 Ejemplos de Uso

### Caso 1: Facturas SAT (México)

**Proveedor Recomendado**: Claude 3.5 Sonnet o Azure Doc Intelligence

```javascript
// Los campos se detectarán automáticamente:
- RFC Emisor / Receptor
- Folio Fiscal (UUID)
- Fecha de emisión
- Monto total
- Subtotal
- IVA
- Método de pago
```

### Caso 2: Recibos de Nómina

**Proveedor Recomendado**: Azure Doc Intelligence (modelo prebuilt-receipt)

```javascript
// Campos detectados:
- Nombre del empleado
- Periodo
- Salario bruto
- Deducciones
- Salario neto
- Fecha de pago
```

### Caso 3: Documentos Escaneados Antiguos

**Proveedor Recomendado**: Google Cloud Vision + Claude

```javascript
// Proceso de dos pasos:
// 1. Google Vision extrae texto (OCR)
// 2. Claude analiza y estructura los campos
```

---

## 🛠️ Solución de Problemas

### Error: "API Key inválida"

✅ **Solución**:
- Verifica que copiaste la clave completa
- Claude keys empiezan con `sk-ant-`
- OpenAI keys empiezan con `sk-`
- Asegúrate de que la clave no tenga espacios

### Error: "Rate limit exceeded"

✅ **Solución**:
- Reduce la velocidad de procesamiento
- Espera unos minutos antes de reintentar
- Considera upgrade de tu plan

### Error: "Invalid model"

✅ **Solución**:
- Verifica que el modelo existe para tu proveedor
- Claude: `claude-3-5-sonnet-20241022`
- OpenAI: `gpt-4o`

### La precisión es baja

✅ **Solución**:
- Mejora la calidad de las imágenes
- Usa documentos con buena resolución (mínimo 150 DPI)
- Prueba con otro proveedor
- Para PDFs escaneados, usa Google Vision primero

---

## 📊 Monitoreo y Logs

El sistema guarda automáticamente:

- ✅ Historial de configuraciones en `/Adminconfig/ai-ocr-config.json`
- ✅ Logs de pruebas de conexión en la consola del servidor
- ✅ Estadísticas de uso en localStorage

### Ver estadísticas

```javascript
// Desde la consola del navegador
const config = AIConfigManager.getConfig();
console.log('Proveedor actual:', config.provider);
```

---

## 🔄 Cambiar de Proveedor

Puedes cambiar de proveedor en cualquier momento:

1. Abre **Configurar IA/OCR**
2. Selecciona otro proveedor
3. Ingresa las nuevas credenciales
4. Guarda

Los documentos ya procesados se mantienen, solo cambia el motor de análisis para nuevos documentos.

---

## 📝 Ejemplo de PDF de Prueba

Usa el PDF en:
```
C:\Dev\Nom\Ale\Constancia de situación Físcal.pdf
```

Este documento debería detectar campos como:
- RFC
- Nombre / Razón Social
- Régimen Fiscal
- Código Postal
- Fecha de Inicio de Operaciones

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa logs del servidor Node.js
3. Verifica que tienes créditos en tu cuenta del proveedor
4. Prueba con un documento más simple primero

---

## ⚡ Próximas Mejoras

- [ ] Soporte para PDF multipágina
- [ ] Análisis de tablas complejas
- [ ] Entrenamiento personalizado
- [ ] Caché de resultados para documentos similares
- [ ] Procesamiento batch (múltiples documentos)
- [ ] Exportación a Excel/CSV
- [ ] Integración con SAT (México)

---

**¡Disfruta de tu nuevo sistema de análisis automático de documentos! 🎉**
