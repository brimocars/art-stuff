const QRCode = require('qrcode');

let qrImage;

const qrCode = async (req, res) => {
  try {
    const url = process.env.QR_URL || 'https://www.npmjs.com/package/qrcode';
    if (!qrImage) {
      qrImage = await QRCode.toDataURL(url);
    }
    res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <img src="${qrImage}" alt="qrCode" style="width: 400px; height: 400px; ">
      </body>
      </html>`);
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  qrCode,
};