/**
 * Lazy Loader - Sistema de carga inteligente para evitar freezing
 * Solo carga módulos cuando se necesitan
 */

const LazyLoader = {
    loadedModules: new Set(),
    pendingModules: new Map(),

    /**
     * Registra un módulo para carga lazy
     */
    register(moduleName, initFunction, dependencies = []) {
        this.pendingModules.set(moduleName, {
            init: initFunction,
            deps: dependencies,
            loaded: false
        });
    },

    /**
     * Carga un módulo y sus dependencias
     */
    async load(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            console.log(`⚡ Módulo ${moduleName} ya cargado`);
            return;
        }

        const module = this.pendingModules.get(moduleName);
        if (!module) {
            console.warn(`⚠️ Módulo ${moduleName} no encontrado`);
            return;
        }

        // Cargar dependencias primero
        for (const dep of module.deps) {
            if (!this.loadedModules.has(dep)) {
                await this.load(dep);
            }
        }

        // Inicializar módulo
        console.log(`🚀 Cargando módulo: ${moduleName}`);
        try {
            await module.init();
            this.loadedModules.add(moduleName);
            module.loaded = true;
            console.log(`✅ Módulo ${moduleName} cargado`);
        } catch (error) {
            console.error(`❌ Error cargando ${moduleName}:`, error);
        }
    },

    /**
     * Carga módulos cuando se activa una vista
     */
    loadForView(viewName) {
        const viewModules = {
            'spy': ['element-spy'],
            'recorder': ['recorder'],
            'workflows': ['workflow-studio', 'workflow-editor'],
            'executor': ['executor'],
            'library': ['library'],
            'ai-dashboard': ['ai-dashboard', 'ai-config-manager'],
            'omnichannel': ['omnichannel-ui', 'video-conference']
        };

        const modules = viewModules[viewName] || [];
        console.log(`📦 Cargando módulos para vista ${viewName}:`, modules);

        modules.forEach(mod => this.load(mod));
    },

    /**
     * Pre-carga módulos críticos en segundo plano
     */
    preloadCritical() {
        const critical = ['workflow-studio'];
        setTimeout(() => {
            critical.forEach(mod => this.load(mod));
        }, 2000); // Cargar después de 2 segundos de la carga inicial
    }
};

// Exponer globalmente
window.LazyLoader = LazyLoader;
