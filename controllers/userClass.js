const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = class BaseUser {

  constructor(username, password){
    this.username = username;
    this.password = password;
  }

  async register(){
    const existingUser = await User.findOne({ username: this.username});

    if (existingUser) {
      return false 
    }
    const hashedPassword = bcrypt.hashSync(this.password, 10);
    console.log(hashedPassword
    )

    const newUser = new User({
      username: this.username,
      password: hashedPassword
    });


    await newUser.save();
    
    return true
  }

  login(username, password){

  }
}

//class BaseUser{}
/*



class UserClass {

  constructor(username){
    this.username = username;
  }

  sendMessage(room,  ){

  }

  likeMessage(){

  }

  deleteMessage(){

  }

}
*/



