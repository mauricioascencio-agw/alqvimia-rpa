# ⚡ Generador de Componentes - Inicio Rápido

Crea componentes personalizados para tu sistema RPA en minutos.

---

## 🚀 Uso Rápido

### Opción 1: Menú Interactivo (Recomendado)

Doble clic en:
```
crear-componentes-rapido.bat
```

Selecciona el tipo de componente y listo!

### Opción 2: Asistente Completo

Para crear un componente totalmente personalizado:

**Windows:**
```batch
generar-componente.bat
```

**Línea de comandos:**
```bash
node generar-componentes.js
```

### Opción 3: Desde Plantilla

**Windows:**
```batch
crear-desde-plantilla.bat whatsapp
```

**Línea de comandos:**
```bash
node plantillas-componentes.js whatsapp
```

---

## 📦 Plantillas Disponibles

### Comunicación
- `whatsapp` - WhatsApp Business
- `telegram` - Telegram Bot
- `email` - Correo electrónico
- `api-rest` - APIs REST

### Excel
- `excel-leer` - Leer Excel
- `excel-escribir` - Escribir Excel

### Archivos
- `archivo-leer` - Leer archivos
- `archivo-escribir` - Escribir archivos

### Base de Datos
- `database-query` - Consultas SQL

### Web
- `web-navegacion` - Navegar páginas

### Utilidades
- `validar-email` - Validar emails
- `delay` - Pausas
- `log` - Logs del sistema

---

## 📝 Ejemplo Rápido

### Crear componente de WhatsApp:

```bash
# Windows
crear-desde-plantilla.bat whatsapp

# O directamente
node plantillas-componentes.js whatsapp
```

**Resultado:**
- ✅ Componente creado
- ✅ Guardado en `public/js/components/`
- ✅ Listo para usar en workflows

---

## 🎯 Flujo de Trabajo

```
1. Ejecutar generador
   ↓
2. Elegir plantilla o crear personalizado
   ↓
3. Configurar propiedades
   ↓
4. Componente generado automáticamente
   ↓
5. Aparece en el palette del sistema
   ↓
6. ¡Usar en tus workflows!
```

---

## 📁 Archivos Creados

Los componentes se guardan en:
```
public/js/components/
├── [id_componente].json
└── generated-components.json
```

---

## 🔧 Categorías

| # | Categoría | Para qué |
|---|-----------|----------|
| 1 | Web Automation | Navegación, clicks, scraping |
| 2 | Windows | Aplicaciones de escritorio |
| 3 | Excel | Hojas de cálculo |
| 4 | Files | Archivos y carpetas |
| 5 | Data Processing | Procesamiento de datos |
| 6 | Flow Control | Condiciones, loops |
| 7 | MCP Connectors | APIs e integraciones |
| 8 | Custom | Personalizados |

---

## 💡 Tipos de Propiedades

| # | Tipo | Uso |
|---|------|-----|
| 1 | text | Texto corto |
| 2 | textarea | Texto largo |
| 3 | number | Números |
| 4 | password | Contraseñas |
| 5 | checkbox | Sí/No |
| 6 | text_or_variable | Texto o variable |
| 7 | select | Lista de opciones |
| 8 | datetime-local | Fecha y hora |

---

## ⚡ Tips Rápidos

1. **Usa plantillas** cuando sea posible - son más rápidas
2. **Personaliza después** - puedes editar el JSON generado
3. **Nombra bien** - usa nombres descriptivos para tus componentes
4. **Marca requeridos** - solo lo esencial
5. **Placeholders** - ayudan al usuario a entender qué poner

---

## 🐛 Problemas Comunes

### No aparece el componente

1. Recarga la página del sistema
2. Verifica `public/js/components/generated-components.json`
3. Revisa la consola del navegador

### Error al ejecutar

```bash
# Verifica Node.js
node --version

# Debe ser v12 o superior
```

### No encuentra el archivo

```bash
# Asegúrate de estar en el directorio correcto
cd c:\AlqVimia\alqvimia-rpa
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- [GENERADOR_COMPONENTES_GUIA.md](GENERADOR_COMPONENTES_GUIA.md) - Guía completa
- [GENERADOR-COMPONENTES-README.md](GENERADOR-COMPONENTES-README.md) - Documentación técnica

---

## ✅ Checklist

Antes de crear componentes:

- [ ] Node.js instalado
- [ ] En el directorio del proyecto
- [ ] Carpeta `public/js/components/` existe
- [ ] Sistema RPA funcionando

---

## 🎉 ¡Listo!

Ahora puedes crear componentes personalizados en minutos.

**Comandos más usados:**

```batch
# Menú interactivo
crear-componentes-rapido.bat

# Componente personalizado
generar-componente.bat

# Desde plantilla
crear-desde-plantilla.bat [nombre]

# Ver todas las plantillas
crear-desde-plantilla.bat
```

**¡A crear componentes!** 🚀
