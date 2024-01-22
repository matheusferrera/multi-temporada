const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/external', createProxyMiddleware({ target: 'https://ssmt.stays.com.br', changeOrigin: true }));
};