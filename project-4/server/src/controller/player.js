const model = require('../model/connectedPlayers.js');

const possiblePlayers = [
  'eb4034', // red
  '40eb34', // green
  '3489eb', // blue
  'edea4a', // yellow
  'b25bf5', // purple
  'f5931b', // orange
  'fc239e', // pink
  '4affe4', // cyan
  '4a3a0e', // brown
];

const player = async (req, res) => {
  try {
    let connectedPlayerCount = model.getPlayerCount();
    if (connectedPlayerCount < possiblePlayers.length) {
      let color = '';
      do {
        const randomNumber = Math.floor(Math.random() * possiblePlayers.length);
        color = possiblePlayers[randomNumber];
      } while (model.getConnectedPlayers().has(color));
      res.status(200).json({
        color,
      });
    } else {
      return res.status(500).send('Too many players connected');
    }
  } catch (err) {
    console.error('Error with control type: ', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  player,
};