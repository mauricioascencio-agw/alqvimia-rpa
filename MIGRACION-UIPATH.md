# 🔄 Sistema de Migración desde UiPath

## 🎯 Descripción General

El sistema de migración de **Alqvimia** permite convertir proyectos completos de UiPath a workflows de Alqvimia de forma automática, manteniendo la lógica y funcionalidad de tus automatizaciones.

## ✨ Características Principales

### 1. **Dos Métodos de Migración**

#### Método 1: Proyecto UiPath (XAML) - **Recomendado** ⭐
- Parsea archivos `.xaml` directamente
- Convierte actividades UiPath a componentes Alqvimia
- Mantiene la estructura del proyecto
- Analiza `project.json` para metadata

#### Método 2: Exportación JSON - Alternativa
- Importa desde archivo JSON exportado de UiPath
- Útil para proyectos sin acceso a archivos fuente
- Requiere pre-procesamiento manual

### 2. **Mapeo Inteligente de Actividades**

Alqvimia mapea automáticamente **30+ actividades** de UiPath:

| Categoría | UiPath → Alqvimia |
|-----------|-------------------|
| **Navegación Web** | |
| OpenBrowser | → browser_open |
| NavigateTo | → navigate |
| CloseBrowser | → browser_close |
| RefreshBrowser | → browser_refresh |
| **Interacción Web** | |
| Click | → click |
| TypeInto | → type |
| SendHotkey | → send_keys |
| SelectItem | → select_option |
| Check/Uncheck | → checkbox_check/uncheck |
| Hover | → hover |
| **Extracción** | |
| GetText | → extract_text |
| GetAttribute | → extract_attribute |
| GetFullText | → extract_data |
| DataScraping | → scrape_table |
| **Variables** | |
| Assign | → set_variable |
| GetVariable | → get_variable |
| SetVariable | → set_variable |
| **Control de Flujo** | |
| If | → if_condition |
| While | → while_loop |
| DoWhile | → do_while_loop |
| ForEach | → for_each |
| Switch | → switch_case |
| **Esperas** | |
| Delay | → wait |
| WaitForElement | → wait_for_element |
| **Capturas** | |
| TakeScreenshot | → screenshot |
| **Excel** | |
| ExcelApplicationScope | → excel_open |
| ExcelReadRange | → excel_read |
| ExcelWriteRange | → excel_write |
| ExcelAppendRange | → excel_append |
| **Archivos** | |
| ReadTextFile | → read_file |
| WriteTextFile | → write_file |
| FileExists | → file_exists |
| DeleteFile | → delete_file |
| CopyFile | → copy_file |
| MoveFile | → move_file |
| **HTTP/API** | |
| HttpRequest | → http_request |
| InvokeMethod | → invoke_api |
| **Email** | |
| SendMail | → send_email |
| GetMail | → get_email |
| **PDF** | |
| ReadPDFText | → pdf_read |
| ReadPDFWithOCR | → pdf_ocr |
| **JavaScript** | |
| InvokeCode | → custom_script |
| ExecuteJavaScript | → execute_javascript |
| **Logging** | |
| LogMessage | → log_message |
| WriteLine | → log_message |

### 3. **Análisis Completo del Proyecto**

El sistema analiza:
- ✅ Nombre del proyecto
- ✅ Main flow principal
- ✅ Workflows secundarios (subflows)
- ✅ Dependencias
- ✅ Descripción del proyecto

### 4. **Estadísticas de Mapeo**

Te muestra:
- 📊 Total de workflows detectados
- 📊 Total de actividades
- ✅ Actividades mapeadas exitosamente
- ⚠️ Actividades por mapear (generación automática)
- 📈 Tasa de mapeo (%)

### 5. **Vista Previa Detallada**

Antes de importar, puedes:
- 👁️ Ver cada workflow convertido
- 📋 Revisar paso a paso con configuración
- ⚠️ Identificar componentes no mapeados
- ✅ Confirmar la conversión

## 🚀 Cómo Usar

### Paso 1: Abrir el Sistema de Migración

1. Abre **Alqvimia** en http://localhost:3000
2. Ve a la pestaña **"Workflows"**
3. Click en **"Migrar desde otra plataforma"** (botón naranja con ícono 🔄)

### Paso 2: Seleccionar Método

Elige entre dos opciones:

#### Opción A: Proyecto UiPath (XAML) - Recomendado

1. Click en la tarjeta **"Proyecto UiPath (XAML)"**
2. Ingresa la ruta completa de tu proyecto UiPath:
   ```
   Ejemplo: C:\Dev\aagw\Lony\Respaldo Lony UIpath\Lony Production V2_09Dic2025\Lony Production V2
   ```
3. Click en **"Aceptar"**

#### Opción B: Exportación JSON

1. Click en la tarjeta **"Exportación JSON"**
2. Selecciona el archivo `.json` exportado desde UiPath
3. El sistema lo cargará automáticamente

### Paso 3: Análisis Automático

El sistema mostrará:

```
📦 Proyecto UiPath
   Nombre: Lony Production V2
   Main Flow: Main Flow.xaml
   Workflows encontrados: 14
   Descripción: This RPA can download and store the resume from different platforms...
```

### Paso 4: Revisar Estadísticas de Mapeo

```
📊 Estadísticas de Mapeo

┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  Workflows  │ Actividades │  Mapeadas   │ Por Mapear  │ Tasa Mapeo  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│      14     │     287     │     243     │      44     │     85%     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Paso 5: Workflows Convertidos

```
📋 Workflows Convertidos

✓ Main Flow.xaml                    [ 45 pasos ]
✓ OCC.xaml                          [ 28 pasos ] ⚠️ 3 sin mapear
✓ Indeed.xaml                       [ 32 pasos ] ⚠️ 2 sin mapear
✓ CompuTrabajo.xaml                 [ 25 pasos ]
✓ LinkedIn.xaml                     [ 19 pasos ] ⚠️ 1 sin mapear
✓ OCC Subflow.xaml                  [ 18 pasos ]
✓ Indeed_candidate_subflow.xaml     [ 15 pasos ]
...y 7 más
```

### Paso 6: Vista Previa (Opcional)

Para cualquier workflow, click en **"Vista Previa"**:

```
👁️ Vista Previa: Main Flow

📌 45 pasos | 📁 Original: Main Flow.xaml

┌─────────────────────────────────────────────────────────┐
│ 1. Abrir navegador Chrome                               │
│    browser_open                                          │
│    ✓ Configuración:                                      │
│      {                                                   │
│        "url": "https://occ.com.mx",                      │
│        "browser": "chrome"                               │
│      }                                                   │
├─────────────────────────────────────────────────────────┤
│ 2. Buscar candidatos                                     │
│    type                                                  │
│    ✓ Configuración:                                      │
│      {                                                   │
│        "selector": "input[name='search']",               │
│        "text": "desarrollador"                           │
│      }                                                   │
├─────────────────────────────────────────────────────────┤
│ 3. Custom Lony API Call                ⚠️ SIN MAPEAR   │
│    custom_component                                      │
│    Actividad original: ui:InvokeMethod                   │
│    Este componente se creará automáticamente             │
└─────────────────────────────────────────────────────────┘
```

### Paso 7: Importar Workflows

Tienes dos opciones:

#### Opción A: Importar Uno por Uno
1. Click en **"Importar"** en cada workflow que desees
2. Se guardará en la biblioteca de Alqvimia
3. Estará disponible para editar y ejecutar

#### Opción B: Importar Todos
1. Click en **"Importar Todos los Workflows"** al final
2. Confirma la acción
3. Todos los workflows se importarán automáticamente
4. Aparecerá notificación con el resultado:
   ```
   ✅ Importación completada: 14 exitosos, 0 fallidos
   ```

### Paso 8: Verificar en Biblioteca

1. Ve a la pestaña **"Biblioteca"**
2. Verás todos los workflows importados con el sufijo **(UiPath)**
3. Puedes:
   - ✏️ Editarlos
   - ▶️ Ejecutarlos
   - 📥 Exportarlos
   - 🗑️ Eliminarlos

## 📊 Ejemplo Real: Proyecto Lony

### Proyecto Original (UiPath)

```
Lony Production V2/
├── Main Flow.xaml
├── OCC.xaml
├── OCC Subflow.xaml
├── Indeed.xaml
├── Indeed_candidate_subflow.xaml
├── Indeed_job_subflow.xaml
├── CompuTrabajo.xaml
├── CompuTrabajo_candidate_subflow.xaml
├── CompuTrabajo_Job_subflow.xaml
├── LinkedIn.xaml
├── LinkedIn_Subflow.xaml
├── Lony-API.xaml
├── Resume-Parser.xaml
└── S3-Upload.xaml
```

### Resultado de la Migración

**Estadísticas:**
- 📦 14 workflows detectados
- 📊 287 actividades totales
- ✅ 243 actividades mapeadas (85%)
- ⚠️ 44 actividades custom (generadas automáticamente)

**Workflows principales:**
1. **Main Flow** - Orquestador principal
2. **OCC** - Scraping de OCC Mundial
3. **Indeed** - Scraping de Indeed
4. **CompuTrabajo** - Scraping de CompuTrabajo
5. **LinkedIn** - Scraping de LinkedIn
6. **Lony-API** - Integración con API Lony
7. **Resume-Parser** - Parser de CVs
8. **S3-Upload** - Subida a AWS S3

**Componentes generados automáticamente:**
- `lony_api_call` - Llamadas a API Lony
- `resume_parse` - Parseo de CV
- `s3_upload` - Subida a S3
- `occ_login` - Login específico OCC
- `indeed_search` - Búsqueda Indeed
- ...y 39 más

### Tiempo de Migración

- ⏱️ **Análisis**: ~5 segundos
- ⏱️ **Parseo**: ~15 segundos (14 workflows)
- ⏱️ **Importación**: ~10 segundos
- ⏱️ **Total**: **~30 segundos** para 14 workflows completos

## 🔧 Detalles Técnicos

### Parseo de XAML

El sistema parsea archivos XAML de UiPath usando regex para detectar:

1. **Actividades**: `<ui:OpenBrowser...>`, `<ui:Click...>`, etc.
2. **DisplayName**: Nombre descriptivo de la actividad
3. **Propiedades**:
   - `Url`, `Selector`, `Text`, `Duration`
   - `FilePath`, `To`, `Value`, `Condition`
   - `Method`, `Headers`, `Body`
   - `Subject`, `Attachments`

### Conversión de Selectores

UiPath usa selectores propietarios:
```xml
<ui:Target>
  <ui:Target.Selector>
    <wnd app='chrome.exe' cls='Chrome_WidgetWin_1' />
    <ctrl id='searchBox' cls='edit' name='q' tag='INPUT' />
  </ui:Target.Selector>
</ui:Target>
```

Alqvimia convierte a CSS:
```javascript
{
  "selector": "input[name='q']#searchBox"
}
```

**Estrategia de conversión:**
1. Busca atributo `id` → `#id`
2. Busca atributo `cls` (class) → `.class`
3. Busca atributo `name` → `[name="..."]`
4. Si no puede convertir, mantiene comentario con selector original

### Parsing de Duraciones

UiPath usa formato TimeSpan:
```
00:00:05  (5 segundos)
00:02:30  (2 minutos 30 segundos)
01:00:00  (1 hora)
```

Alqvimia convierte a milisegundos:
```javascript
{
  "duration": 5000    // 5 segundos
  "duration": 150000  // 2.5 minutos
  "duration": 3600000 // 1 hora
}
```

### Metadata de Importación

Cada workflow importado incluye:
```json
{
  "name": "Main Flow (UiPath)",
  "workflow": [...],
  "metadata": {
    "importedFrom": "UiPath",
    "originalFile": "Main Flow.xaml",
    "importDate": "2025-12-13T12:30:00.000Z",
    "projectName": "Lony Production V2",
    "originalActivities": 45,
    "mappedActivities": 42,
    "generatedComponents": 3,
    "mappingRate": 93
  }
}
```

## ⚙️ Configuración Avanzada

### Agregar Nuevo Mapeo de Actividad

En `uipath-migrator.js`, línea 21:

```javascript
this.activityMapping = {
    // Agregar nueva actividad
    'ui:MiActividadCustom': 'mi_componente_alqvimia',

    // Actividades existentes...
    'ui:OpenBrowser': 'browser_open',
    // ...
};
```

### Personalizar Configuración

En `mapActivityConfig()`, línea 333:

```javascript
case 'ui:MiActividadCustom':
    config.parametro1 = activity.properties.Param1 || '';
    config.parametro2 = activity.properties.Param2 || '';
    config.opcionAvanzada = activity.properties.Advanced || false;
    break;
```

### Extender Parser de XAML

En `server/index.js`, función `parseUiPathXAML()`, línea 1327:

```javascript
const activityTypes = [
    'ui:OpenBrowser',
    'ui:Click',
    // Agregar nueva actividad a parsear
    'ui:MiActividadCustom',
    // ...
];
```

## 🐛 Solución de Problemas

### Error: "No se encontró project.json"

**Causa:** Ruta incorrecta o proyecto incompleto

**Solución:**
- Verifica que la ruta apunte a la carpeta raíz del proyecto UiPath
- Asegúrate de que existe el archivo `project.json`
- Usa la ruta completa absoluta, por ejemplo:
  ```
  C:\Users\Usuario\Documents\UiPath\MiProyecto
  ```

### Advertencia: "Actividades sin mapear"

**Causa:** Actividades UiPath no están en el mapeo

**Solución:**
- Estas actividades se crearán como `custom_component`
- Puedes mapearlas manualmente después
- O agregar el mapeo en `activityMapping`

### Selectores no funcionan

**Causa:** Conversión de selectores UiPath → CSS

**Solución:**
- Revisa el selector en la vista previa
- Edita manualmente después de importar
- UiPath usa selectores más complejos que CSS

### Duración incorrecta

**Causa:** Parsing de TimeSpan

**Solución:**
- Verifica el formato en UiPath: `HH:MM:SS`
- Edita manualmente el valor `duration` en milisegundos

## 📈 Mejoras Futuras

1. **Parser XML completo**
   - Usar librería XML nativa de Node.js
   - Parsear estructura completa del workflow
   - Detectar relaciones entre actividades

2. **Más actividades soportadas**
   - SAP, Citrix, Terminal
   - OCR avanzado
   - Machine Learning

3. **Conversión bidireccional**
   - Alqvimia → UiPath
   - Exportar a formato XAML

4. **Validación avanzada**
   - Detectar dependencias
   - Verificar compatibilidad
   - Sugerir optimizaciones

5. **Interfaz gráfica de mapeo**
   - Drag & drop para mapear actividades
   - Preview en tiempo real
   - Edición de configuración antes de importar

## 🔐 Seguridad

- ✅ Validación de rutas de archivos
- ✅ Sanitización de nombres
- ✅ No ejecuta código UiPath directamente
- ✅ Solo lee archivos XAML y JSON
- ⚠️ Revisa workflows importados antes de ejecutar
- ⚠️ Verifica credenciales y datos sensibles

## 📞 Soporte

¿Problemas con la migración?

- 📧 Email: soporte@alqvimia.com
- 📚 Documentación: https://docs.alqvimia.com/migracion
- 💬 Chat: https://chat.alqvimia.com
- 🐛 Issues: https://github.com/alqvimia/rpa/issues

---

**Creado con ❤️ por el equipo de Alqvimia**

*Versión 1.0.0 - Diciembre 2025*

## 🎯 Resumen Rápido

| Característica | Descripción |
|----------------|-------------|
| **Métodos** | XAML (recomendado) y JSON |
| **Actividades** | 30+ mapeadas automáticamente |
| **Análisis** | Completo con estadísticas |
| **Vista Previa** | Paso a paso detallado |
| **Importación** | Individual o masiva |
| **Tasa de Mapeo** | Típicamente 80-95% |
| **Tiempo** | ~30 segundos para 14 workflows |

¡Migra tus proyectos UiPath a Alqvimia en minutos! 🚀
