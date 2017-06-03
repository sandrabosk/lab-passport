const express = require('express');
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');

const Trip = require('../models/trip-model.js');
const User = require('../models/user-model.js');

const router = express.Router();


router.get('/trips',
  ensure.ensureLoggedIn('/'),
  (req, res, next)=>{
    Trip.find(
      {owner: req.user._id},
      (err, tripsList) => {
        if(err){
          next(err);
          return;
        }

        res.render('trips/trips-list-view.ejs',{
          trips: tripsList,
          successMessage: req.flash('success'),
          layout: 'layouts/profile-layout.ejs'
        });
      }
    );
  }
);


//CREATING TRIPS
router.get('/trips/new',
  ensure.ensureLoggedIn('/login'),

  (req, res, next)=>{  //we know this user is logged in thats why we dont need id
    res.render('trips/new-trip-view.ejs',{
      layout: 'layouts/profile-layout.ejs'
    });
  }
);

// const myTripUploader = multer({
//     dest: path.join(__dirname, '../public/tripPhotos')
// });



var upload = multer({
    dest: path.join(__dirname, `../public/tripPhotos`)
});




var cpUpload = upload.fields([{ name: 'tripPhoto', maxCount: 6 }]);



//SAVING NEW TRIPS
router.post('/trips/new',
  ensure.ensureLoggedIn('/login'),
      cpUpload,
        (req, res, next)=>{

        const theTrip = new Trip();
          theTrip.owner= req.user._id;
          theTrip.country=req.body.tripCountry;
          theTrip.cityVisited= req.body.tripCity;
          theTrip.yearVisited= req.body.tripYear;
          theTrip.daysStayed= req.body.tripDays;
          theTrip.tourAttractions= req.body.thingsSeen;
          theTrip.description= req.body.tripDescription;
          theTrip.something= req.body.tripSomething;


          //
          // if (req.files === '' ) {
          // res.render('trips/new-trip-view.ejs', {
          // layout: 'layouts/profile-layout.ejs',
          // errorMessage: 'Please provide both username and password.'
          // });
          // return;
          // }
console.log('==============');
console.log(req.files);
console.log('==============');
console.log( req.files.tripPhoto);



          if (req.files.tripPhoto) {
            req.files.tripPhoto.forEach((file)=>{
              theTrip.photoAddress.push( `/tripPhotos/${file.filename}`);
            });
          }


          theTrip.save((err)=>{
            if(err){
              next(err);
              return;
            }

          req.flash('success', 'Your trip was saved successfully.');
          res.redirect('/trips');
      });
  }
);

//RENDERING TRIP-DETAILS PAGE
router.get('/trips/:id', (req, res, next)=>{
  // const productId = req.query.id;
  const tripId = req.params.id;
  Trip.findById(tripId, (err, theTrip)=>{
    res.render('trips/trip-details-view.ejs', {
      trip: theTrip
    });
  });
});


//EDIT PAGE
router.get('/trips/:id/edit',(req, res, next)=>{
  const tripId = req.params.id;
  Trip.findById(tripId, (err, theTrip)=>{
    if (err){
      next(err);
      return;
    }
    res.render('trips/edit-trip-view.ejs',{
      trip: theTrip
    });
  });
});


//ACTUAL UPDATE
router.post('/trips/:id', (req, res, next)=>{
  const tripId = req.params.id;
  console.log(req.body.tripCountry);
  const tripChanges = {
    owner: req.user._id,
    country:req.body.tripCountry,
    cityVisited: req.body.tripCity,
    yearVisited: req.body.tripYear,
    daysStayed: req.body.tripDays,
    tourAttractions: req.body.thingsSeen,
    description: req.body.tripDescription,

  };
  Trip.findByIdAndUpdate(
    tripId,
    tripChanges,
    (err, theTrip) =>{
      if (err){
        next(err);
        return;
      }

      //this is how you would redirect to the product details page
      // res.redirect(`/products/${productId}`);
      res.redirect(`/trips/${tripId}`);
    }
  );
});

//DELETE
router.post('/trips/:id/delete', (req, res, next)=>{
  const tripId = req.params.id;
  Trip.findByIdAndRemove(tripId, (err, theTrip)=>{
    if(err){
      next(err);
      return;
    }
    res.redirect('/trips');
  });
});

//SEARCH
router.get('/search',(req, res, next)=>{
  const searchTerm = req.query.tripSearchTerm;
  if(!searchTerm){
    res.render('trips/no-search-view.ejs');
      return;
  }
  const searchRegex = new RegExp(searchTerm, 'i');
  Trip.find(
    { $or:[ {'country':searchRegex}, {'cityVisited':searchRegex}]},
    (err, searchResults)=>{
    if(err){
      next(err);
      return;
    }
      res.render('trips/trip-search-view.ejs',{
        trips: searchResults
      });
    }
  );
});

module.exports = router;
