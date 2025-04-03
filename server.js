const bodyParser = require('body-parser');
const express = require('express');
const port = 3000;
const app = express();

const indexRouter = require('./controllers/qrController');


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', indexRouter);
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;