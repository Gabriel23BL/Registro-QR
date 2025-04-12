const express = require('express');
const bodyParser = require('body-parser');
const dbRoutes = require('./router/dbRoutes');
const pdfRoutes = require('./router/pdfRoutes');
const qrRoutes = require('./router/qrRoutes');
const registroRoutes = require('./router/registroRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', qrRoutes);
app.use('/', dbRoutes);
app.use('/', pdfRoutes);
app.use('/', registroRoutes);

module.exports = app;