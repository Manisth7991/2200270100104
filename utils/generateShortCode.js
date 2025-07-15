const crypto = require('crypto');

function generateShortCode(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2))
               .toString('hex')  // convert to hexadecimal format
               .slice(0, length); // return required number of characters
}

module.exports = generateShortCode;
