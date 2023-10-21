const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

// Passing in the express application as a request handler
const server = http.createServer(app);

server.listen(port);