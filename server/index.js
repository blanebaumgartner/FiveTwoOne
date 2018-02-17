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

const db = require('./db.js');

//dev only!
devRestaurants = ["Applebee's","Arby's","Bandidos","Blaze Pizza","Buffalo Wild Wings","Burger King","Cebollas","Chipotle","Dairy Queen","Flat Top Grill","Logan's","McDonald's","Olive Garden","Panda Express","Panera Bread","Penn Station","Qdoba","Red Robin","Sara's Diner","Smokey Bones","Subway","Taco Bell"];
db.addArrayOfRestaurants(devRestaurants);

let allRestaurants = [];

db.getAllRestaurantsArray.then((result) => {
  allRestaurants = result;
  initializeData();
});

let restaurantsInFive, restaurantsInTwo;
let shown, selected;
let fiveReached, twoReached;

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
  serverMessage('Client ' + socket.id + ' connected.');
  sendAppData();

  socket.on('clientClickedRestaurant', (r) => {
    serverMessage('Client clicked ' + r + '.');
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
    // const json = JSON.stringify(allRestaurants);
    // fs.writeFile('server/restaurants.json', json, 'utf8', () => {
    //   serverMessage('Added ' + r + ' to file');
    // });
    sendAppData();
  });

  socket.on('clientRemovedRestaurant', (r) => {
    const i = allRestaurants.indexOf(r);
    allRestaurants.splice(i, 1);
    db.deleteArrayOfRestaurants([r]);
    // const json = JSON.stringify(allRestaurants);
    // fs.writeFile('server/restaurants.json', json, 'utf8', () => {
    //   serverMessage('Removed ' + r + ' and wrote file.')
    // });
    sendAppData();
  });

  socket.on('clientClickedBack', () => {
    serverMessage('Client clicked Back.');
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
    serverMessage('Client clicked Edit.');
    if (status === -1) {
      status = 0;
    } else {
      status = -1;
    }
    sendAppData();
  });

  socket.on('clientClickedReset', () => {
    serverMessage('Client ' + socket.id + ' clicked Reset.');
    initializeData();
    sendAppData();
  });
});

server.listen(port, () => {
  serverMessage('Listening on port ' + port + '.');
});

function sendAppData() {
  const appData = buildData();
  io.emit('appDataUpdate', appData);
  serverMessage('Sent app data to all clients.');
}

function buildData() {
  const data = {
    all: allRestaurants,
    status: status,
    shown: shown,
    selected: selected
  }
  return data;
}

function serverMessage(text) {
  console.log('SERVER: ' + text);
}
