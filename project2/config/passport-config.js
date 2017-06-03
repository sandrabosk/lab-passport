//here we are putting all passport files from app.js
const passport      = require('passport');
const User          = require('../models/user-model.js');
const FbStrategy    = require('passport-facebook').Strategy;
const GoogleStrategy= require("passport-google-oauth").OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
//the same as:
//const passportLocal= require('passport-local');
//const LocalStrategy = passportLocal.Strategy;
const bcrypt        = require('bcrypt');

//determines WHAT TO PUT in the session (what to put in the box)
  //called when you log in
passport.serializeUser((user, cb)=>{
  //cb==> callback
  cb ( null, user._id );
});

//where to get the rest of the user's information (given what's in the box)
  //called on every request AFTER you log in
passport.deserializeUser((userId, cb) => {
  //query the database with the ID from the box
  User.findById(userId, (err, theUser) => {
    if (err){
      cb(err);
      return;
    }

    //sending the user's information to passport
    cb(null, theUser);
  });
});

passport.use(new FbStrategy(
  {
    clientID: process.env.FB_APP_ID,                        // your Facebook client id
    clientSecret:process.env.FB_APP_SECRET,                 //your facebook client secret
    callbackURL:'/auth/facebook/callback'
  },                    //|
                        //|
        //address for a route in our app
  (accessToken, refreshToken, profile, done)=>{
      console.log('');
      console.log('FACEBOOK PROFILE ------------------------');
      console.log(profile);
      console.log('');

      User.findOne(
        {facebookId: profile.id},
        (err,foundUser) => {
          if(err){
            done(err);
            return;
          }
          //if user is already registered, just log them in
          if(foundUser){
            done(null, foundUser);
            return;
          }
          //register the user if they are not registered
          const theUser = new User({
            facebookId: profile.id,
            name: profile.displayName
          });
          theUser.save((err)=> {
            if (err){
              done(err);
              return;
            }
            //this logs in the newly registered user
            done(null, theUser);
          });
        }
      );
  }
));
//accessToken -> fake stuff that facebook gives to out app and we can cancel it as a user whenever we dont want to use the app
//refreshToken -> its purpose is to renew the token since accessToken has an expiration date

passport.use(new GoogleStrategy(
  {
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done)=>{

    console.log('');
    console.log('Google PROFILE ------------------------');
    console.log(profile);
    console.log('');

    User.findOne(
      {googleID: profile.id},

      (err, foundUser) =>{
        if(err){
          done(err);
          return;
        }

        //if user is already registered, just log them in
        if(foundUser){
          done(null, foundUser);
          return;
        }

        //register the user if they are not registered
        const theUser = new User({
          googleID: profile.id,
          name:profile.displayName
        });

        //if the name is empty save the email
        if(!theUser.name){
          theUser.name = profile.emails[0].value;
        }

        theUser.save((err)=>{
          if(err){
            done(err);
            return;
          }

          //this logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
));

//PASSPORT GOES THROUGH THIS:
    //1.our form
    //2. LocalStrategy callback
    //3. (if successful) passport.serializeUser()

passport.use(new LocalStrategy(
  //1st arg - > options to customize LocalStrategy
    {
        //<input name = "loginUsername">
      usernameField: 'loginUsername',
        //<input name = "loginPassword">
      passwordField: 'loginPassword'
    },

  //2nd arg - > callback for the logic that validates the login
  ( loginUsername, loginPassword, next )=>{
    User.findOne({ username: loginUsername },
      (err, theUser)=>{
        //tell passport if there was an error (nothing we can do)
        if (err){
          next(err);
          return;
        }
        //tell passport if there's no user with given username
        if (!theUser){ //!theUser ==> user does not exist
                    // false means "Log in failed"
                    //  |
          next(null, false, { message: 'Did you forget your username?!?!' });
          return; //            |
                  //            V
                  //        message -> req.flash ('error')
        }
            // here we compare password that user typed in with the one that is saved in the DB (the encryptedPassword)
            //tell passport if the passwords don't match
            // console.log("YAAAAAAAAAAAHHHH");
            // console.log(loginPassword);
            // console.log(theUser.encryptedPassword);
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)){
              // false in 2nd arg means "log in failed"
          next(null, false, { message: 'That would not be the one buddy!'}); //this is the callback in which we are telling passport there's no user
                            //we tell passport that in 2nd arg, so we have to put something as a 1st arg
                            //usualy that is "null"
          return;
        }
        console.log("~~~22222222222222222222~~~");
        theUser.logInCount+=1;
        theUser.save((err, theUser)=>{

        //give passport theUser's details (SUCCESS!)
        //null means login didn't fail
        next(null, theUser, {                                             //  |
          message: `Login for ${theUser.username} successful. 🏆`         //  |
        }); //          message will be saved in -> req.flash('success')      |
        // --> this user goes to passport.serializeUser()  <------------------
      }
    );
});
  }
));
