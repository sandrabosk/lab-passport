const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  console.log('HOME ----------------');
  console.log('SESSION (from express-session middleware)');
  console.log(req.session);
  console.log('\n');
  console.log('USER (from passport middleware)');
  console.log(req.user);


  //render a completely different view for logged in users:
  // if(req.user){
  //   res.render('logged-in-home.ejs');
  // } else{
  //   res.render('index');
  // }

  // req.flash('successfulSignup');
  res.render('index', {
    successMessage:req.flash('success'),  //<--- this message is for successful sign up
    // user:req.user <-- we don't need this because we have that middleware that says user: req.user so we dont have to repeat that ever agin
    // passportSuccess: req.flash('success') //<--- this message is for successful log in
    //                            |
    //         default success message key from Passport
  });
});

module.exports = router;
