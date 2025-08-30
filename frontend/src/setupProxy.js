const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/graphql',
        createProxyMiddleware({
            target: 'https://lab.itbootcamp.ru/new-api/models/7542543958359605249',
            changeOrigin: true,
        })
    );
};

