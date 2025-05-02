const express = require('express');

const router = express.Router();
const qrCode = require('../controller/qrCode');
const player = require('../controller/player.js');
const winner = require('../controller/winner.js');

router.get('/qrCode', qrCode.qrCode);
router.get('/player', player.player);
router.post('/winner', winner.determineWinner);
router.use('/phone', express.static('../phone-screen'));
router.use('/main', express.static('../client'));
router.use('', (req, res) => res.redirect('/main'));

module.exports = router;