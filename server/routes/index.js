const { app } = require('./usuario');

app.use(require('./login'));

app.use(require('./categoria'));

app.use(require('./producto'));

app.use(require('./upload'));

app.use(require('./imagenes'));


module.exports = {
    app
};