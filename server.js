const express = require('express');
const path = require('path'); 

const app = express(); 

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en: http://localhost:${PORT}`);
});
