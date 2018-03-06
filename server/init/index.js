const app = require('./app.js')();
const server = require('./server.js')(app);

module.exports = server;