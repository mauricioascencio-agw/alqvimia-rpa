/**
 * 📦 PLANTILLAS DE COMPONENTES - Alqvimia RPA
 *
 * Plantillas predefinidas para generar componentes comunes rápidamente.
 *
 * USO:
 *   node plantillas-componentes.js [nombre-plantilla]
 *
 * Ejemplo:
 *   node plantillas-componentes.js whatsapp
 */

const GeneradorComponentes = require('./generar-componentes.js');
const readline = require('readline');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

// Plantillas predefinidas
const plantillas = {
    'whatsapp': {
        title: 'Enviar WhatsApp',
        category: 'mcp',
        icon: 'fa-whatsapp',
        description: 'Envía mensajes a través de WhatsApp Business API',
        properties: [
            {
                name: 'phoneNumber',
                label: 'Número de Teléfono',
                type: 'text',
                required: true,
                placeholder: '+5215512345678'
            },
            {
                name: 'message',
                label: 'Mensaje',
                type: 'textarea',
                required: true,
                placeholder: 'Escribe tu mensaje aquí...'
            },
            {
                name: 'mediaUrl',
                label: 'URL de Imagen/Video (opcional)',
                type: 'text',
                required: false,
                placeholder: 'https://ejemplo.com/imagen.jpg'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: false,
                placeholder: 'resultadoWhatsApp'
            }
        ]
    },

    'telegram': {
        title: 'Enviar Telegram',
        category: 'mcp',
        icon: 'fa-telegram',
        description: 'Envía mensajes a través de Telegram Bot API',
        properties: [
            {
                name: 'chatId',
                label: 'Chat ID',
                type: 'text',
                required: true,
                placeholder: '123456789'
            },
            {
                name: 'message',
                label: 'Mensaje',
                type: 'textarea',
                required: true,
                placeholder: 'Escribe tu mensaje aquí...'
            },
            {
                name: 'parseMode',
                label: 'Formato de Texto',
                type: 'select',
                required: false,
                options: [
                    { value: 'text', label: 'Texto plano' },
                    { value: 'HTML', label: 'HTML' },
                    { value: 'Markdown', label: 'Markdown' }
                ]
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: false,
                placeholder: 'resultadoTelegram'
            }
        ]
    },

    'email': {
        title: 'Enviar Email',
        category: 'mcp',
        icon: 'fa-envelope',
        description: 'Envía correos electrónicos via SMTP',
        properties: [
            {
                name: 'to',
                label: 'Destinatario',
                type: 'text',
                required: true,
                placeholder: 'usuario@ejemplo.com'
            },
            {
                name: 'subject',
                label: 'Asunto',
                type: 'text',
                required: true,
                placeholder: 'Asunto del correo'
            },
            {
                name: 'body',
                label: 'Cuerpo del Mensaje',
                type: 'textarea',
                required: true,
                placeholder: 'Contenido del correo...'
            },
            {
                name: 'cc',
                label: 'CC (opcional)',
                type: 'text',
                required: false,
                placeholder: 'copia@ejemplo.com'
            },
            {
                name: 'attachments',
                label: 'Adjuntos (rutas separadas por coma)',
                type: 'text',
                required: false,
                placeholder: 'C:\\docs\\archivo.pdf'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: false,
                placeholder: 'resultadoEmail'
            }
        ]
    },

    'excel-leer': {
        title: 'Leer Excel',
        category: 'excel',
        icon: 'fa-file-excel',
        description: 'Lee datos de un archivo Excel',
        properties: [
            {
                name: 'filePath',
                label: 'Ruta del Archivo',
                type: 'text_or_variable',
                required: true,
                placeholder: 'C:\\datos\\archivo.xlsx'
            },
            {
                name: 'sheetName',
                label: 'Nombre de la Hoja',
                type: 'text',
                required: false,
                placeholder: 'Hoja1'
            },
            {
                name: 'range',
                label: 'Rango (opcional)',
                type: 'text',
                required: false,
                placeholder: 'A1:D10'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: true,
                placeholder: 'datosExcel'
            }
        ]
    },

    'excel-escribir': {
        title: 'Escribir Excel',
        category: 'excel',
        icon: 'fa-file-excel',
        description: 'Escribe datos en un archivo Excel',
        properties: [
            {
                name: 'filePath',
                label: 'Ruta del Archivo',
                type: 'text_or_variable',
                required: true,
                placeholder: 'C:\\datos\\archivo.xlsx'
            },
            {
                name: 'sheetName',
                label: 'Nombre de la Hoja',
                type: 'text',
                required: false,
                placeholder: 'Hoja1'
            },
            {
                name: 'cell',
                label: 'Celda',
                type: 'text',
                required: true,
                placeholder: 'A1'
            },
            {
                name: 'value',
                label: 'Valor',
                type: 'text_or_variable',
                required: true,
                placeholder: 'Valor a escribir'
            }
        ]
    },

    'api-rest': {
        title: 'Llamada API REST',
        category: 'mcp',
        icon: 'fa-exchange-alt',
        description: 'Realiza llamadas a APIs REST',
        properties: [
            {
                name: 'url',
                label: 'URL',
                type: 'text',
                required: true,
                placeholder: 'https://api.ejemplo.com/endpoint'
            },
            {
                name: 'method',
                label: 'Método',
                type: 'select',
                required: true,
                options: [
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' },
                    { value: 'PATCH', label: 'PATCH' }
                ]
            },
            {
                name: 'headers',
                label: 'Headers (JSON)',
                type: 'textarea',
                required: false,
                placeholder: '{"Authorization": "Bearer token"}'
            },
            {
                name: 'body',
                label: 'Body (JSON)',
                type: 'textarea',
                required: false,
                placeholder: '{"key": "value"}'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: true,
                placeholder: 'respuestaAPI'
            }
        ]
    },

    'database-query': {
        title: 'Consulta Base de Datos',
        category: 'data',
        icon: 'fa-database',
        description: 'Ejecuta consultas SQL en base de datos',
        properties: [
            {
                name: 'connectionString',
                label: 'Cadena de Conexión',
                type: 'text',
                required: true,
                placeholder: 'Server=localhost;Database=midb;'
            },
            {
                name: 'query',
                label: 'Consulta SQL',
                type: 'textarea',
                required: true,
                placeholder: 'SELECT * FROM tabla WHERE id = ?'
            },
            {
                name: 'parameters',
                label: 'Parámetros (JSON)',
                type: 'textarea',
                required: false,
                placeholder: '[1, "valor"]'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: true,
                placeholder: 'resultadoQuery'
            }
        ]
    },

    'archivo-leer': {
        title: 'Leer Archivo',
        category: 'files',
        icon: 'fa-file-alt',
        description: 'Lee contenido de un archivo de texto',
        properties: [
            {
                name: 'filePath',
                label: 'Ruta del Archivo',
                type: 'text_or_variable',
                required: true,
                placeholder: 'C:\\docs\\archivo.txt'
            },
            {
                name: 'encoding',
                label: 'Codificación',
                type: 'select',
                required: false,
                options: [
                    { value: 'utf8', label: 'UTF-8' },
                    { value: 'ascii', label: 'ASCII' },
                    { value: 'latin1', label: 'Latin1' }
                ]
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: true,
                placeholder: 'contenidoArchivo'
            }
        ]
    },

    'archivo-escribir': {
        title: 'Escribir Archivo',
        category: 'files',
        icon: 'fa-file-alt',
        description: 'Escribe contenido en un archivo de texto',
        properties: [
            {
                name: 'filePath',
                label: 'Ruta del Archivo',
                type: 'text_or_variable',
                required: true,
                placeholder: 'C:\\docs\\archivo.txt'
            },
            {
                name: 'content',
                label: 'Contenido',
                type: 'textarea',
                required: true,
                placeholder: 'Contenido a escribir...'
            },
            {
                name: 'append',
                label: 'Agregar al final (no sobrescribir)',
                type: 'checkbox',
                required: false
            }
        ]
    },

    'web-navegacion': {
        title: 'Navegar URL',
        category: 'web',
        icon: 'fa-globe',
        description: 'Navega a una URL específica',
        properties: [
            {
                name: 'url',
                label: 'URL',
                type: 'text',
                required: true,
                placeholder: 'https://www.ejemplo.com'
            },
            {
                name: 'waitForLoad',
                label: 'Esperar carga completa',
                type: 'checkbox',
                required: false
            },
            {
                name: 'timeout',
                label: 'Timeout (ms)',
                type: 'number',
                required: false,
                placeholder: '30000'
            }
        ]
    },

    'validar-email': {
        title: 'Validar Email',
        category: 'data',
        icon: 'fa-check-circle',
        description: 'Valida si un email tiene formato correcto',
        properties: [
            {
                name: 'email',
                label: 'Email',
                type: 'text_or_variable',
                required: true,
                placeholder: 'usuario@ejemplo.com'
            },
            {
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: true,
                placeholder: 'emailValido'
            }
        ]
    },

    'delay': {
        title: 'Esperar',
        category: 'flow',
        icon: 'fa-clock',
        description: 'Pausa la ejecución por un tiempo determinado',
        properties: [
            {
                name: 'duration',
                label: 'Duración (ms)',
                type: 'number',
                required: true,
                placeholder: '1000'
            },
            {
                name: 'description',
                label: 'Descripción (opcional)',
                type: 'text',
                required: false,
                placeholder: 'Esperando respuesta...'
            }
        ]
    },

    'log': {
        title: 'Escribir Log',
        category: 'flow',
        icon: 'fa-file-text',
        description: 'Registra un mensaje en el log del sistema',
        properties: [
            {
                name: 'message',
                label: 'Mensaje',
                type: 'textarea',
                required: true,
                placeholder: 'Mensaje para el log...'
            },
            {
                name: 'level',
                label: 'Nivel',
                type: 'select',
                required: false,
                options: [
                    { value: 'info', label: 'Info' },
                    { value: 'warning', label: 'Warning' },
                    { value: 'error', label: 'Error' },
                    { value: 'debug', label: 'Debug' }
                ]
            }
        ]
    }
};

class PlantillasComponentes {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    mostrarBanner() {
        console.clear();
        console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}📦 PLANTILLAS DE COMPONENTES - Alqvimia RPA${colors.reset}              ${colors.cyan}║${colors.reset}`);
        console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
        console.log('');
    }

    mostrarPlantillas() {
        console.log(`${colors.yellow}📋 PLANTILLAS DISPONIBLES:${colors.reset}\n`);

        const categoriasAgrupadas = {};

        Object.keys(plantillas).forEach(key => {
            const plantilla = plantillas[key];
            const categoria = plantilla.category;

            if (!categoriasAgrupadas[categoria]) {
                categoriasAgrupadas[categoria] = [];
            }

            categoriasAgrupadas[categoria].push({ key, plantilla });
        });

        Object.entries(categoriasAgrupadas).forEach(([categoria, items]) => {
            console.log(`\n${colors.bright}${colors.blue}${categoria.toUpperCase()}:${colors.reset}`);
            items.forEach(({ key, plantilla }) => {
                console.log(`  ${colors.green}${key.padEnd(20)}${colors.reset} ${plantilla.icon} ${plantilla.title}`);
                console.log(`    ${colors.cyan}${plantilla.description}${colors.reset}`);
            });
        });

        console.log('');
    }

    pregunta(texto) {
        return new Promise((resolve) => {
            this.rl.question(`${colors.bright}${texto}${colors.reset}`, (respuesta) => {
                resolve(respuesta.trim());
            });
        });
    }

    async ejecutar(plantillaNombre) {
        this.mostrarBanner();

        if (!plantillaNombre) {
            this.mostrarPlantillas();
            plantillaNombre = await this.pregunta('\nSelecciona una plantilla: ');
        }

        const plantilla = plantillas[plantillaNombre.toLowerCase()];

        if (!plantilla) {
            console.log(`${colors.red}❌ Plantilla no encontrada: ${plantillaNombre}${colors.reset}`);
            this.rl.close();
            return;
        }

        console.log(`\n${colors.green}✓ Plantilla seleccionada: ${plantilla.title}${colors.reset}`);
        console.log(`${colors.cyan}${plantilla.description}${colors.reset}\n`);

        const personalizar = await this.pregunta('¿Deseas personalizar el nombre? (s/n): ');

        let config = { ...plantilla };

        if (personalizar.toLowerCase() === 's') {
            const nuevoNombre = await this.pregunta('Nuevo nombre: ');
            if (nuevoNombre) {
                config.title = nuevoNombre;
            }
        }

        console.log(`\n${colors.yellow}Generando componente...${colors.reset}`);

        try {
            const componente = GeneradorComponentes.crearComponenteProgramatico(config);

            console.log(`\n${colors.green}${colors.bright}✓ ¡Componente creado exitosamente!${colors.reset}`);
            console.log(`\n${colors.bright}ID:${colors.reset} ${componente.id}`);
            console.log(`${colors.bright}Título:${colors.reset} ${componente.title}`);
            console.log(`${colors.bright}Categoría:${colors.reset} ${componente.category}`);
            console.log(`${colors.bright}Propiedades:${colors.reset} ${componente.properties.length}`);
            console.log('');

        } catch (error) {
            console.log(`${colors.red}❌ Error al crear componente: ${error.message}${colors.reset}`);
        }

        this.rl.close();
    }

    static obtenerPlantilla(nombre) {
        return plantillas[nombre.toLowerCase()];
    }

    static listarPlantillas() {
        return Object.keys(plantillas);
    }
}

// Exportar
module.exports = { PlantillasComponentes, plantillas };

// Ejecutar si se llama directamente
if (require.main === module) {
    const plantillaNombre = process.argv[2];
    const gestor = new PlantillasComponentes();

    gestor.ejecutar(plantillaNombre).catch(error => {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    });
}
