# 📚 Ejemplos de Workflows

## Ejemplos prácticos de automatizaciones con Element Spy RPA

---

## 1. 🔍 Búsqueda en Google y Captura

**Descripción**: Busca un término en Google y captura una screenshot de los resultados.

```json
{
  "name": "Búsqueda Google con Screenshot",
  "actions": [
    {
      "type": "navigate",
      "url": "https://www.google.com"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "type",
      "selector": "input[name='q']",
      "text": "RPA automation tools"
    },
    {
      "type": "wait",
      "duration": 500
    },
    {
      "type": "click",
      "selector": "input[type='submit']"
    },
    {
      "type": "wait",
      "duration": 3000
    },
    {
      "type": "screenshot",
      "path": "google-resultados.png",
      "fullPage": true
    }
  ]
}
```

---

## 2. 📝 Llenar Formulario

**Descripción**: Completa automáticamente un formulario de contacto.

```json
{
  "name": "Llenar Formulario de Contacto",
  "actions": [
    {
      "type": "navigate",
      "url": "https://ejemplo.com/contacto"
    },
    {
      "type": "type",
      "selector": "#nombre",
      "text": "Juan Pérez"
    },
    {
      "type": "type",
      "selector": "#email",
      "text": "juan@ejemplo.com"
    },
    {
      "type": "type",
      "selector": "#telefono",
      "text": "555-1234"
    },
    {
      "type": "type",
      "selector": "#mensaje",
      "text": "Estoy interesado en sus servicios"
    },
    {
      "type": "click",
      "selector": "button[type='submit']"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "screenshot",
      "path": "confirmacion.png"
    }
  ]
}
```

---

## 3. 📊 Extracción de Datos

**Descripción**: Extrae información de una lista de productos.

```json
{
  "name": "Extraer Lista de Productos",
  "actions": [
    {
      "type": "navigate",
      "url": "https://ejemplo.com/productos"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "scroll",
      "x": 0,
      "y": 500
    },
    {
      "type": "extract",
      "selector": ".producto-nombre"
    },
    {
      "type": "extract",
      "selector": ".producto-precio"
    },
    {
      "type": "screenshot",
      "path": "productos.png",
      "fullPage": true
    }
  ]
}
```

---

## 4. 🔐 Login Automático

**Descripción**: Inicia sesión en un sitio web automáticamente.

```json
{
  "name": "Login Automático",
  "actions": [
    {
      "type": "navigate",
      "url": "https://ejemplo.com/login"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "type",
      "selector": "#username",
      "text": "usuario@ejemplo.com"
    },
    {
      "type": "type",
      "selector": "#password",
      "text": "MiPassword123"
    },
    {
      "type": "click",
      "selector": "#login-button"
    },
    {
      "type": "wait",
      "duration": 3000
    },
    {
      "type": "screenshot",
      "path": "dashboard.png"
    }
  ]
}
```

⚠️ **Nota de Seguridad**: Nunca guardes contrenciales reales en workflows. Usa este ejemplo solo para pruebas.

---

## 5. 🛒 Navegación por E-commerce

**Descripción**: Navega por categorías y productos en una tienda online.

```json
{
  "name": "Explorar E-commerce",
  "actions": [
    {
      "type": "navigate",
      "url": "https://tienda.com"
    },
    {
      "type": "hover",
      "selector": ".menu-categorias"
    },
    {
      "type": "wait",
      "duration": 500
    },
    {
      "type": "click",
      "selector": "a[href='/electronica']"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "scroll",
      "x": 0,
      "y": 800
    },
    {
      "type": "click",
      "selector": ".producto:nth-child(3)"
    },
    {
      "type": "wait",
      "duration": 1500
    },
    {
      "type": "screenshot",
      "path": "producto-detalle.png"
    }
  ]
}
```

---

## 6. 📧 Verificación de Email

**Descripción**: Verifica si un email está disponible en un formulario de registro.

```json
{
  "name": "Verificar Email Disponible",
  "actions": [
    {
      "type": "navigate",
      "url": "https://ejemplo.com/registro"
    },
    {
      "type": "type",
      "selector": "#email",
      "text": "test@ejemplo.com"
    },
    {
      "type": "click",
      "selector": "#verificar-email"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "extract",
      "selector": ".mensaje-validacion"
    },
    {
      "type": "screenshot",
      "path": "validacion.png"
    }
  ]
}
```

---

## 7. 📰 Scraping de Noticias

**Descripción**: Extrae titulares de un sitio de noticias.

```json
{
  "name": "Extraer Titulares de Noticias",
  "actions": [
    {
      "type": "navigate",
      "url": "https://noticias.com"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "extract",
      "selector": "h2.titulo-noticia"
    },
    {
      "type": "scroll",
      "x": 0,
      "y": 1000
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "extract",
      "selector": ".fecha-publicacion"
    },
    {
      "type": "screenshot",
      "path": "noticias-del-dia.png",
      "fullPage": true
    }
  ]
}
```

---

## 8. 🎫 Reserva de Citas

**Descripción**: Automatiza la reserva de una cita en línea.

```json
{
  "name": "Reservar Cita Online",
  "actions": [
    {
      "type": "navigate",
      "url": "https://clinica.com/citas"
    },
    {
      "type": "click",
      "selector": "#seleccionar-fecha"
    },
    {
      "type": "wait",
      "duration": 500
    },
    {
      "type": "click",
      "selector": ".calendario-dia[data-fecha='2024-01-15']"
    },
    {
      "type": "click",
      "selector": ".horario-disponible[data-hora='10:00']"
    },
    {
      "type": "type",
      "selector": "#nombre-paciente",
      "text": "María González"
    },
    {
      "type": "type",
      "selector": "#telefono",
      "text": "555-5678"
    },
    {
      "type": "click",
      "selector": "#confirmar-cita"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "screenshot",
      "path": "confirmacion-cita.png"
    }
  ]
}
```

---

## 9. 💼 LinkedIn - Búsqueda de Empleos

**Descripción**: Busca empleos en LinkedIn y captura resultados.

```json
{
  "name": "Buscar Empleos LinkedIn",
  "actions": [
    {
      "type": "navigate",
      "url": "https://www.linkedin.com/jobs"
    },
    {
      "type": "wait",
      "duration": 2000
    },
    {
      "type": "type",
      "selector": "#job-search-bar-keywords",
      "text": "Software Developer"
    },
    {
      "type": "type",
      "selector": "#job-search-bar-location",
      "text": "Remote"
    },
    {
      "type": "click",
      "selector": ".jobs-search-box__submit-button"
    },
    {
      "type": "wait",
      "duration": 3000
    },
    {
      "type": "scroll",
      "x": 0,
      "y": 1000
    },
    {
      "type": "extract",
      "selector": ".job-card-list__title"
    },
    {
      "type": "screenshot",
      "path": "empleos-disponibles.png",
      "fullPage": true
    }
  ]
}
```

---

## 10. 🎨 Testing de UI

**Descripción**: Prueba diferentes secciones de una interfaz.

```json
{
  "name": "Test de UI Completo",
  "actions": [
    {
      "type": "navigate",
      "url": "https://app.ejemplo.com"
    },
    {
      "type": "screenshot",
      "path": "01-home.png"
    },
    {
      "type": "click",
      "selector": "#menu-perfil"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "screenshot",
      "path": "02-perfil.png"
    },
    {
      "type": "click",
      "selector": "#menu-configuracion"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "screenshot",
      "path": "03-configuracion.png"
    },
    {
      "type": "click",
      "selector": "#menu-reportes"
    },
    {
      "type": "wait",
      "duration": 1000
    },
    {
      "type": "screenshot",
      "path": "04-reportes.png"
    }
  ]
}
```

---

## 💡 Consejos para Crear Workflows Efectivos

### 1. Usa Waits Apropiados
- Espera después de navegaciones: 2-3 segundos
- Espera después de clicks: 500-1000ms
- Ajusta según la velocidad del sitio

### 2. Selectores Confiables
- Prefiere IDs sobre clases
- Evita selectores con números dinámicos
- Usa atributos data-* cuando estén disponibles

### 3. Manejo de Errores
- Captura screenshots en puntos críticos
- Usa waits generosos en conexiones lentas
- Verifica que los elementos existan antes de interactuar

### 4. Optimización
- Minimiza los waits innecesarios
- Agrupa acciones relacionadas
- Reutiliza workflows comunes

### 5. Mantenimiento
- Documenta el propósito de cada workflow
- Usa nombres descriptivos
- Versiona tus workflows importantes

---

## 🚀 Siguientes Pasos

1. **Prueba estos ejemplos** modificándolos para tus necesidades
2. **Combina acciones** para crear workflows más complejos
3. **Comparte** tus workflows con el equipo
4. **Automatiza** tareas repetitivas diarias

---

**¡Explora, experimenta y automatiza! 🤖**
