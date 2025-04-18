const express = require('express');

const router = express.Router();
const qrCode = require('../controller/qrCode');
const controlType = require('../controller/controlType.js');

router.get('/qrCode', qrCode.qrCode);
router.get('/control-type', controlType.controlType);
router.use('/phone', express.static('../phone-screen'));
router.use('/main', express.static('../client'));

module.exports = router;