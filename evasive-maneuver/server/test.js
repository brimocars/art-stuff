const QRCode = require('qrcode');

const main = async () => {
  const url = process.env.QR_URL || 'https://www.npmjs.com/package/qrcode';
  const qrCodeImage = await QRCode.toDataURL(url);
  console.log(qrCodeImage)
}

main();