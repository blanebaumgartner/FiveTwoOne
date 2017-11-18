const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const fs = require('fs');
const allRestaurants = require('./restaurants.json');

let restaurantsInFive, restaurantsInTwo;
let shown, selected;
let fiveReached, twoReached;

initializeData();

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
  console.log('client connected to fivetwoone001 server: ' + socket.id);

  sendAppData();

  socket.on('clientClickedRestaurant', (r) => {
    console.log('client clicked ' + r);
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
    const json = JSON.stringify(allRestaurants);
    fs.writeFile('server/restaurants.json', json, 'utf8', () => {
      console.log('wrote new restaurant to file');
    });
    sendAppData();
  });

  socket.on('clientRemovedRestaurant', (r) => {
    const i = allRestaurants.indexOf(r);
    allRestaurants.splice(i, 1);
    const json = JSON.stringify(allRestaurants);
    fs.writeFile('server/restaurants.json', json, 'utf8', () => {
      console.log('removed restaurant and wrote file')
    });
    sendAppData();
  });

  socket.on('clientClickedBack', () => {
    console.log('client clicked Back');
    if (status === 2) {
      status--;
      twoReached = false;
      selected = [];
      shown = restaurantsInFive;
    } else if (status === 1) {
      status--;
      fiveReached = false;
      selected = [];
      shown = allRestaurants;
    } else if (status === 0) {
      selected = [];
    }
    sendAppData();
  });

  socket.on('clientClickedReset', () => {
    console.log('client clicked Reset');
    initializeData();
    sendAppData();
  });
});

server.listen(port, () => {
  console.log('fivetwoone001 server listening on port ' + port);
});

function sendAppData() {
  const appData = buildData();
  io.emit('appDataUpdate', appData);
}

function buildData() {
  let title = '';
  if (status === 0) {
    title = 'Choose 5';
  } else if (status === 1) {
    title = 'Choose 2';
  } else {
    title = 'Choose 1';
  }
  const data = {
    title: title,
    restaurants: {
      shown: shown,
      selected: selected
    }
  }
  return data;
}
