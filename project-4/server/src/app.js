const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const ioHandler = require('./lib/io.js');
const routes = require('./routes');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

const server = http.createServer(app);
const io = new Server(server);
ioHandler.registerIo(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
