const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('./user-model.js') -------  this could be the other way to do it
                                            //   |
const roomSchema = new Schema(              //   |
  {                                         //   |
    name: {type: String},                   //   |
    description: {type: String},                   //   |
    photoAddress: {type: String},           //   |
    //reference the ID og the user               |
    owner: {type: Schema.Types.ObjectId }   //   |
    // user as a subdocument                     |
    // owner: {type: User.Schema}   <-------------
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
