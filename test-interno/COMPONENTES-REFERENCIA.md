# 📚 Referencia de Componentes - Alqvimia RPA

**Fecha de generación**: 13/12/2025, 19:42:56

## 📊 Resumen

Total de componentes: 50

## 📁 Componentes por Categoría

### 🌐 Web

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `browser_open` | Abrir Navegador | url, browser |
| `navigate` | Navegar a URL | url |
| `browser_close` | Cerrar Navegador | Ninguna |
| `browser_refresh` | Refrescar Página | Ninguna |
| `click` | Click | selector |
| `type` | Escribir Texto | selector, text |
| `send_keys` | Enviar Teclas | keys |
| `select_option` | Seleccionar Opción | selector, value |
| `checkbox_check` | Marcar Checkbox | selector |
| `checkbox_uncheck` | Desmarcar Checkbox | selector |
| `hover` | Hover sobre Elemento | selector |
| `scroll` | Scroll | direction |
| `wait_for_element` | Esperar Elemento | selector, timeout |
| `execute_javascript` | Ejecutar JavaScript | code |

### 📊 Datos

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `extract_text` | Extraer Texto | selector, variableName |
| `extract_attribute` | Extraer Atributo | selector, attribute, variableName |
| `extract_data` | Extraer Datos | selector |
| `scrape_table` | Scraping de Tabla | selector |
| `excel_open` | Abrir Excel | path |
| `excel_read` | Leer Excel | sheet, range |
| `excel_write` | Escribir Excel | sheet, range, data |
| `excel_append` | Agregar a Excel | sheet, data |
| `read_file` | Leer Archivo | path |
| `write_file` | Escribir Archivo | path, content |
| `file_exists` | Archivo Existe | path |
| `delete_file` | Eliminar Archivo | path |
| `copy_file` | Copiar Archivo | source, destination |
| `move_file` | Mover Archivo | source, destination |
| `pdf_read` | Leer PDF | path |

### 💾 Variables

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `set_variable` | Asignar Variable | variableName, value |
| `get_variable` | Obtener Variable | variableName |

### 🔀 Lógica

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `if_condition` | Condición If | condition |
| `while_loop` | Bucle While | condition |
| `do_while_loop` | Bucle Do-While | condition |
| `for_each` | For Each | array, itemVariable |
| `switch_case` | Switch Case | variable, cases |

### ⚙️ General

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `wait` | Esperar | duration |
| `screenshot` | Captura de Pantalla | path |
| `custom_script` | Script Personalizado | code |
| `log_message` | Registrar Mensaje | message, level |

### 🔌 API

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `http_request` | Petición HTTP | method, url |
| `invoke_api` | Invocar API | endpoint, method |

### 📧 Comunicación

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `send_email` | Enviar Email | to, subject, body |
| `get_email` | Obtener Email | folder |
| `omnichannel_send` | Enviar Mensaje Omnicanal | channel, message |
| `omnichannel_receive` | Recibir Mensaje Omnicanal | channel |

### 🤖 IA

| Componente | Título | Propiedades Requeridas |
|-----------|--------|------------------------|
| `pdf_ocr` | OCR de PDF | path |
| `ai_claude` | Claude AI | prompt, model |
| `ai_gpt` | GPT | prompt, model |
| `ai_gemini` | Gemini | prompt |

## 🔧 Detalles de Propiedades

### `browser_open`

**Título**: Abrir Navegador

**Categoría**: Web

**Ícono**: fas fa-globe

**Propiedades requeridas**:

- `url`
- `browser`

---

### `navigate`

**Título**: Navegar a URL

**Categoría**: Web

**Ícono**: fas fa-compass

**Propiedades requeridas**:

- `url`

---

### `browser_close`

**Título**: Cerrar Navegador

**Categoría**: Web

**Ícono**: fas fa-times-circle

**Sin propiedades requeridas**

---

### `browser_refresh`

**Título**: Refrescar Página

**Categoría**: Web

**Ícono**: fas fa-sync

**Sin propiedades requeridas**

---

### `click`

**Título**: Click

**Categoría**: Web

**Ícono**: fas fa-mouse-pointer

**Propiedades requeridas**:

- `selector`

---

### `type`

**Título**: Escribir Texto

**Categoría**: Web

**Ícono**: fas fa-keyboard

**Propiedades requeridas**:

- `selector`
- `text`

---

### `send_keys`

**Título**: Enviar Teclas

**Categoría**: Web

**Ícono**: fas fa-keyboard

**Propiedades requeridas**:

- `keys`

---

### `select_option`

**Título**: Seleccionar Opción

**Categoría**: Web

**Ícono**: fas fa-list

**Propiedades requeridas**:

- `selector`
- `value`

---

### `checkbox_check`

**Título**: Marcar Checkbox

**Categoría**: Web

**Ícono**: fas fa-check-square

**Propiedades requeridas**:

- `selector`

---

### `checkbox_uncheck`

**Título**: Desmarcar Checkbox

**Categoría**: Web

**Ícono**: far fa-square

**Propiedades requeridas**:

- `selector`

---

### `hover`

**Título**: Hover sobre Elemento

**Categoría**: Web

**Ícono**: fas fa-hand-pointer

**Propiedades requeridas**:

- `selector`

---

### `scroll`

**Título**: Scroll

**Categoría**: Web

**Ícono**: fas fa-arrows-alt-v

**Propiedades requeridas**:

- `direction`

---

### `extract_text`

**Título**: Extraer Texto

**Categoría**: Datos

**Ícono**: fas fa-file-alt

**Propiedades requeridas**:

- `selector`
- `variableName`

---

### `extract_attribute`

**Título**: Extraer Atributo

**Categoría**: Datos

**Ícono**: fas fa-tag

**Propiedades requeridas**:

- `selector`
- `attribute`
- `variableName`

---

### `extract_data`

**Título**: Extraer Datos

**Categoría**: Datos

**Ícono**: fas fa-download

**Propiedades requeridas**:

- `selector`

---

### `scrape_table`

**Título**: Scraping de Tabla

**Categoría**: Datos

**Ícono**: fas fa-table

**Propiedades requeridas**:

- `selector`

---

### `set_variable`

**Título**: Asignar Variable

**Categoría**: Variables

**Ícono**: fas fa-database

**Propiedades requeridas**:

- `variableName`
- `value`

---

### `get_variable`

**Título**: Obtener Variable

**Categoría**: Variables

**Ícono**: fas fa-database

**Propiedades requeridas**:

- `variableName`

---

### `if_condition`

**Título**: Condición If

**Categoría**: Lógica

**Ícono**: fas fa-code-branch

**Propiedades requeridas**:

- `condition`

---

### `while_loop`

**Título**: Bucle While

**Categoría**: Lógica

**Ícono**: fas fa-sync-alt

**Propiedades requeridas**:

- `condition`

---

### `do_while_loop`

**Título**: Bucle Do-While

**Categoría**: Lógica

**Ícono**: fas fa-redo

**Propiedades requeridas**:

- `condition`

---

### `for_each`

**Título**: For Each

**Categoría**: Lógica

**Ícono**: fas fa-list

**Propiedades requeridas**:

- `array`
- `itemVariable`

---

### `switch_case`

**Título**: Switch Case

**Categoría**: Lógica

**Ícono**: fas fa-random

**Propiedades requeridas**:

- `variable`
- `cases`

---

### `wait`

**Título**: Esperar

**Categoría**: General

**Ícono**: fas fa-clock

**Propiedades requeridas**:

- `duration`

---

### `wait_for_element`

**Título**: Esperar Elemento

**Categoría**: Web

**Ícono**: fas fa-hourglass-half

**Propiedades requeridas**:

- `selector`
- `timeout`

---

### `screenshot`

**Título**: Captura de Pantalla

**Categoría**: General

**Ícono**: fas fa-camera

**Propiedades requeridas**:

- `path`

---

### `excel_open`

**Título**: Abrir Excel

**Categoría**: Datos

**Ícono**: fas fa-file-excel

**Propiedades requeridas**:

- `path`

---

### `excel_read`

**Título**: Leer Excel

**Categoría**: Datos

**Ícono**: fas fa-file-excel

**Propiedades requeridas**:

- `sheet`
- `range`

---

### `excel_write`

**Título**: Escribir Excel

**Categoría**: Datos

**Ícono**: fas fa-file-excel

**Propiedades requeridas**:

- `sheet`
- `range`
- `data`

---

### `excel_append`

**Título**: Agregar a Excel

**Categoría**: Datos

**Ícono**: fas fa-file-excel

**Propiedades requeridas**:

- `sheet`
- `data`

---

### `read_file`

**Título**: Leer Archivo

**Categoría**: Datos

**Ícono**: fas fa-file

**Propiedades requeridas**:

- `path`

---

### `write_file`

**Título**: Escribir Archivo

**Categoría**: Datos

**Ícono**: fas fa-file

**Propiedades requeridas**:

- `path`
- `content`

---

### `file_exists`

**Título**: Archivo Existe

**Categoría**: Datos

**Ícono**: fas fa-search

**Propiedades requeridas**:

- `path`

---

### `delete_file`

**Título**: Eliminar Archivo

**Categoría**: Datos

**Ícono**: fas fa-trash

**Propiedades requeridas**:

- `path`

---

### `copy_file`

**Título**: Copiar Archivo

**Categoría**: Datos

**Ícono**: fas fa-copy

**Propiedades requeridas**:

- `source`
- `destination`

---

### `move_file`

**Título**: Mover Archivo

**Categoría**: Datos

**Ícono**: fas fa-exchange-alt

**Propiedades requeridas**:

- `source`
- `destination`

---

### `http_request`

**Título**: Petición HTTP

**Categoría**: API

**Ícono**: fas fa-globe

**Propiedades requeridas**:

- `method`
- `url`

---

### `invoke_api`

**Título**: Invocar API

**Categoría**: API

**Ícono**: fas fa-plug

**Propiedades requeridas**:

- `endpoint`
- `method`

---

### `send_email`

**Título**: Enviar Email

**Categoría**: Comunicación

**Ícono**: fas fa-envelope

**Propiedades requeridas**:

- `to`
- `subject`
- `body`

---

### `get_email`

**Título**: Obtener Email

**Categoría**: Comunicación

**Ícono**: fas fa-inbox

**Propiedades requeridas**:

- `folder`

---

### `pdf_read`

**Título**: Leer PDF

**Categoría**: Datos

**Ícono**: fas fa-file-pdf

**Propiedades requeridas**:

- `path`

---

### `pdf_ocr`

**Título**: OCR de PDF

**Categoría**: IA

**Ícono**: fas fa-eye

**Propiedades requeridas**:

- `path`

---

### `custom_script`

**Título**: Script Personalizado

**Categoría**: General

**Ícono**: fas fa-code

**Propiedades requeridas**:

- `code`

---

### `execute_javascript`

**Título**: Ejecutar JavaScript

**Categoría**: Web

**Ícono**: fab fa-js

**Propiedades requeridas**:

- `code`

---

### `log_message`

**Título**: Registrar Mensaje

**Categoría**: General

**Ícono**: fas fa-file-alt

**Propiedades requeridas**:

- `message`
- `level`

---

### `ai_claude`

**Título**: Claude AI

**Categoría**: IA

**Ícono**: fas fa-brain

**Propiedades requeridas**:

- `prompt`
- `model`

---

### `ai_gpt`

**Título**: GPT

**Categoría**: IA

**Ícono**: fas fa-robot

**Propiedades requeridas**:

- `prompt`
- `model`

---

### `ai_gemini`

**Título**: Gemini

**Categoría**: IA

**Ícono**: fas fa-gem

**Propiedades requeridas**:

- `prompt`

---

### `omnichannel_send`

**Título**: Enviar Mensaje Omnicanal

**Categoría**: Comunicación

**Ícono**: fas fa-comments

**Propiedades requeridas**:

- `channel`
- `message`

---

### `omnichannel_receive`

**Título**: Recibir Mensaje Omnicanal

**Categoría**: Comunicación

**Ícono**: fas fa-inbox

**Propiedades requeridas**:

- `channel`

---

