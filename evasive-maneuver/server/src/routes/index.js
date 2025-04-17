const express = require('express');

const router = express.Router();
const qrCode = require('./qrCode');
const main = require('./main');

router.get('/qrCode', qrCode.qrCode);
//router.express.static('public')

module.exports = router;