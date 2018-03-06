const { reset, add, remove, back } = require('./events.js');

module.exports = function connection(socket) {
  socket.on('reset', reset());
  socket.on('add', (data) => add(data));
  socket.on('remove', (data) => remove(data));
  socket.on('back', back());
}