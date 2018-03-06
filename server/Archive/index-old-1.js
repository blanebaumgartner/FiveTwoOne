"use strict";

const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const RestaurantCollection = require('./RestaurantCollection.js');
const { svrmsg, svrerr } = require('./util.js');

const port = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const restaurantCollection = new RestaurantCollection();
restaurantCollection.init(() => {
  updateClientRestaurants();
  updateClientStatus();
});

let restaurantsInFive, restaurantsInTwo;
let shown, selected;
let fiveReached, twoReached;
let status;

function initializeData() {
  restaurantsInFive = [];
  restaurantsInTwo = [];
  shown = allRestaurants;
  selected = [];
  fiveReached = false;
  twoReached = false;
  status = 0;
}

io.on('connection', (socket) => {
  svrmsg('Client ' + socket.id + ' connected.');
  updateClientRestaurants();
  updateClientStatus();

  socket.on('clientClickedRestaurant', (r) => {
    svrmsg('Client clicked ' + r + '.');
    if (status === 0) { //if choosing five
      const i = selected.indexOf(r);
      if (i === -1) { //if restaurant not previously selected
        selected.push(r);
        if (selected.length >= 5) {
          restaurantsInFive = selected;
          shown = selected;
          selected = [];
          fiveReached = true;
          status++;
        }
      } else { //if restaurant previously selected
        selected.splice(i, 1);
      }
    } else if (status === 1) {
      const i = selected.indexOf(r);
      if (i === -1) {
        selected.push(r);
        if (selected.length >= 2) {
          restaurantsInTwo = selected;
          shown = selected;
          selected = [];
          twoReached = true;
          status++;
        }
      } else {
        selected.splice(i, 1);
      }
    } else if (status === 2) {
      selected = [];
      selected.push(r);
    }

    sendAppData();
  });

  socket.on('clientAddedRestaurant', (r) => {
    allRestaurants.push(r);
    allRestaurants.sort();
    db.addArrayOfRestaurants([r]);
    db.logAllRestaurants();
    sendAppData();
  });

  socket.on('clientRemovedRestaurant', (r) => {
    const i = allRestaurants.indexOf(r);
    allRestaurants.splice(i, 1);
    db.deleteArrayOfRestaurants([r]);
    sendAppData();
  });

  socket.on('clientClickedBack', () => {
    svrmsg('Client clicked Back.');
    if (status === 2) {
      status--;
      twoReached = false;
      selected = restaurantsInTwo;
      shown = restaurantsInFive;
    } else if (status === 1) {
      status--;
      fiveReached = false;
      selected = restaurantsInFive;
      shown = allRestaurants;
    } else if (status === 0) {
      selected = [];
    }
    sendAppData();
  });

  socket.on('clientClickedEdit', () => {
    svrmsg('Client clicked Edit.');
    if (status === -1) {
      status = 0;
    } else {
      status = -1;
    }
    sendAppData();
  });

  socket.on('clientClickedReset', () => {
    svrmsg('Client ' + socket.id + ' clicked Reset.');
    initializeData();
    sendAppData();
  });
});

server.listen(port, () => {
  svrmsg('Listening on port ' + port + '.');
});

function updateClientRestaurants() {
  io.emit('restaurantUpdate', restaurantCollection.collection);
}

function updateClientStatus() {
  io.emit('statusUpdate', status);
}

function buildData() {

  return data;
}
