const crypto = require('crypto')

const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const ALGORITHM = 'aes-256-ctr';
const KEY = process.env.ENCRYPTION_KEY;

function encrypt(text) {
  try {
    const cipher = crypto.createCipher(ALGORITHM, KEY);
    let crypted = cipher.update(text, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return crypted;
  } catch (error) {
    console.log(error)
  }
}

function decrypt(text) {
  try {
    const decipher = crypto.createDecipher(ALGORITHM, KEY);
    let dec = decipher.update(text, outputEncoding, inputEncoding);
    dec += decipher.final(inputEncoding);
    return dec;

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  decrypt,
  encrypt
};