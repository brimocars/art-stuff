const connectedPlayers = new Set();
const playerWithInput = new Set();

const playerStillConnected = (player) => {
  playerWithInput.add(player);
}

const start = () => {
  setInterval(() => {
    console.log('Connected players:', connectedPlayers);
    console.log('Players with input:', playerWithInput);
    connectedPlayers = structuredClone(playerWithInput);
    playerWithInput.clear();
  }, 5000)
}

const getConnectedPlayers = () => {
  return connectedPlayers;
}

const getPlayerCount = () => {
  return connectedPlayers.size;
}

module.exports = {
  start,
  playerStillConnected,
  getConnectedPlayers,
  getPlayerCount,
}
