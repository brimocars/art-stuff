const model = require('../model/connectedPlayers.js');

let io;
const registerIo = (ioObj) => {
    io = ioObj;
  
    io.on('connection', (socket) => {
        socket.on('controls', (msg) => {
            const player = msg.split('|')[0];
            model.playerStillConnected(player);
            io.emit('inputFromController', msg);
        });
    });
};

module.exports = {
    registerIo,
};