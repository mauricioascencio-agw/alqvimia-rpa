# 🤖 Element Spy - RPA Automation Tool

## Herramienta Completa de RPA tipo Alqvimia

Una potente herramienta de automatización RPA (Robotic Process Automation) construida con tecnologías web modernas. Permite inspeccionar elementos, grabar acciones, crear workflows personalizados y ejecutar automatizaciones complejas.

---

## ✨ Características Principales

### 🔍 Element Spy Inspector
- **Selector Picker**: Haz clic en cualquier elemento web para obtener sus selectores
- **Múltiples tipos de selectores**: CSS, XPath, ID, Class, Name
- **Vista previa en tiempo real**: Visualiza elementos mientras navegas
- **Captura de atributos**: Extrae todos los atributos de cualquier elemento

### 🎥 Grabador de Acciones
- **Grabación automática**: Captura todas tus interacciones con páginas web
- **Eventos soportados**:
  - Clicks
  - Escritura de texto
  - Navegación entre páginas
  - Selección de opciones
  - Y más...
- **Pausa/Reanudar**: Controla la grabación en tiempo real
- **Edición de acciones**: Modifica o elimina acciones grabadas

### 📊 Editor de Workflows Visual
- **Drag & Drop**: Arrastra acciones para construir workflows
- **Acciones disponibles**:
  - 🌐 Navegar a URLs
  - 🖱️ Hacer click en elementos
  - ⌨️ Escribir texto
  - ⏱️ Esperar (delays)
  - 📸 Capturar screenshots
  - 📥 Extraer datos
  - 📜 Scroll
  - 👆 Hover
- **Reordenamiento**: Mueve acciones arriba/abajo
- **Configuración detallada**: Cada acción es completamente configurable

### ⚡ Ejecutor de Workflows
- **Ejecución automatizada**: Ejecuta workflows con un click
- **Monitor en tiempo real**: Visualiza el progreso de la ejecución
- **Barra de progreso**: Seguimiento visual del avance
- **Log detallado**: Registro completo de todas las operaciones
- **Puppeteer**: Motor de automatización potente y confiable

### 📚 Biblioteca de Workflows
- **Gestión centralizada**: Todos tus workflows en un solo lugar
- **Búsqueda rápida**: Encuentra workflows por nombre
- **Operaciones**:
  - Cargar para editar
  - Ejecutar directamente
  - Exportar a JSON
  - Eliminar
- **Persistencia**: Workflows guardados en disco

### 🔄 Importación/Exportación
- **Formato JSON**: Workflows portables y editables
- **Backup fácil**: Exporta todos tus workflows
- **Compartir**: Importa workflows de otros usuarios

---

## 🚀 Instalación

### Requisitos Previos
- Node.js 16+ instalado
- NPM o Yarn
- Navegador moderno (Chrome, Firefox, Edge)

### Pasos de Instalación

1. **Navegar al directorio del proyecto**:
```bash
cd C:\Dev\aagw\OCR
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar el servidor**:
```bash
npm start
```

4. **Abrir en el navegador**:
```
http://localhost:3000
```

---

## 📖 Guía de Uso

### 1. Element Spy Inspector

#### Cómo usar:
1. Ve a la pestaña "Element Spy"
2. Ingresa la URL de la página que quieres inspeccionar
3. Haz clic en "Lanzar Spy"
4. Una nueva ventana se abrirá
5. Mueve el mouse sobre los elementos para resaltarlos
6. Haz clic en el elemento que quieres inspeccionar
7. Los selectores aparecerán automáticamente
8. Copia el selector o agrégalo directamente a un workflow

#### Selectores generados:
- **ID**: `#elemento-id` (máxima prioridad)
- **Class**: `.clase-elemento`
- **Name**: `[name="nombre"]`
- **nth-child**: `div:nth-child(3)`
- **XPath**: `/html/body/div[1]/...`

### 2. Grabador de Acciones

#### Cómo grabar:
1. Ve a la pestaña "Grabador"
2. Haz clic en "Iniciar Grabación"
3. Ingresa la URL donde comenzar
4. Interactúa con la página normalmente
5. Todas tus acciones se capturarán automáticamente
6. Haz clic en "Detener" cuando termines
7. Revisa las acciones grabadas
8. Guarda como workflow

#### Acciones capturadas automáticamente:
- ✅ Clicks en botones, links, etc.
- ✅ Texto escrito en inputs
- ✅ Navegación entre páginas
- ✅ Timestamps para cada acción

### 3. Editor de Workflows

#### Crear un workflow manualmente:
1. Ve a "Workflows"
2. Haz clic en "Nuevo Workflow"
3. Ingresa un nombre descriptivo
4. Arrastra acciones desde la paleta
5. Configura cada acción:
   - **Navigate**: URL de destino
   - **Click**: Selector CSS del elemento
   - **Type**: Selector + texto a escribir
   - **Wait**: Duración en milisegundos
   - **Screenshot**: Ruta del archivo
   - **Extract**: Selector de elementos a extraer
   - **Scroll**: Desplazamiento X e Y
   - **Hover**: Selector del elemento
6. Reordena las acciones si es necesario
7. Haz clic en "Guardar"

#### Ejemplo de workflow:
```json
[
  {
    "type": "navigate",
    "url": "https://www.google.com"
  },
  {
    "type": "type",
    "selector": "input[name='q']",
    "text": "automation rpa"
  },
  {
    "type": "click",
    "selector": "input[type='submit']"
  },
  {
    "type": "wait",
    "duration": 2000
  },
  {
    "type": "screenshot",
    "path": "resultados.png",
    "fullPage": true
  }
]
```

### 4. Ejecutar Workflows

#### Desde el Editor:
1. Crea o carga un workflow
2. Ve a "Ejecutor"
3. Haz clic en "Ejecutar Workflow Actual"
4. Observa el monitor en tiempo real
5. Revisa el log de ejecución

#### Desde la Biblioteca:
1. Ve a "Biblioteca"
2. Encuentra tu workflow
3. Haz clic en el botón ▶️ (Play)
4. La ejecución comenzará automáticamente

### 5. Biblioteca de Workflows

#### Gestionar workflows:
- **📂 Cargar**: Abre el workflow en el editor
- **▶️ Ejecutar**: Ejecuta inmediatamente
- **📥 Exportar**: Descarga como archivo JSON
- **🗑️ Eliminar**: Borra permanentemente

#### Buscar workflows:
- Usa la barra de búsqueda
- Escribe parte del nombre
- Los resultados se filtran en tiempo real

---

## 🏗️ Arquitectura del Proyecto

```
OCR/
├── server/
│   ├── index.js                 # Servidor Express + Socket.IO
│   └── engine/
│       ├── workflow-engine.js   # Motor de ejecución (Puppeteer)
│       └── recorder-engine.js   # Motor de grabación
├── public/
│   ├── index.html              # Interfaz principal
│   ├── css/
│   │   └── styles.css          # Estilos completos
│   └── js/
│       ├── app.js              # Lógica principal y Socket.IO
│       ├── element-spy.js      # Inspector de elementos
│       ├── recorder.js         # Grabador de acciones
│       ├── workflow-editor.js  # Editor visual
│       ├── executor.js         # Ejecutor de workflows
│       └── library.js          # Gestión de biblioteca
├── data/
│   └── workflows/              # Workflows guardados (JSON)
├── package.json
└── README.md
```

---

## 🔧 Tecnologías Utilizadas

### Backend:
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **Socket.IO**: Comunicación en tiempo real
- **Puppeteer**: Automatización de navegador
- **UUID**: Generación de IDs únicos

### Frontend:
- **HTML5**: Estructura
- **CSS3**: Estilos modernos con variables CSS
- **Vanilla JavaScript**: Sin frameworks, máximo rendimiento
- **Font Awesome**: Iconos
- **Socket.IO Client**: WebSockets

---

## 📡 API REST

### Endpoints disponibles:

#### `GET /api/health`
Verifica el estado del servidor
```json
{
  "status": "ok",
  "message": "Element Spy RPA Server Running"
}
```

#### `POST /api/workflows/save`
Guarda un nuevo workflow
```json
{
  "name": "Mi Workflow",
  "workflow": [...]
}
```

#### `GET /api/workflows`
Obtiene todos los workflows
```json
{
  "success": true,
  "workflows": [...]
}
```

#### `GET /api/workflows/:id`
Obtiene un workflow específico

#### `DELETE /api/workflows/:id`
Elimina un workflow

---

## 🎯 Casos de Uso

### 1. Testing Automatizado
- Crear tests de regresión
- Validar flujos de usuario
- Capturar evidencias (screenshots)

### 2. Web Scraping
- Extraer datos de sitios web
- Monitorear cambios en páginas
- Compilar información de múltiples fuentes

### 3. Automatización de Tareas
- Llenar formularios automáticamente
- Procesar transacciones repetitivas
- Automatizar workflows de negocio

### 4. Generación de Reportes
- Capturar datos de dashboards
- Exportar información periódicamente
- Crear reportes automatizados

---

## ⚙️ Configuración Avanzada

### Modificar puerto del servidor:
```bash
PORT=8080 npm start
```

### Ejecutar en modo desarrollo (auto-reload):
```bash
npm run dev
```

### Configurar Puppeteer (headless):
Edita `server/engine/workflow-engine.js`:
```javascript
this.browser = await puppeteer.launch({
    headless: true,  // Cambiar a true para modo headless
    defaultViewport: null,
    args: ['--start-maximized']
});
```

---

## 🐛 Solución de Problemas

### El servidor no inicia:
- Verifica que el puerto 3000 esté disponible
- Asegúrate de haber instalado las dependencias: `npm install`
- Revisa que Node.js esté instalado: `node --version`

### Element Spy no funciona en páginas externas:
- Esto es por las políticas CORS del navegador
- Usa el modo de grabación como alternativa
- O ingresa los selectores manualmente

### Puppeteer no descarga:
```bash
npm install puppeteer --unsafe-perm=true
```

### Error de permisos en Windows:
- Ejecuta la terminal como Administrador
- O configura las políticas de ejecución de PowerShell

---

## 🔐 Seguridad

- ⚠️ No ejecutes workflows de fuentes no confiables
- ⚠️ Los workflows pueden contener código malicioso
- ⚠️ Revisa siempre los workflows antes de ejecutarlos
- ⚠️ No incluyas credenciales en los workflows
- ⚠️ Usa variables de entorno para información sensible

---

## 📈 Roadmap Futuro

- [ ] Variables y condicionales en workflows
- [ ] Bucles y repeticiones
- [ ] Integración con APIs externas
- [ ] Scheduling de workflows
- [ ] Notificaciones por email
- [ ] Dashboard de analytics
- [ ] Modo headless con interfaz
- [ ] Exportación a otros formatos (Python, Selenium)
- [ ] Colaboración en tiempo real
- [ ] Marketplace de workflows

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork del repositorio
2. Crea una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Uso libre para proyectos personales y comerciales

---

## 👨‍💻 Autor

**AAGW** - Element Spy RPA Tool

---

## 🙏 Agradecimientos

- Inspirado en Alqvimia
- Comunidad de Puppeteer
- Font Awesome por los iconos
- Todos los contribuidores de código abierto

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 Email: soporte@elementspy.com
- 💬 Discord: [Únete a la comunidad](#)
- 📖 Documentación: [docs.elementspy.com](#)
- 🐛 Reportar bugs: [GitHub Issues](#)

---

**¡Feliz automatización! 🚀**
