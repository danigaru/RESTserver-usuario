const express = require('express');

const app = express();

const { verificaToken } = require('../middlewares/autentication');

const Producto = require('../models/producto');

// Obtener todos los productos
// pagina populate

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .exec((err, productoBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    message: 'Producto no existe'
                });
            }

            res.json({
                ok: true,
                productos: productoBD
            });

        });

});

// Obtener un producto populate
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no existe'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// creando producto 
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    })

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no se ha podido crear'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'Producto no existe'
            });
        }

        res.json({
            ok: true,
            message: 'Producto actualizado',
            producto: productoBD
        });

    });

});

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'No se eliminado el producto'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto cambio estado',
            producto: productoBD
        });

    });
});

module.exports = app;