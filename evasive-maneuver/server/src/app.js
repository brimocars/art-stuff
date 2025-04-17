const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const ioHandler = require('./lib/io.js');
const routes = require('./routes');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
app.use(express.json());

app.use(routes);

const server = http.createServer(app);
const io = new Server(server);
ioHandler.registerIo(io);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
