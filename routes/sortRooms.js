// This is unrealistically so stupid but i dont have a more clever solution thatn that
// This has to be fixed but i dont have much time right now! 


function sortRooms (clientUser, rooms, groupRooms){
  let orderedRooms = {};

  for (const roomIndex in rooms){
    const currentRoom = rooms[roomIndex];
    //console.log(currentRoom)
    let recipientName = ''
    if ( currentRoom.participants[0] != clientUser){
      recipientName = currentRoom.participants[1];
    } else {
      recipientName = currentRoom.participants[0];
    }

    orderedRooms[recipientName] = currentRoom
  }

  //console.log(orderedRooms)

  return orderedRooms;


}


module.exports = sortRooms;
