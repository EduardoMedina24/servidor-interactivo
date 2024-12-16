const http = require('http');
const routes = require('./routes'); // Importar las rutas

// Crear el servidor
const server = http.createServer((req, res) => {
    routes.handleRoutes(req, res); // Manejar las rutas desde el archivo de rutas
});

// Iniciar el servidor
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Servidor interactivo ejecutándose en http://localhost:${PORT}`);
});
