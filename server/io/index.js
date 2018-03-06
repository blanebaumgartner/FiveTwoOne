const server = require('../init');
const socketio = require('socket.io');
module.exports = socketio(server);