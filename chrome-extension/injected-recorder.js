// 🎯 ALQVIMIA - INJECTED RECORDER
// Script inyectado directamente en la página para máximo acceso

(function() {
  'use strict';

  console.log('✅ Sistema de captura RPA inyectado en la página');

  let isActive = false;

  // Escuchar mensajes de activación/desactivación
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'RPA_ACTIVATE_RECORDING') {
      isActive = true;
      console.log('✅ Sistema de captura activado');
    } else if (event.data.type === 'RPA_DEACTIVATE_RECORDING') {
      isActive = false;
      console.log('⏹️ Sistema de captura desactivado');
    }
  });

  // Función para generar selector único
  function generateUniqueSelector(element) {
    // Prioridad 1: ID
    if (element.id) {
      return `#${element.id}`;
    }

    // Prioridad 2: Name
    if (element.name) {
      return `[name="${element.name}"]`;
    }

    // Prioridad 3: Data-testid
    if (element.dataset.testid) {
      return `[data-testid="${element.dataset.testid}"]`;
    }

    // Prioridad 4: Clase única
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim().split(/\s+/);
      if (classes.length > 0) {
        return `.${classes[0]}`;
      }
    }

    // Prioridad 5: XPath
    return getXPath(element);
  }

  // Generar XPath
  function getXPath(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    if (element === document.body) {
      return '/html/body';
    }

    let ix = 0;
    const siblings = element.parentNode ? element.parentNode.childNodes : [];

    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        const parentPath = element.parentNode ? getXPath(element.parentNode) : '';
        return `${parentPath}/${element.tagName.toLowerCase()}[${ix + 1}]`;
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  }

  // Highlight element on hover
  let highlightedElement = null;
  let highlightBox = null;

  function createHighlightBox() {
    if (!highlightBox) {
      highlightBox = document.createElement('div');
      highlightBox.id = 'rpa-highlight-box';
      highlightBox.style.cssText = `
        position: absolute;
        border: 2px solid #6366f1;
        background: rgba(99, 102, 241, 0.1);
        pointer-events: none;
        z-index: 999998;
        transition: all 0.1s ease;
      `;
      document.body.appendChild(highlightBox);
    }
  }

  function highlightElement(element) {
    if (!element || element === document.body || element === document.documentElement) {
      hideHighlight();
      return;
    }

    createHighlightBox();

    const rect = element.getBoundingClientRect();
    highlightBox.style.left = `${rect.left + window.scrollX}px`;
    highlightBox.style.top = `${rect.top + window.scrollY}px`;
    highlightBox.style.width = `${rect.width}px`;
    highlightBox.style.height = `${rect.height}px`;
    highlightBox.style.display = 'block';

    highlightedElement = element;
  }

  function hideHighlight() {
    if (highlightBox) {
      highlightBox.style.display = 'none';
    }
    highlightedElement = null;
  }

  // Mousemove para highlight
  document.addEventListener('mousemove', (e) => {
    if (!isActive) {
      hideHighlight();
      return;
    }

    // 🆕 SIEMPRE mostrar highlight cuando esté grabando
    // Ctrl+Click para capturar, pero highlight siempre visible
    highlightElement(e.target);
  }, true);

  console.log('✅ Sistema de highlight configurado');

})();
