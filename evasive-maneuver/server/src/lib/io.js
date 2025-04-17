// From austin's thing

let io;
const registerIo = (ioObj) => {
    io = ioObj;
  
    io.on('connection', (socket) => {
        socket.on('controls', (msg) => {
            io.emit('inputFromController', msg);
        });
    });
};

module.exports = {
    registerIo,
};