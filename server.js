const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const dbRoutes = require('./src/router/dbRoutes');
const pdfRoutes = require('./src/router/pdfRoutes');
const qrRoutes = require('./src/router/qrRoutes');
const registroRoutes = require('./src/router/registroRoutes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', qrRoutes);
app.use('/', dbRoutes);
app.use('/', pdfRoutes);
app.use('/', registroRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;