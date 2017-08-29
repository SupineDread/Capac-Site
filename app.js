const express = require('express');
const moment = require('moment');
const PORT = process.env.PORT || 1337;
const app = express();

const request = require('request');
const API_CAPAC = 'http://104.236.144.72/api/v1';

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

app.get('/blog', (req, res) => {
  request.get(`${API_CAPAC}/entrada`, (err, response, body) => {
    if(err) return res.render('index', {evento: {err: 'No se pudieron cargar las entradas del blog.'}});
    let entradas = JSON.parse(body).reverse();
    return res.render('blog', {entradas: entradas.map(e => {
      let temp = e;
      temp.createdAt = moment(e.createdAt).format('DD/MM/YYYY');
      return temp;
    })});
  });
})

app.get('/nosotros', (req, res) => res.render('nosotros'));
app.get('/servicios', (req, res) => res.render('servicios'));
app.get('/contacto', (req, res) => res.render('contacto'));

// Listen
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
