const io = require('../io');
const connection = require('./connection.js');

io.on('connection', (socket) => connection(socket));