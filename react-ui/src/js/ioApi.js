import io from 'socket.io-client';

const socket = io();

const clientOn = (eventName, cb) => {
  socket.on(eventName, cb);
};

const clientEmit = (eventName, data = null) => {
  if (data === null) {
    socket.emit(eventName);
  } else {
    socket.emit(eventName, data);
  }
};

export { clientOn, clientEmit };