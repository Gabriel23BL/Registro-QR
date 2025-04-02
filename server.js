const bodyParser = require('body-parser');
const port = 3000;
const app  = require('./controllers/qrController');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});