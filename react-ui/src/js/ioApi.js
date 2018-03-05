import io from 'socket.io-client';

const socket = io();

const clientEmit = (eventName, data = null) => {
  if (data === null) {
    socket.emit(eventName);
  } else {
    socket.emit(eventName, data);
  }
};

const clientOn = (eventName, cb) => {
  socket.on(eventName, cb);
};

export { clientEmit as default, clientOn };