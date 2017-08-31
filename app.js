const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const app = express();

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arcaniteamp@gmail.com',
    pass: 'trxtrxtrx'
  }
});

const request = require('request');
const API_CAPAC = 'http://104.236.144.72/api/v1';

// Config
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
});

app.get('/eventos', (req, res) => {
  request.get(`${API_CAPAC}/evento`, (err, response, body) => {
    if(err) return res.render('index', {evento: {err: 'No se pudieron cargar los eventos.'}});
    let eventos = JSON.parse(body).reverse();
    return res.render('eventos', {eventos, moment});
  });
});

app.get('/galeria', (req, res) => {
  request.get(`${API_CAPAC}/galeria`, (err, response, body) => {
    if(err) return res.render('index', {evento: {err: 'No se pudieron cargar las galerias.'}});
    let galerias = JSON.parse(body).reverse();
    return res.render('galeria', {galerias, moment});
  });
});

app.get('/nosotros', (req, res) => res.render('nosotros'));
app.get('/servicios', (req, res) => res.render('servicios'));
app.get('/contacto', (req, res) => res.render('contacto'));

app.post('/send', (req, res) => {
  transport.sendMail({
    from: 'CAPAC INFO <arcaniteamp@gmail.com>',
    to: 'hazielfe@gmail.com',
    subject: 'CAPAC INFO',
    html: `
      <h1>CAPAC INFO</h1><br>
      <p><strong>Nombre: </strong>${req.body.name}</p><br>
      <p><strong>Email: </strong>${req.body.to}</p><br>
      <p><strong>Telefono: </strong>${req.body.phone}</p><br>
      <p><strong>Asunto: </strong>${req.body.subject}</p><br>
      <p><strong>Mensaje: </strong>${req.body.message}</p><br>
    `
  }, (err, response) => {
    if(err) return res.render('index', {err: 'No se pudo enviar el formulario.'});
    res.redirect('/contacto');
  });
});

// Listen
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
