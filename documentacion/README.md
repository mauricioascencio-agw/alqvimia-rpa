# Documentacion - Alqvimia RPA

> Carpeta centralizada de toda la documentacion del proyecto.

---

## Estructura de Documentos

| Archivo | Descripcion | Cuando Actualizar |
|---------|-------------|-------------------|
| [FRONTEND.md](FRONTEND.md) | UI, componentes, estilos, JS cliente | Cambios en `/public/` |
| [BACKEND.md](BACKEND.md) | APIs, servidor, rutas, NodeJS | Cambios en `/server/` |
| [BASE_DE_DATOS.md](BASE_DE_DATOS.md) | Storage, schemas, conexiones BD | Cambios en datos |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios | **SIEMPRE** |

---

## Reglas de Documentacion

### 1. NO crear nuevos archivos MD

Todos los cambios deben documentarse en los archivos existentes:
- Cambios de UI -> `FRONTEND.md`
- Cambios de API -> `BACKEND.md`
- Cambios de datos -> `BASE_DE_DATOS.md`
- **TODOS** los cambios -> `CHANGELOG.md`

### 2. Actualizar CHANGELOG.md siempre

Cada vez que se haga un cambio:

```markdown
### [YYYY-MM-DD] - vX.X.X

#### Agregado/Modificado/Corregido
- Descripcion del cambio

#### Archivos Afectados
- `archivo.js` - Que se cambio
```

### 3. Incluir ejemplos de codigo

```javascript
// Mostrar codigo relevante
function ejemplo() {
    return 'Documentar con ejemplos';
}
```

### 4. Actualizar tablas existentes

No agregar texto suelto, actualizar las tablas y secciones existentes.

---

## Indice Rapido

### Frontend

- [Arquitectura](FRONTEND.md#arquitectura-general)
- [Videoconferencia](FRONTEND.md#videoconferencia)
- [Configuraciones](FRONTEND.md#configuraciones)
- [Extensiones](FRONTEND.md#extensiones-de-navegador)

### Backend

- [APIs](BACKEND.md#apis-disponibles)
- [SMTP](BACKEND.md#post-apivideo-conferencetest-smtp)
- [WebSocket](BACKEND.md#websocket-events)

### Base de Datos

- [LocalStorage](BASE_DE_DATOS.md#localstorage-navegador)
- [Estructura Archivos](BASE_DE_DATOS.md#estructura-de-archivos)
- [Conexiones BD](BASE_DE_DATOS.md#conexiones-a-bases-de-datos)

---

## Version Actual

**v2.1.0** - 2024-12-12

Ver [CHANGELOG.md](CHANGELOG.md) para historial completo.

---

## Contacto

Para dudas sobre la documentacion, revisar el codigo fuente o consultar el CHANGELOG.
