const http = require('http');
const { svrmsg } = require('../util');

module.exports = function getServer(app) {
  const server = http.createServer(app);

  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    svrmsg('Listening on port ' + port + '.');
  });

  return server;
}