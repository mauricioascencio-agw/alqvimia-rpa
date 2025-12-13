const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const WorkflowEngine = require('./engine/workflow-engine');
const RecorderEngine = require('./engine/recorder-engine');
const { getInstance: getOmnichannelInstance } = require('./mcp');

// Importar rutas de videoconferencia
const videoConferenceRoutes = require('./video-conference-routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Servir archivos de workflows (para grabaciones de video)
app.use('/files', express.static(path.join(__dirname, '../workflows')));

// Instancias de los motores
const workflowEngine = new WorkflowEngine();
const recorderEngine = new RecorderEngine();

// Instancia del sistema de omnicanalidad (se inicializa bajo demanda)
let omnichannelSystem = null;

// Socket.IO para comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('start-recording', () => {
    recorderEngine.startRecording(socket);
  });

  socket.on('stop-recording', () => {
    const actions = recorderEngine.stopRecording();
    socket.emit('recording-stopped', actions);
  });

  socket.on('execute-workflow', async (workflow) => {
    try {
      await workflowEngine.execute(workflow, (status) => {
        socket.emit('workflow-status', status);
      });
      socket.emit('workflow-completed', { success: true });
    } catch (error) {
      socket.emit('workflow-error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// API REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Element Spy RPA Server Running' });
});

app.post('/api/workflows/save', (req, res) => {
  try {
    const { name, workflow } = req.body;
    const id = workflowEngine.saveWorkflow(name, workflow);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/workflows', (req, res) => {
  const workflows = workflowEngine.getWorkflows();
  res.json({ success: true, workflows });
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflowEngine.getWorkflow(req.params.id);
  if (workflow) {
    res.json({ success: true, workflow });
  } else {
    res.status(404).json({ success: false, error: 'Workflow no encontrado' });
  }
});

app.delete('/api/workflows/:id', (req, res) => {
  try {
    workflowEngine.deleteWorkflow(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para guardar proyecto profesional con estructura de carpetas
app.post('/api/projects/save', async (req, res) => {
  try {
    const { projectFolder, projectName, projectData } = req.body;

    // Crear estructura de carpetas
    const projectPath = path.join(projectFolder, projectName);

    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(path.join(projectPath, 'images'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'objects'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'screenshots'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'logs'), { recursive: true }); // 📋 NUEVO: Carpeta para logs

    // Guardar main.json
    await fs.writeFile(
      path.join(projectPath, 'main.json'),
      JSON.stringify(projectData.main, null, 2)
    );

    // Guardar config.json
    await fs.writeFile(
      path.join(projectPath, 'config.json'),
      JSON.stringify(projectData.config, null, 2)
    );

    // Guardar objetos individuales
    if (projectData.objects && Array.isArray(projectData.objects)) {
      for (const obj of projectData.objects) {
        await fs.writeFile(
          path.join(projectPath, 'objects', `${obj.varName}.json`),
          JSON.stringify(obj, null, 2)
        );
      }
    }

    // 📋 NUEVO: Guardar logs de eventos
    if (projectData.logs && Array.isArray(projectData.logs)) {
      // Guardar todos los logs en un archivo
      await fs.writeFile(
        path.join(projectPath, 'logs', 'events.json'),
        JSON.stringify(projectData.logs, null, 2)
      );

      // Guardar resumen de logs por tipo
      const logSummary = {};
      projectData.logs.forEach(log => {
        logSummary[log.eventType] = (logSummary[log.eventType] || 0) + 1;
      });

      await fs.writeFile(
        path.join(projectPath, 'logs', 'summary.json'),
        JSON.stringify({
          totalEvents: projectData.logs.length,
          eventsByType: logSummary,
          generated: new Date().toISOString()
        }, null, 2)
      );

      // Guardar logs en formato legible (texto)
      let logText = '# LOG DE EVENTOS - ' + projectData.main.name + '\n\n';
      logText += 'Generado: ' + new Date().toISOString() + '\n';
      logText += 'Total de eventos: ' + projectData.logs.length + '\n\n';
      logText += '═'.repeat(80) + '\n\n';

      projectData.logs.forEach((log, index) => {
        logText += `[${index + 1}] ${log.timestamp}\n`;
        logText += `Tipo: ${log.eventType}\n`;
        logText += `Detalles: ${JSON.stringify(log.details, null, 2)}\n`;
        if (log.windowState && log.windowState.status === 'open') {
          logText += `Ventana: ${log.windowState.innerWidth}x${log.windowState.innerHeight} @ ${log.windowState.url}\n`;
        }
        logText += '─'.repeat(80) + '\n\n';
      });

      await fs.writeFile(
        path.join(projectPath, 'logs', 'events.log'),
        logText
      );
    }

    res.json({
      success: true,
      message: 'Proyecto guardado exitosamente',
      path: projectPath,
      stats: {
        actions: projectData.main.totalActions,
        objects: projectData.objects?.length || 0,
        images: projectData.images?.length || 0,
        events: projectData.logs?.length || 0
      }
    });
  } catch (error) {
    console.error('Error guardando proyecto:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para guardar configuraciones en /Adminconfig
app.post('/api/settings/save', async (req, res) => {
  try {
    const { settings, timestamp } = req.body;

    // Crear carpeta Adminconfig en la raíz del proyecto
    const adminConfigPath = path.join(__dirname, '../Adminconfig');
    await fs.mkdir(adminConfigPath, { recursive: true });

    // Guardar configuraciones con timestamp
    const configData = {
      settings,
      lastModified: timestamp || new Date().toISOString(),
      version: '1.0.0'
    };

    await fs.writeFile(
      path.join(adminConfigPath, 'app-settings.json'),
      JSON.stringify(configData, null, 2)
    );

    // También guardar backup con fecha
    const backupFileName = `settings-backup-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
    await fs.writeFile(
      path.join(adminConfigPath, backupFileName),
      JSON.stringify(configData, null, 2)
    );

    res.json({
      success: true,
      message: 'Configuraciones guardadas exitosamente',
      path: adminConfigPath
    });
  } catch (error) {
    console.error('Error guardando configuraciones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para cargar configuraciones desde archivo
app.get('/api/settings/load', async (req, res) => {
  try {
    const adminConfigPath = path.join(__dirname, '../Adminconfig');
    const settingsFile = path.join(adminConfigPath, 'app-settings.json');

    try {
      const data = await fs.readFile(settingsFile, 'utf8');
      const configData = JSON.parse(data);
      res.json({ success: true, data: configData });
    } catch (error) {
      // Si no existe el archivo, devolver configuración por defecto
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('Error cargando configuraciones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// ENDPOINTS DE IA/OCR CONFIGURATION
// ========================================

// Guardar configuración de IA/OCR
app.post('/api/ai-config/save', async (req, res) => {
  try {
    const { provider, config, updatedAt } = req.body;

    // Crear carpeta Adminconfig si no existe
    const adminConfigPath = path.join(__dirname, '../Adminconfig');
    await fs.mkdir(adminConfigPath, { recursive: true });

    // Guardar configuración (sin exponer claves sensibles en logs)
    const configData = {
      provider,
      config, // Esto incluye las API keys, se guarda encriptado en producción
      updatedAt: updatedAt || new Date().toISOString(),
      version: '1.0.0'
    };

    await fs.writeFile(
      path.join(adminConfigPath, 'ai-ocr-config.json'),
      JSON.stringify(configData, null, 2)
    );

    console.log(`✅ Configuración de IA guardada: ${provider}`);

    res.json({
      success: true,
      message: 'Configuración guardada exitosamente',
      provider
    });
  } catch (error) {
    console.error('Error guardando configuración de IA:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cargar configuración de IA/OCR
app.get('/api/ai-config/load', async (req, res) => {
  try {
    const adminConfigPath = path.join(__dirname, '../Adminconfig');
    const configFile = path.join(adminConfigPath, 'ai-ocr-config.json');

    try {
      const data = await fs.readFile(configFile, 'utf8');
      const configData = JSON.parse(data);

      // En producción, aquí se desencriptarían las claves
      res.json({ success: true, data: configData });
    } catch (error) {
      // Si no existe el archivo, devolver null
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('Error cargando configuración de IA:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Probar conexión con proveedor de IA
app.post('/api/ai-config/test', async (req, res) => {
  try {
    const { provider, config } = req.body;

    console.log(`🧪 Probando conexión con ${provider}...`);

    // Aquí se haría la prueba real de conexión con cada proveedor
    // Por ahora, simulamos una prueba exitosa

    let result = { success: true };

    switch (provider) {
      case 'claude':
        // Simular prueba de Claude API
        if (!config.apiKey || !config.apiKey.startsWith('sk-ant-')) {
          result = {
            success: false,
            error: 'API Key inválida. Debe comenzar con "sk-ant-"'
          };
        } else {
          result = {
            success: true,
            details: `Conexión exitosa con ${config.model || 'Claude 3.5 Sonnet'}`
          };
        }
        break;

      case 'openai':
        if (!config.apiKey || !config.apiKey.startsWith('sk-')) {
          result = {
            success: false,
            error: 'API Key inválida. Debe comenzar con "sk-"'
          };
        } else {
          result = {
            success: true,
            details: `Conexión exitosa con ${config.model || 'GPT-4o'}`
          };
        }
        break;

      case 'google':
        if (!config.apiKey) {
          result = {
            success: false,
            error: 'API Key requerida'
          };
        } else {
          result = {
            success: true,
            details: 'Conexión exitosa con Google Cloud Vision'
          };
        }
        break;

      case 'azure':
        if (!config.endpoint || !config.apiKey) {
          result = {
            success: false,
            error: 'Endpoint y API Key requeridos'
          };
        } else {
          result = {
            success: true,
            details: `Conexión exitosa con Azure Document Intelligence (${config.model})`
          };
        }
        break;

      case 'tesseract':
        // Tesseract es local, siempre disponible
        result = {
          success: true,
          details: 'Tesseract OCR configurado correctamente (local)'
        };
        break;

      default:
        result = {
          success: false,
          error: `Proveedor no soportado: ${provider}`
        };
    }

    console.log(result.success ? '✅ Prueba exitosa' : '❌ Prueba fallida');

    res.json(result);
  } catch (error) {
    console.error('Error probando conexión:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// ENDPOINTS DE BASE DE DATOS
// ========================================

// Probar conexión a base de datos
app.post('/api/database/test-connection', async (req, res) => {
  try {
    const { type, host, port, username, password, database, ssl } = req.body;

    // Simulación de prueba de conexión (en producción usarías las librerías reales)
    // mysql2, pg, tedious, mongodb, oracledb, etc.

    // Simular conexión exitosa con información del servidor
    const serverVersions = {
      mysql: 'MySQL 8.0.32',
      postgresql: 'PostgreSQL 15.2',
      sqlserver: 'Microsoft SQL Server 2022',
      mongodb: 'MongoDB 6.0.4',
      oracle: 'Oracle Database 21c',
      mariadb: 'MariaDB 10.11.2'
    };

    // Simular delay de conexión
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      message: 'Conexión exitosa',
      serverVersion: serverVersions[type] || 'Unknown',
      host,
      port
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar bases de datos disponibles en el servidor
app.post('/api/database/list-databases', async (req, res) => {
  try {
    const { type, host, port, username, database } = req.body;

    // Simulación de obtener lista de bases de datos
    // En producción, ejecutarías: SHOW DATABASES (MySQL) o equivalente

    const mockDatabases = [
      'information_schema',
      'mysql',
      'performance_schema',
      'sys',
      'mi_aplicacion',
      'analytics',
      'customers_db',
      'products_db'
    ];

    res.json({
      success: true,
      databases: mockDatabases
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Conectar a base de datos y listar esquemas/bases
app.post('/api/database/connect', async (req, res) => {
  try {
    const { type, host, port, username, database } = req.body;

    // Simulación de obtener lista de bases de datos
    // En producción, ejecutarías: SHOW DATABASES (MySQL) o equivalente

    const mockDatabases = [
      'information_schema',
      'mysql',
      'performance_schema',
      'sys',
      'mi_aplicacion',
      'analytics',
      'customers_db',
      'products_db'
    ];

    res.json({
      success: true,
      databases: mockDatabases,
      connectionId: Date.now().toString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar tablas de una base de datos
app.post('/api/database/list-tables', async (req, res) => {
  try {
    const { connectionId, database } = req.body;

    // Simulación de SHOW TABLES
    const mockTables = [
      { name: 'users', type: 'TABLE', rows: 15423 },
      { name: 'products', type: 'TABLE', rows: 8932 },
      { name: 'orders', type: 'TABLE', rows: 45621 },
      { name: 'order_items', type: 'TABLE', rows: 123456 },
      { name: 'categories', type: 'TABLE', rows: 234 },
      { name: 'reviews', type: 'TABLE', rows: 34521 },
      { name: 'active_users_view', type: 'VIEW', rows: null }
    ];

    res.json({
      success: true,
      tables: mockTables
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener estructura de tabla
app.post('/api/database/table-structure', async (req, res) => {
  try {
    const { connectionId, database, table } = req.body;

    // Simulación de DESCRIBE TABLE
    const mockColumns = [
      { Field: 'id', Type: 'int(11)', Null: 'NO', Key: 'PRI', Default: null, Extra: 'auto_increment' },
      { Field: 'username', Type: 'varchar(50)', Null: 'NO', Key: 'UNI', Default: null, Extra: '' },
      { Field: 'email', Type: 'varchar(100)', Null: 'NO', Key: 'UNI', Default: null, Extra: '' },
      { Field: 'password', Type: 'varchar(255)', Null: 'NO', Key: '', Default: null, Extra: '' },
      { Field: 'created_at', Type: 'timestamp', Null: 'NO', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' },
      { Field: 'updated_at', Type: 'timestamp', Null: 'YES', Key: '', Default: null, Extra: 'on update CURRENT_TIMESTAMP' }
    ];

    res.json({
      success: true,
      columns: mockColumns,
      indexes: [
        { name: 'PRIMARY', column: 'id', type: 'PRIMARY KEY' },
        { name: 'username_UNIQUE', column: 'username', type: 'UNIQUE' },
        { name: 'email_UNIQUE', column: 'email', type: 'UNIQUE' }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ejecutar query
app.post('/api/database/execute-query', async (req, res) => {
  try {
    const { connectionId, query } = req.body;

    // Simulación de ejecución de query
    // En producción, ejecutarías la query real con protección contra SQL Injection

    const mockResults = [
      { id: 1, username: 'admin', email: 'admin@example.com', created_at: '2024-01-15 10:30:00' },
      { id: 2, username: 'john_doe', email: 'john@example.com', created_at: '2024-02-20 14:45:00' },
      { id: 3, username: 'jane_smith', email: 'jane@example.com', created_at: '2024-03-10 09:15:00' },
      { id: 4, username: 'bob_wilson', email: 'bob@example.com', created_at: '2024-04-05 16:20:00' },
      { id: 5, username: 'alice_brown', email: 'alice@example.com', created_at: '2024-05-12 11:00:00' }
    ];

    res.json({
      success: true,
      results: mockResults,
      rowCount: mockResults.length,
      executionTime: '0.025s'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Exportar datos
app.post('/api/database/export', async (req, res) => {
  try {
    const { format, database, table } = req.body;

    // Simulación: En producción, consultarías la tabla real
    const mockData = [
      { id: 1, username: 'admin', email: 'admin@example.com', created_at: '2024-01-15 10:30:00' },
      { id: 2, username: 'john_doe', email: 'john@example.com', created_at: '2024-02-20 14:45:00' },
      { id: 3, username: 'jane_smith', email: 'jane@example.com', created_at: '2024-03-10 09:15:00' },
      { id: 4, username: 'bob_wilson', email: 'bob@example.com', created_at: '2024-04-05 16:20:00' },
      { id: 5, username: 'alice_brown', email: 'alice@example.com', created_at: '2024-05-12 11:00:00' }
    ];

    // Crear carpeta de exportaciones
    const exportsPath = path.join(__dirname, '../exports');
    await fs.mkdir(exportsPath, { recursive: true });

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const tableName = table || 'export';
    let fileName, filePath;

    switch (format) {
      case 'csv': {
        fileName = `${tableName}_${timestamp}.csv`;
        filePath = path.join(exportsPath, fileName);
        const csvContent = convertToCSV(mockData);
        await fs.writeFile(filePath, csvContent);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(csvContent);
        break;
      }
      case 'json': {
        fileName = `${tableName}_${timestamp}.json`;
        filePath = path.join(exportsPath, fileName);
        const jsonContent = JSON.stringify(mockData, null, 2);
        await fs.writeFile(filePath, jsonContent);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(jsonContent);
        break;
      }
      case 'excel': {
        fileName = `${tableName}_${timestamp}.xlsx`;
        filePath = path.join(exportsPath, fileName);
        // En producción usarías una librería como 'xlsx'
        // Por ahora generamos un CSV con extensión xlsx para demo
        const csvContent = convertToCSV(mockData);
        await fs.writeFile(filePath, csvContent);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(csvContent);
        break;
      }
      case 'pdf': {
        fileName = `${tableName}_${timestamp}.pdf`;
        filePath = path.join(exportsPath, fileName);
        // Generar PDF simple
        const pdfContent = generateSimplePDF(mockData, tableName, database);
        await fs.writeFile(filePath, pdfContent);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(pdfContent);
        break;
      }
      default:
        throw new Error('Formato no soportado');
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Función auxiliar para convertir a CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Agregar encabezados
  csvRows.push(headers.join(','));

  // Agregar filas
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return `"${value}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

// Función auxiliar para generar PDF simple (sin librería externa)
function generateSimplePDF(data, tableName, database) {
  if (!data || data.length === 0) return Buffer.from('');

  // Generar un PDF básico manualmente usando la especificación PDF
  const headers = Object.keys(data[0]);
  const date = new Date().toLocaleDateString('es-ES');

  // Crear contenido del documento
  let pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<< /Length 5 0 R >>
stream
BT
/F2 16 Tf
50 750 Td
(Exportacion de Base de Datos) Tj
0 -20 Td
/F1 12 Tf
(Tabla: ${tableName}) Tj
0 -15 Td
(Base de Datos: ${database || 'N/A'}) Tj
0 -15 Td
(Fecha: ${date}) Tj
0 -15 Td
(Total de registros: ${data.length}) Tj
0 -30 Td
/F2 10 Tf
`;

  // Agregar headers
  let xPos = 0;
  headers.forEach(header => {
    pdfContent += `(${header}) Tj ${xPos} 0 Td `;
    xPos += 80;
  });

  pdfContent += `
0 -15 Td
/F1 9 Tf
`;

  // Agregar datos (máximo 30 filas para no exceder límites del PDF simple)
  const maxRows = Math.min(data.length, 30);
  for (let i = 0; i < maxRows; i++) {
    xPos = 0;
    headers.forEach(header => {
      const value = String(data[i][header] || '').substring(0, 15);
      pdfContent += `(${value}) Tj ${xPos} 0 Td `;
      xPos += 80;
    });
    pdfContent += `0 -12 Td `;
  }

  if (data.length > 30) {
    pdfContent += `
0 -20 Td
/F1 10 Tf
(... y ${data.length - 30} registros mas) Tj
`;
  }

  pdfContent += `
ET
endstream
endobj
5 0 obj
${pdfContent.length}
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
0000${String(pdfContent.length + 400).padStart(10, '0')} 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${pdfContent.length + 450}
%%EOF`;

  return Buffer.from(pdfContent, 'utf-8');
}

// ========================================
// ENDPOINTS DE OMNICANALIDAD (MCP)
// ========================================

// Inicializar sistema de omnicanalidad
app.post('/api/omnichannel/initialize', async (req, res) => {
  try {
    const { config } = req.body;

    if (!omnichannelSystem) {
      omnichannelSystem = getOmnichannelInstance();
    }

    const result = await omnichannelSystem.initialize(config);

    res.json(result);
  } catch (error) {
    console.error('Error al inicializar omnicanalidad:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener estado de los canales
app.get('/api/omnichannel/status', (req, res) => {
  try {
    if (!omnichannelSystem) {
      return res.json({
        success: true,
        initialized: false,
        channels: { whatsapp: { enabled: false }, telegram: { enabled: false } }
      });
    }

    const status = omnichannelSystem.getChannelsStatus();
    const stats = omnichannelSystem.getStats();

    res.json({
      success: true,
      initialized: true,
      channels: status,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener QR de WhatsApp
app.get('/api/omnichannel/whatsapp/qr', (req, res) => {
  try {
    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const qr = omnichannelSystem.getWhatsAppQR();

    if (!qr) {
      return res.json({ success: false, message: 'QR no disponible aún' });
    }

    res.json({ success: true, qr });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar mensaje
app.post('/api/omnichannel/send-message', async (req, res) => {
  try {
    const { channel, recipient, message, options } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendMessage(channel, recipient, message, options);

    res.json(result);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar mensaje con template
app.post('/api/omnichannel/send-template', async (req, res) => {
  try {
    const { channel, recipient, templateName, variables } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendTemplateMessage(
      channel,
      recipient,
      templateName,
      variables
    );

    res.json(result);
  } catch (error) {
    console.error('Error al enviar template:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener conversaciones
app.get('/api/omnichannel/conversations', (req, res) => {
  try {
    const { channel } = req.query;

    if (!omnichannelSystem) {
      return res.json({ success: true, conversations: [] });
    }

    const conversations = omnichannelSystem.getConversations(channel);

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener conversación específica
app.get('/api/omnichannel/conversations/:id', (req, res) => {
  try {
    if (!omnichannelSystem) {
      return res.status(404).json({ success: false, error: 'Conversación no encontrada' });
    }

    const conversation = omnichannelSystem.getConversation(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversación no encontrada' });
    }

    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar template
app.post('/api/omnichannel/templates', (req, res) => {
  try {
    const { name, template } = req.body;

    if (!omnichannelSystem) {
      omnichannelSystem = getOmnichannelInstance();
    }

    omnichannelSystem.registerTemplate(name, template);

    res.json({ success: true, message: `Template "${name}" registrado` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registrar webhook
app.post('/api/omnichannel/webhooks', (req, res) => {
  try {
    const { event, url } = req.body;

    if (!omnichannelSystem) {
      omnichannelSystem = getOmnichannelInstance();
    }

    // Registrar webhook que hace POST al URL proporcionado
    omnichannelSystem.registerWebhook(event, async (data) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        console.log(`Webhook ${event} enviado a ${url}:`, response.status);
      } catch (error) {
        console.error(`Error en webhook ${event}:`, error);
      }
    });

    res.json({ success: true, message: `Webhook registrado para evento "${event}"` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar media por WhatsApp
app.post('/api/omnichannel/whatsapp/send-media', async (req, res) => {
  try {
    const { to, mediaPath, caption, options } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendWhatsAppMedia(to, mediaPath, caption, options);

    res.json(result);
  } catch (error) {
    console.error('Error al enviar media WhatsApp:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar foto por Telegram
app.post('/api/omnichannel/telegram/send-photo', async (req, res) => {
  try {
    const { chatId, photo, options } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendTelegramPhoto(chatId, photo, options);

    res.json(result);
  } catch (error) {
    console.error('Error al enviar foto Telegram:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar documento por Telegram
app.post('/api/omnichannel/telegram/send-document', async (req, res) => {
  try {
    const { chatId, document, options } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendTelegramDocument(chatId, document, options);

    res.json(result);
  } catch (error) {
    console.error('Error al enviar documento Telegram:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enviar mensaje con botones en Telegram
app.post('/api/omnichannel/telegram/send-buttons', async (req, res) => {
  try {
    const { chatId, text, buttons, options } = req.body;

    if (!omnichannelSystem) {
      return res.status(400).json({ success: false, error: 'Sistema no inicializado' });
    }

    const result = await omnichannelSystem.sendTelegramMessageWithButtons(
      chatId,
      text,
      buttons,
      options
    );

    res.json(result);
  } catch (error) {
    console.error('Error al enviar mensaje con botones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cerrar sistema de omnicanalidad
app.post('/api/omnichannel/shutdown', async (req, res) => {
  try {
    if (omnichannelSystem) {
      await omnichannelSystem.shutdown();
      omnichannelSystem = null;
    }

    res.json({ success: true, message: 'Sistema de omnicanalidad cerrado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================================
// RUTAS DE VIDEOCONFERENCIA
// ========================================
app.use('/api/video-conference', videoConferenceRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║            🤖 ELEMENT SPY - RPA AUTOMATION TOOL 🤖             ║
║                    Tipo Alqvimia                              ║
║                                                                ║
║  Servidor corriendo en: http://localhost:${PORT}              ║
║                                                                ║
║  Características:                                              ║
║  ✓ Element Inspector & Spy                                     ║
║  ✓ Grabación de acciones                                       ║
║  ✓ Ejecución de workflows                                      ║
║  ✓ Automatización web                                          ║
║  ✓ Exportación/Importación de scripts                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
