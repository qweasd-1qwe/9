const fs = require('fs');
const QRCode = require('qrcode');

async function gen(inputUrl, outPath) {
  try {
    await QRCode.toFile(outPath, inputUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    console.log('QR written to', outPath);
  } catch (e) {
    console.error('QR generation failed', e);
    process.exit(1);
  }
}

if (require.main === module) {
  const url = process.argv[2];
  const out = process.argv[3] || 'qr.png';
  if (!url) {
    console.error('Usage: node generate-qr.js <url> [out.png]');
    process.exit(1);
  }
  gen(url, out);
}


