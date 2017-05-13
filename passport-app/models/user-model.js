const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  //1st argument -> fields of documents
  {
    //all users will have a name
    name: { type: String },
    role: {
      type: String,
      enum: ['normal user', 'admin'],
      default: 'normal user'
    },

    //traditional registration users
    username: { type: String },
    encryptedPassword: { type: String },

    //login with facebook users
    facebookID: {type: String},

    //login with google users
    googleID: {type: String}

  },

  //2nd arg -> additional options
  {
    //adds createdAt & updatedAt
    timestamps:true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
