require('./config/config');

const express = require('express');

const app = express();

// body-parser
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/usuario', function(req, res) {

    res.json('Get Usuario');

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === '' || body.nombre === undefined) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Nombre es necesario'
        });
    }

    res.json({
        persona: body
    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    });

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto 3000');
});