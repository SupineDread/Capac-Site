const express = require('express');
const PORT = process.env.PORT || 1337;
const app = express();

const request = require('request');
const API_CAPAC = 'http://107.170.200.227/api/v1';

// Config
app.set('view engine', 'pug');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  request.get(`${API_CAPAC}/evento`, (err, response, body) => {
    if(err) return res.render('index', {evento: {err: 'No se pudieron cargar los eventos.'}});
    let evento = JSON.parse(body).reverse()[0];
    return res.render('index', {evento});
  });
});

app.get('/nosotros', (req, res) => res.render('nosotros'));

// Listen
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
