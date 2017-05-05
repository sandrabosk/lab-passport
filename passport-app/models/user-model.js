const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  //1st argument -> fields of documents
  {
    name: { type: String },
    username: { type: String },
    encryptedPassword: { type: String }
  },

  //2nd arg -> additional options
  {
    //adds createdAt & updatedAt
    timestamps:true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
