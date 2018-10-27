const { app } = require('./usuario');

app.use(require('./login'));

module.exports = {
    app
};