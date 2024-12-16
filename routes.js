const fs = require('fs');

const handleRoutes = (req, res) => {
    const { url, method } = req;

    // Ruta principal
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Bienvenido al Servidor Interactivo</h1>
            <p>Explora las siguientes rutas:</p>
            <ul>
                <li><a href="/about">Acerca de</a></li>
                <li><a href="/data">Ver datos</a></li>
                <li><a href="/add">Agregar datos</a></li>
            </ul>
        `);
    }
    // Ruta para mostrar datos desde un archivo JSON
    else if (url === '/data' && method === 'GET') {
        fs.readFile('./data.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al leer el archivo de datos');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }
    // Ruta para agregar nuevos datos
    else if (url === '/add' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Agregar un nuevo producto</h1>
            <form action="/add" method="POST">
                <label for="name">Nombre del Producto:</label>
                <input type="text" id="name" name="name" required><br>
                <label for="price">Precio:</label>
                <input type="number" id="price" name="price" required><br>
                <button type="submit">Agregar Producto</button>
            </form>
        `);
    }
    // Manejo de datos enviados desde el formulario para agregar
    else if (url === '/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Parsear los datos enviados
            const parsedBody = new URLSearchParams(body);
            const newProduct = {
                id: Date.now(), // Genera un ID único basado en la fecha
                name: parsedBody.get('name'),
                price: parseFloat(parsedBody.get('price'))
            };

            // Leer el archivo existente y agregar el nuevo producto
            fs.readFile('./data.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error al leer el archivo de datos');
                } else {
                    const jsonData = JSON.parse(data);
                    jsonData.push(newProduct); // Agregar el nuevo producto

                    // Escribir los datos actualizados en el archivo
                    fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error al guardar los datos');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(`<h1>Producto agregado correctamente</h1><p><a href="/data">Ver productos</a></p>`);
                        }
                    });
                }
            });
        });
    }
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Error 404: Ruta no encontrada</h1>');
    }
};

module.exports = { handleRoutes };
