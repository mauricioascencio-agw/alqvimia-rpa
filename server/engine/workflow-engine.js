const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.browser = null;
    this.page = null;
    this.pages = new Map(); // Mapa de nombre de ventana -> página
    this.currentWindowName = 'main'; // Ventana actual por defecto
    this.workflowsDir = path.join(__dirname, '../../data/workflows');
    this.ensureDataDir();
    this.loadWorkflows();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir, { recursive: true });
    }
  }

  loadWorkflows() {
    try {
      if (fs.existsSync(this.workflowsDir)) {
        const files = fs.readdirSync(this.workflowsDir);
        files.forEach(file => {
          if (file.endsWith('.json')) {
            const data = fs.readFileSync(path.join(this.workflowsDir, file), 'utf8');
            const workflow = JSON.parse(data);
            this.workflows.set(workflow.id, workflow);
          }
        });
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  }

  saveWorkflow(name, actions) {
    const id = uuidv4();
    const workflow = {
      id,
      name,
      actions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.workflows.set(id, workflow);

    // Guardar en disco
    const filePath = path.join(this.workflowsDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));

    return id;
  }

  getWorkflows() {
    return Array.from(this.workflows.values());
  }

  getWorkflow(id) {
    return this.workflows.get(id);
  }

  deleteWorkflow(id) {
    this.workflows.delete(id);
    const filePath = path.join(this.workflowsDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async execute(workflow, statusCallback) {
    try {
      statusCallback({ status: 'iniciando', message: 'Iniciando navegador...' });

      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
      });

      this.page = await this.browser.newPage();
      this.pages.set('main', this.page); // Registrar página principal

      const actions = Array.isArray(workflow) ? workflow : workflow.actions;

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        statusCallback({
          status: 'ejecutando',
          message: `Ejecutando acción ${i + 1}/${actions.length}: ${action.type}`,
          progress: ((i + 1) / actions.length) * 100
        });

        await this.executeAction(action);
        await this.delay(action.delay || 500);
      }

      statusCallback({ status: 'completado', message: 'Workflow completado exitosamente' });

      await this.delay(2000);
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.pages.clear();
      this.currentWindowName = 'main';

    } catch (error) {
      statusCallback({ status: 'error', message: error.message });
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        this.pages.clear();
        this.currentWindowName = 'main';
      }
      throw error;
    }
  }

  // Obtiene la página correcta basada en el windowName de la acción
  getTargetPage(action) {
    const windowName = action.windowName || action.objectName || this.currentWindowName;

    if (this.pages.has(windowName)) {
      return this.pages.get(windowName);
    }

    // Si no existe la ventana específica, usar la página principal
    console.warn(`Ventana "${windowName}" no encontrada, usando ventana principal`);
    return this.page;
  }

  async executeAction(action) {
    // Si la acción tiene windowName, crear o cambiar a esa ventana
    if (action.windowName && action.type === 'navigate') {
      if (!this.pages.has(action.windowName)) {
        // Crear nueva página con el nombre especificado
        const newPage = await this.browser.newPage();
        this.pages.set(action.windowName, newPage);
        console.log(`Nueva ventana creada: "${action.windowName}"`);
      }
      this.currentWindowName = action.windowName;
      this.page = this.pages.get(action.windowName);
    }

    // Obtener la página objetivo para esta acción
    const targetPage = this.getTargetPage(action);

    switch (action.type) {
      case 'navigate':
        await targetPage.goto(action.url, { waitUntil: 'networkidle2' });
        break;

      case 'click':
        await targetPage.waitForSelector(action.selector, { timeout: 10000 });
        await targetPage.click(action.selector);
        break;

      case 'type':
        await targetPage.waitForSelector(action.selector, { timeout: 10000 });
        await targetPage.type(action.selector, action.text);
        break;

      case 'select':
        await targetPage.waitForSelector(action.selector, { timeout: 10000 });
        await targetPage.select(action.selector, action.value);
        break;

      case 'wait':
        await this.delay(action.duration);
        break;

      case 'screenshot':
        await targetPage.screenshot({
          path: action.path || `screenshot-${Date.now()}.png`,
          fullPage: action.fullPage || false
        });
        break;

      case 'extract':
        const elements = await targetPage.$$(action.selector);
        const data = [];
        for (const element of elements) {
          const text = await element.evaluate(el => el.textContent);
          data.push(text.trim());
        }
        console.log('Datos extraídos:', data);
        break;

      case 'scroll':
        await targetPage.evaluate((scrollAction) => {
          window.scrollBy(scrollAction.x || 0, scrollAction.y || 0);
        }, action);
        break;

      case 'hover':
        await targetPage.waitForSelector(action.selector, { timeout: 10000 });
        await targetPage.hover(action.selector);
        break;

      case 'keypress':
        await targetPage.keyboard.press(action.key);
        break;

      case 'switch_window':
        // Nueva acción para cambiar entre ventanas
        if (action.windowName && this.pages.has(action.windowName)) {
          this.currentWindowName = action.windowName;
          this.page = this.pages.get(action.windowName);
          console.log(`Cambiado a ventana: "${action.windowName}"`);
        } else {
          console.warn(`No se puede cambiar a ventana "${action.windowName}" - no existe`);
        }
        break;

      default:
        console.warn(`Acción no reconocida: ${action.type}`);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = WorkflowEngine;
