const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

const Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'Nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email es requerido']
    },
    password: {
        type: String,
        required: [true, 'Contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJSON = function() {

    let user = this;

    let userObejct = user.toObject();
    delete userObejct.password;
    return userObejct;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} DEBE DE SER ÚNICO'
});

module.exports = mongoose.model('Usuario', usuarioSchema);