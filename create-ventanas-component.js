// Script para crear el componente "Ventanas"
// Genera un componente para detectar ventanas y pestañas abiertas del navegador

const fs = require('fs');
const path = require('path');

// Definición del componente "Ventanas"
const ventanasComponent = {
    id: 'windows_ventanas_' + Date.now().toString(36),
    title: 'Ventanas',
    icon: 'fa-window-restore',
    category: 'windows',
    description: 'Detecta y lista todas las ventanas y pestañas abiertas del navegador',
    generatedAt: new Date().toISOString(),
    prompt: 'Componente para detectar ventanas abiertas del navegador y listar todas las pestañas',
    properties: [
        {
            name: 'action',
            label: 'Acción',
            type: 'select',
            required: true,
            default: 'list_all',
            options: [
                { value: 'list_all', label: 'Listar todas las ventanas y pestañas' },
                { value: 'get_active', label: 'Obtener ventana activa' },
                { value: 'count_tabs', label: 'Contar pestañas abiertas' },
                { value: 'filter_by_url', label: 'Filtrar por URL' },
                { value: 'filter_by_title', label: 'Filtrar por título' }
            ],
            placeholder: 'Selecciona la acción a realizar',
            description: 'Tipo de operación a realizar sobre las ventanas'
        },
        {
            name: 'filter',
            label: 'Filtro (opcional)',
            type: 'text',
            required: false,
            default: '',
            placeholder: 'Ej: google.com o *facebook*',
            description: 'Texto para filtrar ventanas/pestañas (solo si seleccionaste filtrar)'
        },
        {
            name: 'includeDetails',
            label: 'Incluir detalles completos',
            type: 'checkbox',
            required: false,
            default: true,
            description: 'Incluir URL, título, ID y estado de cada pestaña'
        },
        {
            name: 'outputVariable',
            label: 'Variable de salida',
            type: 'text',
            required: true,
            default: 'ventanas',
            placeholder: 'Nombre de la variable',
            description: 'Nombre de la variable donde se guardará el resultado'
        },
        {
            name: 'format',
            label: 'Formato de salida',
            type: 'select',
            required: false,
            default: 'json',
            options: [
                { value: 'json', label: 'JSON (objeto completo)' },
                { value: 'array', label: 'Array de objetos' },
                { value: 'count', label: 'Solo cantidad' },
                { value: 'urls', label: 'Solo URLs' },
                { value: 'titles', label: 'Solo títulos' }
            ],
            description: 'Cómo se formateará la información de salida'
        }
    ]
};

console.log('📦 Creando componente "Ventanas"...\n');
console.log('Detalles del componente:');
console.log('- ID:', ventanasComponent.id);
console.log('- Título:', ventanasComponent.title);
console.log('- Categoría:', ventanasComponent.category);
console.log('- Icono:', ventanasComponent.icon);
console.log('- Propiedades:', ventanasComponent.properties.length);
console.log('');

// Leer el archivo HTML principal para inyectar el componente
const indexPath = path.join(__dirname, 'public', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Crear script de inicialización del componente
const initScript = `
<script>
// 🪟 COMPONENTE VENTANAS - Auto-generado
(function() {
    const ventanasComponent = ${JSON.stringify(ventanasComponent, null, 2)};

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVentanasComponent);
    } else {
        initVentanasComponent();
    }

    function initVentanasComponent() {
        // Esperar a que MCPProperties esté disponible
        const checkInterval = setInterval(() => {
            if (typeof MCPProperties !== 'undefined') {
                clearInterval(checkInterval);

                // Registrar el componente
                MCPProperties[ventanasComponent.id] = ventanasComponent;

                console.log('✅ Componente "Ventanas" registrado:', ventanasComponent.id);

                // Guardar en localStorage
                let generatedComponents = [];
                const saved = localStorage.getItem('generated_components');
                if (saved) {
                    try {
                        generatedComponents = JSON.parse(saved);
                    } catch (e) {
                        console.error('Error parsing generated_components:', e);
                    }
                }

                // Verificar si ya existe
                const exists = generatedComponents.some(c => c.title === 'Ventanas');
                if (!exists) {
                    generatedComponents.push(ventanasComponent);
                    localStorage.setItem('generated_components', JSON.stringify(generatedComponents));
                    console.log('💾 Componente "Ventanas" guardado en localStorage');

                    // Disparar evento para actualizar la UI
                    document.dispatchEvent(new Event('componentsUpdated'));
                }
            }
        }, 100);

        // Timeout de seguridad
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
})();
</script>
`;

// Buscar dónde insertar el script (antes del cierre de </body>)
if (!indexContent.includes('COMPONENTE VENTANAS')) {
    indexContent = indexContent.replace('</body>', initScript + '\n</body>');
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    console.log('✅ Script de inicialización inyectado en index.html');
} else {
    console.log('⚠️  El componente "Ventanas" ya existe en index.html');
}

// Crear archivo JSON con la definición del componente
const componentJsonPath = path.join(__dirname, 'public', 'components', 'ventanas.json');
const componentsDir = path.join(__dirname, 'public', 'components');

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}

fs.writeFileSync(componentJsonPath, JSON.stringify(ventanasComponent, null, 2), 'utf-8');
console.log('✅ Definición guardada en:', componentJsonPath);

console.log('\n🎉 ¡Componente "Ventanas" creado exitosamente!\n');
console.log('📋 Cómo usarlo:');
console.log('1. Recarga la aplicación (F5 en el navegador)');
console.log('2. Abre el Workflow Editor');
console.log('3. Busca "Ventanas" en la categoría "🪟 Acciones Windows"');
console.log('4. Arrastra el componente al workflow');
console.log('5. Configura la acción que deseas realizar');
console.log('\n✨ El componente puede:');
console.log('   - Listar todas las ventanas y pestañas abiertas');
console.log('   - Obtener solo la ventana activa');
console.log('   - Contar cuántas pestañas hay abiertas');
console.log('   - Filtrar ventanas por URL o título');
console.log('   - Exportar datos en diferentes formatos (JSON, Array, etc.)');
console.log('');
