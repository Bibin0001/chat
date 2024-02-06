const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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

  async login(){
    const currentUser = await User.findOne({username: this.username})
    const currentUnixTime = Math.floor(new Date().getTime() / 1000);

    if (currentUser && (bcrypt.compareSync(this.password, currentUser.password))) {
      const token = jwt.sign(
          {username: currentUser.username, time_created: currentUnixTime },
          "verySecretKey",
          {
            expiresIn: "2h",
          })
      
      currentUser.token = token;
      return token
    } 

    else {
      return false
    }
    
  }
}

