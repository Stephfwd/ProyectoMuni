const express = require('express'); // Llama al servidor de Express 
const path = require('path'); // Nos sirve para que el js pueda acceder a nuestras carpetas

const app = express(); // Instancia de Express

// --- Middlewares de Configuración ---
// Permite que el servidor entienda datos en formato JSON (útil para cuando enviemos datos desde el frontend con fetch)
app.use(express.json());

// Permite que el servidor entienda datos enviados desde formularios HTML estándar
app.use(express.urlencoded({ extended: true }));

// --- Archivos Estáticos ---
// Configura la carpeta 'public' para servir archivos CSS, JS, e Imágenes directamente
// Por ejemplo: /css/style.css funcionará gracias a esto
app.use(express.static(path.join(__dirname, 'public')));

// Configura también 'public/pages' como carpeta estática.
// Esto permite acceder a /login.html directamente sin tener que escribir /pages/login.html
app.use(express.static(path.join(__dirname, 'public', 'pages')));

// --- Rutas de la Página Web ---
// Ruta principal: Cuando entran a http://localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

// --- Rutas de la API (Backend) ---
// Aquí es donde "guardaremos" o procesaremos los datos de la app.

// Ejemplo de ruta de prueba para verificar que la API responde
app.get('/api/status', (req, res) => {
  res.json({
    estado: 'OK',
    mensaje: 'El servidor está funcionando y la API está lista.'
  });
});

// Ejemplo: Futura ruta para el Login (recibirá datos con POST)
app.post('/api/login', (req, res) => {
  // req.body contiene los datos enviados (usuario, contraseña)
  console.log('Datos de login recibidos:', req.body);
  // Aquí iría la lógica para verificar usuario en base de datos
  res.json({ mensaje: 'Lógica de login pendiente' });
});

// --- Manejo de errores (404) ---
// Si ninguna ruta anterior coincide, se ejecuta esto
app.use((req, res) => {
  res.status(404).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1>404 - Página no encontrada</h1>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <a href="/">Volver al Inicio</a>
        </div>
    `);
});

// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en: http://localhost:${PORT}`);
});