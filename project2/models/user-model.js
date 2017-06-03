const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  //1st argument -> fields of documents
  {
    name: { type: String,
      required: [true, 'Please insert your name.'] },
    role: {
      type: String,
      enum: ['normal user', 'admin'],
      default: 'normal user'
      },
    logInCount: { type: Number, default: 0},
    photo: {type: String, default: '/img/happyTraveller.jpg'},
    profession: { type: String },
    birthday: { type: Number},
    location: { type: String },
    email: { type:String} ,
    about: {type: String},
    username: { type: String },
    encryptedPassword: { type: String },
    social: { type: String},
    favPlace: { type: String },
    trip: {type: String},


    //login with facebook users
    facebookID: { type: String },

    //login with google users
    googleID: { type: String }

  },

  //2nd arg -> additional options
  {
    //adds createdAt & updatedAt
    timestamps:true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
