const express = require('express');

const app = express();

const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');

const Categoria = require('../models/categoria');

// Mostrar las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {

                res.json({
                    ok: true,
                    categoria: categoriaDB,
                    total: conteo
                });
            })

        });

});

// mostrar una categoria por id findById
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// crear nueva categoria  req.usuario._id
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no creada'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// put actualizar categoria  la descripcion
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body

    let desc = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, desc, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no creada'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


});

// delete solo pueda borrar un administrador borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no es administrador'
            });
        }

        res.json({
            ok: true,
            message: 'Eliminada correctamente',
            categoria: categoriaDB
        })
    })
});

module.exports = app;