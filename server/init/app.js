const express = require('express');
const path = require('path');

module.exports = function getApp() {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  return app;
}