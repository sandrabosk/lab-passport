const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user-model.js');

const tripSchema = new Schema(
  {
    country: {type: String, required: [true, 'Which country did you travel to?']},
    cityVisited: {type: String},
    yearVisited: { type: String},
    daysStayed: { type: String},
    tourAttractions: {type: String},
    description: {type: String},
    something: { type: String },
    photoAddress: [String],

    // photoAddress: {type: String, default: '/img/defaultTrip.jpg'},
    //reference the ID og the user
    owner: {type: Schema.Types.ObjectId },
    postType: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
      },
    // user as a subdocument
    // owner: {type: User.Schema}
  },
  {
    timestamps: true
  }

  // {
  //   traveller: {type: User.Schema},
  //   destinations: [],
  //   visitedOn: { type: Date },
  //   duration: { type: String },
  //   // placesVisited: [],
  //   upl_photos: {type: String},
  //   description: { type: String}
  //   //reference the ID og the user
  //   // owner: {type: Schema.Types.ObjectId }
  //
  // },
  // {
  //   timestamps: true
  // }
);




const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
