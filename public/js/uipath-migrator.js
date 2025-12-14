/**
 * Sistema de Migración Multi-Plataforma RPA
 * Soporta: UiPath, Automation Anywhere, Blue Prism, Rocket, Python
 */

class RPAMigrator {
    constructor() {
        this.project = null;
        this.workflows = [];
        this.mappedWorkflows = [];
        this.projectPath = '';
        this.selectedPlatform = null;
        this.selectedFolder = null;

        // Configuración de plataformas
        this.platforms = {
            uipath: {
                name: 'UiPath',
                extensions: ['.xaml'],
                projectFile: 'project.json'
            },
            automationanywhere: {
                name: 'Automation Anywhere',
                extensions: ['.atmx', '.bot'],
                projectFile: 'metadata.json'
            },
            blueprism: {
                name: 'Blue Prism',
                extensions: ['.bprelease', '.xml'],
                projectFile: 'process.xml'
            },
            power: {
                name: 'Power Automate',
                extensions: ['.json'],
                projectFile: 'definition.json'
            },
            python: {
                name: 'Python / Selenium',
                extensions: ['.py'],
                projectFile: 'main.py'
            },
            json: {
                name: 'JSON / XML',
                extensions: ['.json', '.xml'],
                projectFile: null
            }
        };

        // Mapeo de actividades UiPath → Alqvimia
        this.activityMapping = {
            // Navegación Web
            'ui:OpenBrowser': 'browser_open',
            'ui:NavigateTo': 'navigate',
            'ui:CloseBrowser': 'browser_close',
            'ui:RefreshBrowser': 'browser_refresh',

            // Interacción Web
            'ui:Click': 'click',
            'ui:TypeInto': 'type',
            'ui:SendHotkey': 'send_keys',
            'ui:SelectItem': 'select_option',
            'ui:Check': 'checkbox_check',
            'ui:Uncheck': 'checkbox_uncheck',
            'ui:Hover': 'hover',

            // Extracción de Datos
            'ui:GetText': 'extract_text',
            'ui:GetAttribute': 'extract_attribute',
            'ui:GetFullText': 'extract_data',
            'ui:DataScraping': 'scrape_table',

            // Variables y Datos
            'Assign': 'set_variable',
            'ui:GetVariable': 'get_variable',
            'ui:SetVariable': 'set_variable',

            // Control de Flujo
            'If': 'if_condition',
            'While': 'while_loop',
            'DoWhile': 'do_while_loop',
            'ForEach': 'for_each',
            'Switch': 'switch_case',

            // Esperas
            'Delay': 'wait',
            'ui:WaitForElement': 'wait_for_element',

            // Capturas
            'ui:TakeScreenshot': 'screenshot',

            // Excel
            'ui:ExcelApplicationScope': 'excel_open',
            'ui:ExcelReadRange': 'excel_read',
            'ui:ExcelWriteRange': 'excel_write',
            'ui:ExcelAppendRange': 'excel_append',

            // Archivos
            'ui:ReadTextFile': 'read_file',
            'ui:WriteTextFile': 'write_file',
            'ui:FileExists': 'file_exists',
            'ui:DeleteFile': 'delete_file',
            'ui:CopyFile': 'copy_file',
            'ui:MoveFile': 'move_file',

            // HTTP/API
            'ui:HttpRequest': 'http_request',
            'ui:InvokeMethod': 'invoke_api',

            // Email
            'ui:SendMail': 'send_email',
            'ui:GetMail': 'get_email',

            // PDF
            'ui:ReadPDFText': 'pdf_read',
            'ui:ReadPDFWithOCR': 'pdf_ocr',

            // JavaScript
            'ui:InvokeCode': 'custom_script',
            'ui:ExecuteJavaScript': 'execute_javascript',

            // Logging
            'ui:LogMessage': 'log_message',
            'ui:WriteLine': 'log_message'
        };
    }

    /**
     * Inicializa el migrador
     */
    init() {
        const migrateBtn = document.getElementById('migrateFromPlatform');
        if (migrateBtn) {
            migrateBtn.addEventListener('click', () => this.openMigrationModal());
        }

        // Event listeners para las tarjetas de plataformas
        const platformCards = ['uipath', 'automationanywhere', 'blueprism', 'power', 'python', 'json'];
        platformCards.forEach(platform => {
            const card = document.querySelector(`.platform-card[data-platform="${platform}"]`);
            if (card) {
                card.addEventListener('click', () => this.selectPlatform(platform));
            }
        });

        // Event listener para el botón de selección de carpeta
        const selectFolderBtn = document.getElementById('selectFolderBtn');
        if (selectFolderBtn) {
            selectFolderBtn.addEventListener('click', () => this.openFolderDialog());
        }

        // Event listener para cuando se selecciona una carpeta
        const folderInput = document.getElementById('folderInput');
        if (folderInput) {
            folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));
        }

        // Event listener para confirmar carpeta
        const confirmFolderBtn = document.getElementById('confirmFolderBtn');
        if (confirmFolderBtn) {
            confirmFolderBtn.addEventListener('click', () => this.confirmFolderAndAnalyze());
        }

        // Event listener para volver a selección de plataformas
        const backToPlatformsBtn = document.getElementById('backToPlatformsBtn');
        if (backToPlatformsBtn) {
            backToPlatformsBtn.addEventListener('click', () => this.showPlatformSelection());
        }

        // Event listeners para cerrar el modal
        const closeBtnHeader = document.getElementById('closeMigrationModalBtn');
        if (closeBtnHeader) {
            closeBtnHeader.addEventListener('click', () => this.closeMigrationModal());
        }

        const closeBtnFooter = document.getElementById('closeMigrationFooterBtn');
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => this.closeMigrationModal());
        }

        // Event listener para cerrar al hacer click fuera del modal
        const modal = document.getElementById('migrationModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeMigrationModal();
                }
            });
        }
    }

    /**
     * Abre el modal de migración
     */
    openMigrationModal() {
        const modal = document.getElementById('migrationModal');
        if (modal) {
            modal.style.display = 'flex';
            this.resetMigrationState();
        }
    }

    /**
     * Cierra el modal de migración
     */
    closeMigrationModal() {
        const modal = document.getElementById('migrationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Resetea el estado de migración
     */
    resetMigrationState() {
        this.project = null;
        this.workflows = [];
        this.mappedWorkflows = [];
        this.projectPath = '';
        this.selectedPlatform = null;
        this.selectedFolder = null;

        // Mostrar selección de plataformas, ocultar todo lo demás
        this.showPlatformSelection();

        document.getElementById('migrationAnalysisSection').style.display = 'none';
        document.getElementById('migrationMappingSection').style.display = 'none';
        document.getElementById('migrationResultSection').style.display = 'none';
    }

    /**
     * Muestra la sección de selección de plataformas
     */
    showPlatformSelection() {
        const platformSelection = document.getElementById('platformSelection');
        const folderSelector = document.getElementById('folderSelector');

        if (platformSelection) platformSelection.style.display = 'block';
        if (folderSelector) {
            folderSelector.style.display = 'none';
            // Limpiar selección de carpeta
            const pathDisplay = document.getElementById('selectedFolderPath');
            if (pathDisplay) pathDisplay.style.display = 'none';
        }

        // Actualizar título del modal
        const modalTitle = document.getElementById('migrationModalTitle');
        if (modalTitle) modalTitle.textContent = 'Migrar desde otra plataforma';
    }

    /**
     * Selecciona una plataforma
     */
    selectPlatform(platform) {
        this.selectedPlatform = platform;
        const platformConfig = this.platforms[platform];

        console.log(`Plataforma seleccionada: ${platformConfig.name}`);

        // Actualizar título del modal
        const modalTitle = document.getElementById('migrationModalTitle');
        if (modalTitle) {
            modalTitle.textContent = `Migrar desde ${platformConfig.name}`;
        }

        // Si es JSON/XML, ir directamente a selección de archivo
        if (platform === 'json') {
            this.selectJSONFile();
            return;
        }

        // Para otras plataformas, mostrar selector de carpeta
        this.showFolderSelector();
    }

    /**
     * Muestra el selector de carpeta
     */
    showFolderSelector() {
        const platformSelection = document.getElementById('platformSelection');
        const folderSelector = document.getElementById('folderSelector');

        if (platformSelection) platformSelection.style.display = 'none';
        if (folderSelector) folderSelector.style.display = 'block';

        // Limpiar selección anterior
        const pathDisplay = document.getElementById('selectedFolderPath');
        if (pathDisplay) pathDisplay.style.display = 'none';

        const folderInput = document.getElementById('folderInput');
        if (folderInput) folderInput.value = '';
    }

    /**
     * Abre el diálogo de selección de carpeta
     */
    openFolderDialog() {
        const folderInput = document.getElementById('folderInput');
        if (folderInput) {
            folderInput.click();
        }
    }

    /**
     * Maneja la selección de carpeta
     */
    handleFolderSelection(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Obtener la ruta de la carpeta desde el primer archivo
        const firstFile = files[0];
        const folderPath = firstFile.webkitRelativePath.split('/')[0];

        this.selectedFolder = {
            path: folderPath,
            files: Array.from(files)
        };

        console.log(`Carpeta seleccionada: ${folderPath}`);
        console.log(`Archivos encontrados: ${files.length}`);

        // Mostrar la ruta seleccionada
        const pathDisplay = document.getElementById('selectedFolderPath');
        const pathText = document.getElementById('folderPathText');

        if (pathDisplay && pathText) {
            pathText.innerHTML = `
                <code style="background: rgba(15, 23, 42, 0.5); padding: 0.5rem; border-radius: 4px; display: block; margin: 0.5rem 0;">
                    ${folderPath}
                </code>
                <div style="margin-top: 0.5rem; color: var(--text-secondary);">
                    📄 ${files.length} archivo(s) encontrado(s)
                </div>
            `;
            pathDisplay.style.display = 'block';
        }
    }

    /**
     * Confirma la carpeta y analiza el proyecto
     */
    async confirmFolderAndAnalyze() {
        if (!this.selectedFolder) {
            showNotification('⚠️ Selecciona una carpeta primero', 'error');
            return;
        }

        // Ocultar selector de carpeta
        const folderSelector = document.getElementById('folderSelector');
        if (folderSelector) folderSelector.style.display = 'none';

        // Analizar según la plataforma
        await this.analyzePlatformProject();
    }

    /**
     * Analiza el proyecto según la plataforma seleccionada
     */
    async analyzePlatformProject() {
        showNotification(`📊 Analizando proyecto ${this.platforms[this.selectedPlatform].name}...`, 'info');

        try {
            switch (this.selectedPlatform) {
                case 'uipath':
                    await this.analyzeUiPathProject();
                    break;
                case 'automationanywhere':
                    await this.analyzeAutomationAnywhereProject();
                    break;
                case 'blueprism':
                    await this.analyzeBluePrismProject();
                    break;
                case 'power':
                    await this.analyzePowerAutomateProject();
                    break;
                case 'python':
                    await this.analyzePythonProject();
                    break;
                default:
                    throw new Error('Plataforma no soportada');
            }
        } catch (error) {
            console.error('Error al analizar proyecto:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Selecciona archivo JSON/XML directamente
     */
    selectJSONFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.xml';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const content = await this.readFile(file);

                // Determinar si es JSON o XML
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(content);
                    await this.importFromJSON(data);
                } else {
                    await this.importFromXML(content);
                }

            } catch (error) {
                console.error('Error al leer archivo:', error);
                showNotification('❌ Error al leer el archivo: ' + error.message, 'error');
            }
        };

        input.click();
    }

    /**
     * Analiza proyecto UiPath desde archivos seleccionados
     */
    async analyzeUiPathProject() {
        try {
            // Buscar project.json
            const projectFile = this.selectedFolder.files.find(f => f.name === 'project.json');
            if (!projectFile) {
                throw new Error('No se encontró el archivo project.json en la carpeta seleccionada');
            }

            // Leer project.json
            const projectContent = await this.readFile(projectFile);
            this.project = JSON.parse(projectContent);

            // Buscar archivos XAML
            const xamlFiles = this.selectedFolder.files.filter(f => f.name.endsWith('.xaml'));

            this.workflows = xamlFiles.map(file => ({
                name: file.name,
                file: file.name,
                fileObj: file
            }));

            showNotification(`✅ Proyecto UiPath cargado: ${this.project.name}`, 'success');

            await this.analyzeProject();

        } catch (error) {
            console.error('Error al analizar proyecto UiPath:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Analiza proyecto Automation Anywhere
     */
    async analyzeAutomationAnywhereProject() {
        try {
            // Buscar archivos .atmx o .bot
            const botFiles = this.selectedFolder.files.filter(f =>
                f.name.endsWith('.atmx') || f.name.endsWith('.bot')
            );

            if (botFiles.length === 0) {
                throw new Error('No se encontraron archivos .atmx o .bot en la carpeta');
            }

            this.project = {
                name: this.selectedFolder.path,
                platform: 'Automation Anywhere'
            };

            this.workflows = botFiles.map(file => ({
                name: file.name,
                file: file.name,
                fileObj: file
            }));

            showNotification(`✅ ${botFiles.length} bot(s) de Automation Anywhere encontrado(s)`, 'success');

            await this.analyzeAABots();

        } catch (error) {
            console.error('Error al analizar Automation Anywhere:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Analiza proyecto Blue Prism
     */
    async analyzeBluePrismProject() {
        try {
            // Buscar archivos .bprelease o .xml
            const processFiles = this.selectedFolder.files.filter(f =>
                f.name.endsWith('.bprelease') || f.name.endsWith('.xml')
            );

            if (processFiles.length === 0) {
                throw new Error('No se encontraron archivos de proceso de Blue Prism');
            }

            this.project = {
                name: this.selectedFolder.path,
                platform: 'Blue Prism'
            };

            this.workflows = processFiles.map(file => ({
                name: file.name,
                file: file.name,
                fileObj: file
            }));

            showNotification(`✅ ${processFiles.length} proceso(s) de Blue Prism encontrado(s)`, 'success');

            await this.analyzeBluePrismProcesses();

        } catch (error) {
            console.error('Error al analizar Blue Prism:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Analiza proyecto Power Automate
     */
    async analyzePowerAutomateProject() {
        try {
            const workflowFiles = this.selectedFolder.files.filter(f => f.name.endsWith('.json'));

            if (workflowFiles.length === 0) {
                throw new Error('No se encontraron archivos JSON de Power Automate');
            }

            this.project = {
                name: this.selectedFolder.path,
                platform: 'Power Automate'
            };

            this.workflows = workflowFiles.map(file => ({
                name: file.name,
                file: file.name,
                fileObj: file
            }));

            showNotification(`✅ ${workflowFiles.length} workflow(s) de Power Automate encontrado(s)`, 'success');

            await this.analyzePowerAutomateWorkflows();

        } catch (error) {
            console.error('Error al analizar Power Automate:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Analiza scripts Python
     */
    async analyzePythonProject() {
        try {
            const pythonFiles = this.selectedFolder.files.filter(f => f.name.endsWith('.py'));

            if (pythonFiles.length === 0) {
                throw new Error('No se encontraron archivos Python (.py)');
            }

            this.project = {
                name: this.selectedFolder.path,
                platform: 'Python Scripts'
            };

            this.workflows = pythonFiles.map(file => ({
                name: file.name,
                file: file.name,
                fileObj: file
            }));

            showNotification(`✅ ${pythonFiles.length} script(s) Python encontrado(s)`, 'success');

            await this.analyzePythonScripts();

        } catch (error) {
            console.error('Error al analizar Python:', error);
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    /**
     * Importa desde archivo JSON
     */
    async importFromJSON(data) {
        this.project = {
            name: data.name || 'Proyecto Importado',
            main: data.main || 'Main'
        };

        this.workflows = data.workflows || [];
        await this.analyzeProject();
    }

    /**
     * Importa desde archivo XML
     */
    async importFromXML(xmlContent) {
        showNotification('📄 Importación desde XML en desarrollo...', 'info');
        // TODO: Implementar parser XML genérico
    }

    /**
     * Analiza bots de Automation Anywhere
     */
    async analyzeAABots() {
        console.log('📊 Analizando bots de Automation Anywhere...');
        document.getElementById('migrationAnalysisSection').style.display = 'block';
        this.updateProjectInfo();

        for (const workflow of this.workflows) {
            await this.parseAABot(workflow);
        }

        this.showMappingSection();
    }

    /**
     * Analiza procesos de Blue Prism
     */
    async analyzeBluePrismProcesses() {
        console.log('📊 Analizando procesos de Blue Prism...');
        document.getElementById('migrationAnalysisSection').style.display = 'block';
        this.updateProjectInfo();

        for (const workflow of this.workflows) {
            await this.parseBluePrismProcess(workflow);
        }

        this.showMappingSection();
    }

    /**
     * Analiza workflows de Power Automate
     */
    async analyzePowerAutomateWorkflows() {
        console.log('📊 Analizando workflows de Power Automate...');
        document.getElementById('migrationAnalysisSection').style.display = 'block';
        this.updateProjectInfo();

        for (const workflow of this.workflows) {
            await this.parsePowerAutomateWorkflow(workflow);
        }

        this.showMappingSection();
    }

    /**
     * Analiza scripts Python
     */
    async analyzePythonScripts() {
        console.log('📊 Analizando scripts Python...');
        document.getElementById('migrationAnalysisSection').style.display = 'block';
        this.updateProjectInfo();

        for (const workflow of this.workflows) {
            await this.parsePythonScript(workflow);
        }

        this.showMappingSection();
    }

    /**
     * Parsea un bot de Automation Anywhere
     */
    async parseAABot(workflow) {
        console.log(`  Parseando bot AA: ${workflow.name}`);

        try {
            const content = await this.readFile(workflow.fileObj);
            const data = JSON.parse(content);

            // Automation Anywhere usa una estructura JSON con nodes/actions
            const steps = [];
            if (data.nodes) {
                data.nodes.forEach((node, index) => {
                    steps.push({
                        id: `step-${index + 1}`,
                        type: this.mapAAAction(node.type),
                        name: node.name || node.type,
                        config: node.attributes || {}
                    });
                });
            }

            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace(/\.(atmx|bot)$/, ''),
                steps: steps,
                platform: 'Automation Anywhere'
            });

        } catch (error) {
            console.error(`Error al parsear bot AA ${workflow.name}:`, error);
            // Crear workflow vacío si falla el parseo
            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace(/\.(atmx|bot)$/, ''),
                steps: [],
                platform: 'Automation Anywhere',
                error: error.message
            });
        }
    }

    /**
     * Parsea un proceso de Blue Prism
     */
    async parseBluePrismProcess(workflow) {
        console.log(`  Parseando proceso BP: ${workflow.name}`);

        try {
            const content = await this.readFile(workflow.fileObj);
            // Blue Prism usa XML, necesitamos parsearlo
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, 'text/xml');

            const steps = [];
            const stages = xmlDoc.getElementsByTagName('stage');

            Array.from(stages).forEach((stage, index) => {
                const stageName = stage.getAttribute('name') || `Stage ${index + 1}`;
                const stageType = stage.getAttribute('type') || 'action';

                steps.push({
                    id: `step-${index + 1}`,
                    type: this.mapBPStage(stageType),
                    name: stageName,
                    config: {}
                });
            });

            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace(/\.(bprelease|xml)$/, ''),
                steps: steps,
                platform: 'Blue Prism'
            });

        } catch (error) {
            console.error(`Error al parsear proceso BP ${workflow.name}:`, error);
            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace(/\.(bprelease|xml)$/, ''),
                steps: [],
                platform: 'Blue Prism',
                error: error.message
            });
        }
    }

    /**
     * Parsea un workflow de Power Automate
     */
    async parsePowerAutomateWorkflow(workflow) {
        console.log(`  Parseando workflow Power Automate: ${workflow.name}`);

        try {
            const content = await this.readFile(workflow.fileObj);
            const data = JSON.parse(content);

            const steps = [];

            // Power Automate Desktop usa "actions" array
            if (data.actions && Array.isArray(data.actions)) {
                data.actions.forEach((action, index) => {
                    const actionType = action.ActionType || action.type || 'action';
                    const actionName = action.ActionName || action.name || `Action ${index + 1}`;

                    steps.push({
                        id: `step-${index + 1}`,
                        type: this.mapPowerAutomateAction(actionType),
                        name: actionName,
                        config: action.parameters || {}
                    });
                });
            }

            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace('.json', ''),
                steps: steps,
                platform: 'Power Automate'
            });

        } catch (error) {
            console.error(`Error al parsear workflow Power Automate ${workflow.name}:`, error);
            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace('.json', ''),
                steps: [],
                platform: 'Power Automate',
                error: error.message
            });
        }
    }

    /**
     * Parsea un script Python
     */
    async parsePythonScript(workflow) {
        console.log(`  Parseando script Python: ${workflow.name}`);

        try {
            const content = await this.readFile(workflow.fileObj);
            const steps = [];

            // Analizar imports comunes
            const lines = content.split('\n');
            let stepIndex = 1;

            // Detectar imports de selenium (navegación web)
            if (content.includes('from selenium')) {
                steps.push({
                    id: `step-${stepIndex++}`,
                    type: 'browser_open',
                    name: 'Iniciar navegador (Selenium)',
                    config: { browser: 'chrome' }
                });
            }

            // Detectar comandos comunes
            const clickMatches = content.match(/\.click\(\)/g);
            if (clickMatches) {
                clickMatches.forEach(() => {
                    steps.push({
                        id: `step-${stepIndex++}`,
                        type: 'click',
                        name: 'Click en elemento',
                        config: {}
                    });
                });
            }

            // Detectar send_keys
            const typeMatches = content.match(/\.send_keys\([^)]+\)/g);
            if (typeMatches) {
                typeMatches.forEach(() => {
                    steps.push({
                        id: `step-${stepIndex++}`,
                        type: 'type',
                        name: 'Escribir texto',
                        config: {}
                    });
                });
            }

            // Si no se detectaron pasos específicos, agregar paso genérico
            if (steps.length === 0) {
                steps.push({
                    id: 'step-1',
                    type: 'custom_script',
                    name: 'Script Python',
                    config: { code: content }
                });
            }

            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace('.py', ''),
                steps: steps,
                platform: 'Python'
            });

        } catch (error) {
            console.error(`Error al parsear script Python ${workflow.name}:`, error);
            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace('.py', ''),
                steps: [],
                platform: 'Python',
                error: error.message
            });
        }
    }

    /**
     * Mapea acciones de Automation Anywhere a Alqvimia
     */
    mapAAAction(actionType) {
        const mapping = {
            'OpenBrowser': 'browser_open',
            'Click': 'click',
            'Type': 'type',
            'GetText': 'extract_text',
            'Delay': 'wait',
            'MessageBox': 'log_message',
            'Excel.Open': 'excel_open',
            'Excel.Read': 'excel_read',
            'Excel.Write': 'excel_write'
        };
        return mapping[actionType] || 'custom_component';
    }

    /**
     * Mapea stages de Blue Prism a Alqvimia
     */
    mapBPStage(stageType) {
        const mapping = {
            'Navigate': 'navigate',
            'Click': 'click',
            'Write': 'type',
            'Read': 'extract_text',
            'Wait': 'wait',
            'Decision': 'if_condition',
            'Process': 'custom_component'
        };
        return mapping[stageType] || 'custom_component';
    }

    /**
     * Mapea acciones de Power Automate a Alqvimia
     */
    mapPowerAutomateAction(actionType) {
        const mapping = {
            'LaunchNewEdge': 'browser_open',
            'LaunchNewChrome': 'browser_open',
            'ClickUIElement': 'click',
            'PopulateTextField': 'type',
            'ExtractDataFromWebPage': 'extract_data',
            'Wait': 'wait',
            'If': 'if_condition',
            'Loop': 'for_each',
            'GetDetailsOfAWebPage': 'extract_text',
            'TakeScreenshotOfWebPage': 'screenshot'
        };
        return mapping[actionType] || 'custom_component';
    }

    /**
     * Lee archivo
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Analiza el proyecto UiPath
     */
    async analyzeProject() {
        console.log('📊 Analizando proyecto UiPath...');

        document.getElementById('migrationAnalysisSection').style.display = 'block';

        // Mostrar información del proyecto
        this.updateProjectInfo();

        // Analizar cada workflow
        for (const workflow of this.workflows) {
            await this.parseXAML(workflow);
        }

        // Mostrar resumen de mapeo
        this.showMappingSection();
    }

    /**
     * Actualiza la información del proyecto
     */
    updateProjectInfo() {
        const container = document.getElementById('migrationProjectInfo');
        if (!container) return;

        const platformName = this.platforms[this.selectedPlatform]?.name || 'Proyecto';
        const projectName = this.project?.name || this.selectedFolder?.path || 'Proyecto sin nombre';
        const mainFile = this.project?.main || 'N/A';

        const html = `
            <div class="project-info-card">
                <h3>📦 Proyecto ${platformName}</h3>
                <div class="project-details">
                    <div class="detail-row">
                        <span class="label">Nombre:</span>
                        <span class="value">${projectName}</span>
                    </div>
                    ${this.project?.main ? `
                        <div class="detail-row">
                            <span class="label">Archivo principal:</span>
                            <span class="value">${mainFile}</span>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Workflows encontrados:</span>
                        <span class="value">${this.workflows.length}</span>
                    </div>
                    ${this.project?.description ? `
                        <div class="detail-row">
                            <span class="label">Descripción:</span>
                            <span class="value">${this.project.description}</span>
                        </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Plataforma origen:</span>
                        <span class="value">${platformName}</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Parsea un archivo XAML de UiPath
     */
    async parseXAML(workflow) {
        console.log(`  Parseando: ${workflow.name}`);

        try {
            // Solicitar al servidor que parsee el XAML
            const response = await fetch('/api/uipath/parse-xaml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectPath: this.projectPath,
                    workflowFile: workflow.file
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al parsear XAML');
            }

            // Convertir actividades UiPath a Alqvimia
            const mappedSteps = this.mapActivitiesToAlqvimia(result.activities);

            this.mappedWorkflows.push({
                originalName: workflow.name,
                originalFile: workflow.file,
                name: workflow.name.replace('.xaml', ''),
                steps: mappedSteps,
                uipathActivities: result.activities
            });

        } catch (error) {
            console.error(`Error al parsear ${workflow.name}:`, error);
            showNotification(`Error en ${workflow.name}: ${error.message}`, 'error');
        }
    }

    /**
     * Mapea actividades de UiPath a componentes de Alqvimia
     */
    mapActivitiesToAlqvimia(activities) {
        const steps = [];

        activities.forEach((activity, index) => {
            const alqvimiaType = this.activityMapping[activity.type] || 'custom_component';

            const step = {
                id: `step-${index + 1}`,
                type: alqvimiaType,
                name: activity.displayName || activity.type,
                config: this.mapActivityConfig(activity),
                _uipathOriginal: {
                    type: activity.type,
                    properties: activity.properties
                }
            };

            steps.push(step);
        });

        return steps;
    }

    /**
     * Mapea la configuración de una actividad
     */
    mapActivityConfig(activity) {
        const config = {};

        switch (activity.type) {
            case 'ui:OpenBrowser':
                config.url = activity.properties.Url || '';
                config.browser = activity.properties.BrowserType || 'chrome';
                break;

            case 'ui:Click':
            case 'ui:TypeInto':
            case 'ui:GetText':
            case 'ui:GetAttribute':
                config.selector = this.extractSelector(activity.properties.Target);
                if (activity.type === 'ui:TypeInto') {
                    config.text = activity.properties.Text || '';
                }
                break;

            case 'Delay':
                config.duration = this.parseDuration(activity.properties.Duration);
                break;

            case 'ui:TakeScreenshot':
                config.path = activity.properties.FilePath || 'screenshot.png';
                config.fullPage = activity.properties.FullPage !== false;
                break;

            case 'Assign':
                config.variableName = activity.properties.To || '';
                config.value = activity.properties.Value || '';
                break;

            case 'If':
                config.condition = activity.properties.Condition || '';
                config.action = 'continue';
                break;

            case 'ui:HttpRequest':
                config.method = activity.properties.Method || 'GET';
                config.url = activity.properties.Url || '';
                config.headers = activity.properties.Headers || {};
                config.body = activity.properties.Body || '';
                break;

            case 'ui:SendMail':
                config.to = activity.properties.To || '';
                config.subject = activity.properties.Subject || '';
                config.body = activity.properties.Body || '';
                config.attachments = activity.properties.Attachments || [];
                break;

            default:
                // Para actividades no mapeadas, copiar todas las propiedades
                Object.keys(activity.properties || {}).forEach(key => {
                    config[key.toLowerCase()] = activity.properties[key];
                });
        }

        return config;
    }

    /**
     * Extrae el selector de un Target UiPath
     */
    extractSelector(target) {
        if (!target) return '';

        // UiPath usa selectores complejos, intentamos extraer el más simple
        if (target.Selector) {
            // Convertir selector UiPath a CSS si es posible
            const uipathSelector = target.Selector;

            // Buscar atributos comunes
            const idMatch = uipathSelector.match(/id='([^']+)'/);
            if (idMatch) return `#${idMatch[1]}`;

            const classMatch = uipathSelector.match(/cls='([^']+)'/);
            if (classMatch) return `.${classMatch[1]}`;

            const nameMatch = uipathSelector.match(/name='([^']+)'/);
            if (nameMatch) return `[name="${nameMatch[1]}"]`;

            // Si no podemos convertir, devolver el selector original como comentario
            return `/* UiPath: ${uipathSelector} */`;
        }

        return '';
    }

    /**
     * Parsea una duración de UiPath (formato TimeSpan)
     */
    parseDuration(duration) {
        if (!duration) return 1000;

        // Formato UiPath: 00:00:05 (5 segundos)
        const match = duration.match(/(\d+):(\d+):(\d+)/);
        if (match) {
            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = parseInt(match[3]);
            return (hours * 3600 + minutes * 60 + seconds) * 1000;
        }

        return 1000;
    }

    /**
     * Muestra la sección de mapeo
     */
    showMappingSection() {
        document.getElementById('migrationMappingSection').style.display = 'block';

        this.updateMappingStats();
        this.updateWorkflowsList();
    }

    /**
     * Actualiza estadísticas de mapeo
     */
    updateMappingStats() {
        const container = document.getElementById('migrationMappingStats');
        if (!container) return;

        let totalActivities = 0;
        let mappedActivities = 0;
        let unmappedActivities = 0;

        this.mappedWorkflows.forEach(wf => {
            wf.steps.forEach(step => {
                totalActivities++;
                if (step.type === 'custom_component') {
                    unmappedActivities++;
                } else {
                    mappedActivities++;
                }
            });
        });

        const mappingRate = totalActivities > 0 ? Math.round((mappedActivities / totalActivities) * 100) : 0;

        const html = `
            <div class="mapping-stats-card">
                <h3>📊 Estadísticas de Mapeo</h3>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-number">${this.mappedWorkflows.length}</div>
                        <div class="stat-label">Workflows</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${totalActivities}</div>
                        <div class="stat-label">Actividades</div>
                    </div>
                    <div class="stat-box success">
                        <div class="stat-number">${mappedActivities}</div>
                        <div class="stat-label">Mapeadas</div>
                    </div>
                    <div class="stat-box ${unmappedActivities > 0 ? 'warning' : ''}">
                        <div class="stat-number">${unmappedActivities}</div>
                        <div class="stat-label">Por Mapear</div>
                    </div>
                    <div class="stat-box ${mappingRate >= 80 ? 'success' : mappingRate >= 50 ? 'warning' : 'danger'}">
                        <div class="stat-number">${mappingRate}%</div>
                        <div class="stat-label">Tasa de Mapeo</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Actualiza lista de workflows
     */
    updateWorkflowsList() {
        const container = document.getElementById('migrationWorkflowsList');
        if (!container) return;

        let html = '<div class="workflows-list">';
        html += '<h3>📋 Workflows Convertidos</h3>';

        this.mappedWorkflows.forEach((wf, index) => {
            const unmapped = wf.steps.filter(s => s.type === 'custom_component').length;

            html += `
                <div class="workflow-item">
                    <div class="workflow-header">
                        <span class="workflow-name">${wf.name}</span>
                        <span class="workflow-stats">${wf.steps.length} pasos</span>
                        ${unmapped > 0 ? `<span class="workflow-warning">⚠️ ${unmapped} sin mapear</span>` : ''}
                    </div>
                    <div class="workflow-actions">
                        <button class="btn btn-sm btn-primary" onclick="RPAMigrator.previewWorkflow(${index})">
                            <i class="fas fa-eye"></i> Vista Previa
                        </button>
                        <button class="btn btn-sm btn-success" onclick="RPAMigrator.importWorkflow(${index})">
                            <i class="fas fa-download"></i> Importar
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Botón para importar todos
        html += `
            <div style="margin-top: 1.5rem; text-align: center;">
                <button class="btn btn-success" onclick="RPAMigrator.importAllWorkflows()" style="padding: 1rem 2rem;">
                    <i class="fas fa-download"></i> Importar Todos los Workflows
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Vista previa de un workflow
     */
    previewWorkflow(index) {
        const wf = this.mappedWorkflows[index];
        if (!wf) return;

        document.getElementById('migrationResultSection').style.display = 'block';

        const container = document.getElementById('migrationWorkflowPreview');
        if (!container) return;

        let html = `
            <div class="workflow-preview">
                <h3>👁️ Vista Previa: ${wf.name}</h3>
                <div class="preview-stats">
                    <span>📌 ${wf.steps.length} pasos</span>
                    <span>📁 Original: ${wf.originalFile}</span>
                </div>
                <div class="steps-list">
        `;

        wf.steps.forEach((step, idx) => {
            const isUnmapped = step.type === 'custom_component';

            html += `
                <div class="step-preview ${isUnmapped ? 'unmapped' : ''}">
                    <div class="step-preview-header">
                        <span class="step-number">${idx + 1}</span>
                        <span class="step-name">${step.name}</span>
                        <span class="step-type-badge ${isUnmapped ? 'warning' : 'success'}">
                            ${step.type}
                        </span>
                    </div>
                    <div class="step-preview-config">
                        <details>
                            <summary>Ver configuración</summary>
                            <pre>${JSON.stringify(step.config, null, 2)}</pre>
                        </details>
                        ${isUnmapped ? `
                            <div class="unmapped-notice">
                                ⚠️ Actividad original: <code>${step._uipathOriginal.type}</code>
                                <br>Este componente se creará automáticamente al importar
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Importa un workflow específico
     */
    async importWorkflow(index) {
        const wf = this.mappedWorkflows[index];
        if (!wf) return;

        try {
            showNotification(`📥 Importando: ${wf.name}...`, 'info');

            // Guardar workflow en Alqvimia
            const response = await fetch('/api/workflows/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: wf.name + ' (UiPath)',
                    workflow: wf.steps,
                    metadata: {
                        importedFrom: 'UiPath',
                        originalFile: wf.originalFile,
                        importDate: new Date().toISOString()
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`✅ ${wf.name} importado exitosamente`, 'success');

                // Actualizar biblioteca
                if (typeof WorkflowLibrary !== 'undefined') {
                    WorkflowLibrary.loadWorkflows();
                }
            } else {
                throw new Error(result.error || 'Error al guardar workflow');
            }

        } catch (error) {
            console.error('Error al importar workflow:', error);
            showNotification('Error: ' + error.message, 'error');
        }
    }

    /**
     * Importa todos los workflows
     */
    async importAllWorkflows() {
        if (this.mappedWorkflows.length === 0) {
            showNotification('No hay workflows para importar', 'error');
            return;
        }

        const confirm = window.confirm(`¿Deseas importar todos los ${this.mappedWorkflows.length} workflows?`);
        if (!confirm) return;

        showNotification(`📥 Importando ${this.mappedWorkflows.length} workflows...`, 'info');

        let imported = 0;
        let failed = 0;

        for (let i = 0; i < this.mappedWorkflows.length; i++) {
            try {
                await this.importWorkflow(i);
                imported++;
            } catch (error) {
                failed++;
                console.error(`Error importando workflow ${i}:`, error);
            }
        }

        showNotification(`✅ Importación completada: ${imported} exitosos, ${failed} fallidos`, 'success');

        // Cerrar modal
        setTimeout(() => {
            this.closeMigrationModal();
        }, 2000);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    window.RPAMigrator = new RPAMigrator();
    window.RPAMigrator.init();
});
