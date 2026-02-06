const express = require('express'); // Llama al servidor de Express 

// Express es el servidor que carga los recursos de la página

// Más adelante sirve para la configuración de la API ->  API es donde guardaremos los datos de la app

const path = require('path'); // Nos sirve para que el js pueda acceder a nuestras carpetas y así encontrar el HTML

const app = express(); // Instacia de Express -> Es como un puente entre todas las funciones de Express para darselas a la variable app

app.use(express.static(path.join(__dirname, 'public'))); // Conector que accede a las carpetas (en este caso public)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});
// Trae directamente mi HTML

const PORT = 2000; // Es donde va a estar alojado el servidor

app.listen(PORT, () => {
  console.log(`Servidor en el puerto http://localhost:${PORT}`);
});
// Información de escucha