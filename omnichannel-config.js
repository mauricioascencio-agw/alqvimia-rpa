// Configuracion de Omnicanalidad
// Generado automaticamente por test-omnichannel-setup.bat

const config = {
  whatsapp: {
    enabled: true,
    provider: 'whatsapp-web.js',
    autoReply: false,
    headless: false
  },
  telegram: {
    enabled: true,
    token: '1',
    polling: true,
    welcomeMessage: 'Hola Bienvenido al bot de Alqvimia RPA.'
  }
};

module.exports = config;
