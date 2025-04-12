const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');

const dbRoutes = require('./src/router/dbRoutes');
const pdfRoutes = require('./src/router/pdfRoutes');
const qrRoutes = require('./src/router/qrRoutes');
const indexRoutes = require('./src/router/indexRoutes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static('public'));

app.use('/', qrRoutes);
app.use('/', dbRoutes);
app.use('/', pdfRoutes);
app.use('/', indexRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;