require('./config/config');

const express = require('express');


const path = require('path');

// configuracion global de rutas
const { app } = require('./routes/index');

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));

// mongoose
const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw new err;
    console.log('Conexion mongoDB corriendo port 27017');
});
mongoose.set('useCreateIndex', true);


app.listen(process.env.PORT, () => {

    console.log('Escuchando en el puerto 3000');
});