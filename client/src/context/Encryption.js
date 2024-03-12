import CryptoJS from 'crypto-js'
import forge from 'node-forge';

export function Encrypt(message, key, iv) {

  //const keyHex = CryptoJS.enc.Hex.parse(key);


  //const encryptedData = CryptoJS.AES.encrypt(message, key).toString();

  const encryptedData = CryptoJS.AES.encrypt(message, key, {
    iv: iv ,
  }).toString();

  return encryptedData;


}

export function Decrypt(encryptedMessage, key, iv){
  //const keyHex = CryptoJS.enc.Hex.parse(key);
  //console.log(keyHex)
  //

  //const decryptedData = CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key, {
    iv: iv,
  });

  // Convert the decrypted bytes to a readable string
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

  return decryptedData;



}


