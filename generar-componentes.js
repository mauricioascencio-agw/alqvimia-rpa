/**
 * 🤖 GENERADOR DE COMPONENTES - Alqvimia RPA
 *
 * Script para generar componentes automáticamente para el sistema RPA.
 * Crea componentes con propiedades personalizadas y los integra automáticamente.
 *
 * USO:
 *   node generar-componentes.js
 *
 * O incluir en tu proyecto y usar programáticamente.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuración de colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

class GeneradorComponentes {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.categorias = {
            '1': { id: 'web', nombre: 'Web Automation', icono: 'fa-globe', prefijo: 'web_' },
            '2': { id: 'windows', nombre: 'Windows', icono: 'fa-window-maximize', prefijo: 'windows_' },
            '3': { id: 'excel', nombre: 'Excel', icono: 'fa-file-excel', prefijo: 'excel_' },
            '4': { id: 'files', nombre: 'Files', icono: 'fa-folder', prefijo: 'files_' },
            '5': { id: 'data', nombre: 'Data Processing', icono: 'fa-database', prefijo: 'data_' },
            '6': { id: 'flow', nombre: 'Flow Control', icono: 'fa-random', prefijo: 'flow_' },
            '7': { id: 'mcp', nombre: 'MCP Connectors', icono: 'fa-plug', prefijo: 'mcp_' },
            '8': { id: 'custom', nombre: 'Custom', icono: 'fa-cog', prefijo: 'custom_' }
        };

        this.tiposPropiedad = {
            '1': { tipo: 'text', descripcion: 'Texto simple' },
            '2': { tipo: 'textarea', descripcion: 'Área de texto (multilínea)' },
            '3': { tipo: 'number', descripcion: 'Número' },
            '4': { tipo: 'password', descripcion: 'Contraseña (oculto)' },
            '5': { tipo: 'checkbox', descripcion: 'Casilla de verificación' },
            '6': { tipo: 'text_or_variable', descripcion: 'Texto o Variable' },
            '7': { tipo: 'select', descripcion: 'Lista desplegable' },
            '8': { tipo: 'datetime-local', descripcion: 'Fecha y hora' }
        };

        this.componente = {
            id: '',
            title: '',
            icon: '',
            category: '',
            properties: [],
            description: '',
            generatedAt: new Date().toISOString()
        };
    }

    // Mostrar banner
    mostrarBanner() {
        console.clear();
        console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.cyan}║${colors.reset}  ${colors.bright}🤖 GENERADOR DE COMPONENTES - Alqvimia RPA${colors.reset}                 ${colors.cyan}║${colors.reset}`);
        console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
        console.log('');
    }

    // Promesa para readline
    pregunta(texto) {
        return new Promise((resolve) => {
            this.rl.question(`${colors.bright}${texto}${colors.reset}`, (respuesta) => {
                resolve(respuesta.trim());
            });
        });
    }

    // Mostrar menú de categorías
    async seleccionarCategoria() {
        console.log(`\n${colors.yellow}📂 CATEGORÍAS DISPONIBLES:${colors.reset}\n`);

        Object.entries(this.categorias).forEach(([key, cat]) => {
            console.log(`  ${colors.green}[${key}]${colors.reset} ${cat.icono} ${cat.nombre}`);
        });

        console.log('');
        const seleccion = await this.pregunta('Selecciona una categoría (1-8): ');

        if (!this.categorias[seleccion]) {
            console.log(`${colors.red}❌ Categoría inválida. Usando "Custom" por defecto.${colors.reset}`);
            return this.categorias['8'];
        }

        return this.categorias[seleccion];
    }

    // Generar ID único
    generarId(categoria, nombre) {
        const slug = nombre
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');

        const timestamp = Date.now().toString(36);
        return `${categoria.prefijo}${slug}_${timestamp}`;
    }

    // Obtener información básica del componente
    async obtenerInformacionBasica() {
        console.log(`\n${colors.yellow}📝 INFORMACIÓN BÁSICA DEL COMPONENTE:${colors.reset}\n`);

        this.componente.title = await this.pregunta('Nombre del componente: ');

        if (!this.componente.title) {
            console.log(`${colors.red}❌ El nombre es obligatorio.${colors.reset}`);
            return false;
        }

        const categoria = await this.seleccionarCategoria();
        this.componente.category = categoria.id;
        this.componente.icon = categoria.icono;
        this.componente.id = this.generarId(categoria, this.componente.title);

        console.log(`\n${colors.blue}ID generado: ${this.componente.id}${colors.reset}`);

        this.componente.description = await this.pregunta('Descripción (opcional): ');

        return true;
    }

    // Agregar propiedades
    async agregarPropiedades() {
        console.log(`\n${colors.yellow}⚙️  PROPIEDADES DEL COMPONENTE:${colors.reset}\n`);
        console.log(`${colors.cyan}Agrega las propiedades que tendrá tu componente.${colors.reset}`);
        console.log(`${colors.cyan}Deja en blanco el nombre para terminar.${colors.reset}\n`);

        while (true) {
            const nombreProp = await this.pregunta(`\nNombre de la propiedad (o Enter para terminar): `);

            if (!nombreProp) {
                break;
            }

            const propiedad = await this.crearPropiedad(nombreProp);
            this.componente.properties.push(propiedad);

            console.log(`${colors.green}✓ Propiedad "${nombreProp}" agregada${colors.reset}`);
        }

        // Agregar propiedad resultVariable por defecto si no hay ninguna
        if (this.componente.properties.length === 0) {
            console.log(`\n${colors.yellow}⚠️  No se agregaron propiedades. Agregando "resultVariable" por defecto.${colors.reset}`);
            this.componente.properties.push({
                name: 'resultVariable',
                label: 'Variable de Resultado',
                type: 'text',
                required: false,
                placeholder: 'nombreVariable'
            });
        }
    }

    // Crear una propiedad
    async crearPropiedad(nombre) {
        console.log(`\n${colors.blue}Tipos de propiedad:${colors.reset}`);

        Object.entries(this.tiposPropiedad).forEach(([key, tipo]) => {
            console.log(`  ${colors.green}[${key}]${colors.reset} ${tipo.descripcion}`);
        });

        console.log('');
        const tipoSeleccion = await this.pregunta('Tipo de propiedad (1-8, default: 1): ') || '1';
        const tipoProp = this.tiposPropiedad[tipoSeleccion] || this.tiposPropiedad['1'];

        const label = await this.pregunta('Etiqueta (visible en UI): ') || nombre;
        const placeholder = await this.pregunta('Placeholder (opcional): ');
        const requerida = await this.pregunta('¿Es requerida? (s/n, default: n): ');

        const propiedad = {
            name: nombre,
            label: label,
            type: tipoProp.tipo,
            required: requerida.toLowerCase() === 's',
            placeholder: placeholder || undefined
        };

        // Si es select, pedir opciones
        if (tipoProp.tipo === 'select') {
            propiedad.options = await this.obtenerOpciones();
        }

        return propiedad;
    }

    // Obtener opciones para select
    async obtenerOpciones() {
        console.log(`\n${colors.cyan}Ingresa las opciones (formato: valor:etiqueta, Enter para terminar)${colors.reset}`);
        const opciones = [];

        while (true) {
            const opcion = await this.pregunta('Opción: ');
            if (!opcion) break;

            const partes = opcion.split(':');
            opciones.push({
                value: partes[0].trim(),
                label: partes[1] ? partes[1].trim() : partes[0].trim()
            });
        }

        return opciones;
    }

    // Mostrar resumen
    mostrarResumen() {
        console.log(`\n${colors.yellow}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.bright}📋 RESUMEN DEL COMPONENTE:${colors.reset}`);
        console.log(`${colors.yellow}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`\n${colors.bright}ID:${colors.reset} ${this.componente.id}`);
        console.log(`${colors.bright}Nombre:${colors.reset} ${this.componente.title}`);
        console.log(`${colors.bright}Categoría:${colors.reset} ${this.componente.category}`);
        console.log(`${colors.bright}Icono:${colors.reset} ${this.componente.icon}`);

        if (this.componente.description) {
            console.log(`${colors.bright}Descripción:${colors.reset} ${this.componente.description}`);
        }

        console.log(`\n${colors.bright}Propiedades (${this.componente.properties.length}):${colors.reset}`);
        this.componente.properties.forEach((prop, index) => {
            const requerida = prop.required ? `${colors.red}*${colors.reset}` : '';
            console.log(`  ${index + 1}. ${prop.name} (${prop.type})${requerida} - ${prop.label}`);
        });
        console.log('');
    }

    // Guardar componente
    async guardarComponente() {
        const dirDestino = path.join(__dirname, 'public', 'js', 'components');

        // Crear directorio si no existe
        if (!fs.existsSync(dirDestino)) {
            fs.mkdirSync(dirDestino, { recursive: true });
        }

        const nombreArchivo = `${this.componente.id}.json`;
        const rutaArchivo = path.join(dirDestino, nombreArchivo);

        try {
            fs.writeFileSync(rutaArchivo, JSON.stringify(this.componente, null, 2));
            console.log(`${colors.green}✓ Componente guardado en: ${rutaArchivo}${colors.reset}`);

            // También guardar en la lista de componentes generados
            await this.agregarAListaGenerados();

            return true;
        } catch (error) {
            console.log(`${colors.red}❌ Error al guardar: ${error.message}${colors.reset}`);
            return false;
        }
    }

    // Agregar a la lista de componentes generados
    async agregarAListaGenerados() {
        const rutaLista = path.join(__dirname, 'public', 'js', 'components', 'generated-components.json');

        let lista = [];
        if (fs.existsSync(rutaLista)) {
            try {
                const contenido = fs.readFileSync(rutaLista, 'utf8');
                lista = JSON.parse(contenido);
            } catch (error) {
                console.log(`${colors.yellow}⚠️  No se pudo leer la lista anterior, creando nueva.${colors.reset}`);
            }
        }

        // Agregar nuevo componente
        lista.push(this.componente);

        // Guardar lista actualizada
        fs.writeFileSync(rutaLista, JSON.stringify(lista, null, 2));
        console.log(`${colors.green}✓ Componente agregado a la lista de generados${colors.reset}`);
    }

    // Generar código de integración
    generarCodigoIntegracion() {
        console.log(`\n${colors.yellow}═══════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.bright}📄 CÓDIGO DE INTEGRACIÓN:${colors.reset}`);
        console.log(`${colors.yellow}═══════════════════════════════════════════════════════════${colors.reset}`);

        console.log(`\n${colors.cyan}1. Agregar al HTML (si no está ya incluido):${colors.reset}\n`);
        console.log(`<script src="/js/components/component-integrator.js"></script>`);

        console.log(`\n${colors.cyan}2. El componente se cargará automáticamente desde:${colors.reset}\n`);
        console.log(`/js/components/generated-components.json`);

        console.log(`\n${colors.cyan}3. O cargar manualmente en JavaScript:${colors.reset}\n`);
        console.log(`fetch('/js/components/${this.componente.id}.json')
    .then(res => res.json())
    .then(component => {
        ComponentIntegrator.registerComponent(component);
        console.log('Componente cargado:', component.title);
    });`);

        console.log('');
    }

    // Proceso principal
    async ejecutar() {
        this.mostrarBanner();

        console.log(`${colors.cyan}Este asistente te ayudará a crear un componente personalizado.${colors.reset}`);
        console.log(`${colors.cyan}Responde las preguntas para configurar tu componente.${colors.reset}\n`);

        // Obtener información básica
        if (!await this.obtenerInformacionBasica()) {
            this.rl.close();
            return;
        }

        // Agregar propiedades
        await this.agregarPropiedades();

        // Mostrar resumen
        this.mostrarResumen();

        // Confirmar
        const confirmar = await this.pregunta(`${colors.bright}¿Deseas guardar este componente? (s/n): ${colors.reset}`);

        if (confirmar.toLowerCase() === 's') {
            if (await this.guardarComponente()) {
                this.generarCodigoIntegracion();
                console.log(`\n${colors.green}${colors.bright}✓ ¡Componente creado exitosamente!${colors.reset}\n`);
            }
        } else {
            console.log(`\n${colors.yellow}Operación cancelada.${colors.reset}\n`);
        }

        this.rl.close();
    }

    // Modo API - Crear componente programáticamente
    static crearComponenteProgramatico(config) {
        const generador = new GeneradorComponentes();

        if (!config.title || !config.category) {
            throw new Error('Se requiere title y category');
        }

        const categoria = Object.values(generador.categorias).find(c => c.id === config.category)
                       || generador.categorias['8'];

        generador.componente = {
            id: config.id || generador.generarId(categoria, config.title),
            title: config.title,
            icon: config.icon || categoria.icono,
            category: config.category,
            properties: config.properties || [],
            description: config.description || '',
            generatedAt: new Date().toISOString()
        };

        // Guardar sin confirmación
        const dirDestino = path.join(__dirname, 'public', 'js', 'components');
        if (!fs.existsSync(dirDestino)) {
            fs.mkdirSync(dirDestino, { recursive: true });
        }

        const rutaArchivo = path.join(dirDestino, `${generador.componente.id}.json`);
        fs.writeFileSync(rutaArchivo, JSON.stringify(generador.componente, null, 2));

        return generador.componente;
    }
}

// Exportar para uso programático
module.exports = GeneradorComponentes;

// Si se ejecuta directamente
if (require.main === module) {
    const generador = new GeneradorComponentes();
    generador.ejecutar().catch(error => {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    });
}
