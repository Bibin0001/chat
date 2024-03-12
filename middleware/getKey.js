const crypto = require('crypto');
const fs = require('fs');
const path = require('path')

const filePath = path.join(__dirname, 'roomKeys.json');


async function generateAesKey(length = 256) {
  const iv = crypto.randomBytes(16).toString('hex')
  const key = crypto.randomBytes(16).toString('hex')

  return [key, iv];

} 


async function generateKeyForRoom(roomId){
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  const roomsData = JSON.parse(jsonData)
  const keyAndIv= await generateAesKey(256)
  const key = keyAndIv[0]
  const iv = keyAndIv[1]
  const roomObject = {
    roomId: roomId,
    key: key,
    iv: iv
  }
  roomsData.roomKeys.push(roomObject)
  await fs.writeFileSync(filePath, JSON.stringify(roomsData, null, 2));

  return keyAndIv

}


async function getKey(roomId){
  const jsonData = await fs.readFileSync(filePath, 'utf8');
  const roomsData = JSON.parse(jsonData)
  const existingRoom = roomsData.roomKeys.find(room => room.roomId === roomId);
  if (!existingRoom) {
    console.log('No room :(')
    const keyAndIv = generateKeyForRoom(roomId)
    
    return keyAndIv;

  }
  const roomKey = existingRoom.key
  const roomIv = existingRoom.iv

  return [roomKey, roomIv];

}

module.exports = {
  getKey
};
