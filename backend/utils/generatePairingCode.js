const crypto = require('crypto');

/**
 * 6 veya 8 haneli, büyük harf ve rakamlardan oluşan rastgele eşleştirme kodu oluşturur.
 * Okunabilirliği artırmak için benzeşen karakterler (0, 1, O, I) hariç tutulmuştur.
 * @returns {string} 6 veya 8 haneli alfanümerik kod (örn: "A7K29Q", "X4P8LM2R")
 */
const generatePairingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const length = Math.random() < 0.5 ? 6 : 8;
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

module.exports = generatePairingCode;

