const express = require ('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model.js');

const authRoutes = express.Router();

authRoutes.get('/signup',(req, res, next)=>{
res.render('auth/signup-view.ejs');
});
//receiving and processing form
authRoutes.post('/signup',(req, res, next)=>{
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

//don't let users submit blank usernames or passwords
  if (signupUsername === '' || signupPassword === ''){
    res.render('auth/signup-view.ejs',{
      errorMessage:'Please provide both username and password.'
    });
    return;
  }

  User.findOne(
    //1st arg->criteria of the findOne(which documents)
    {username: signupUsername },
    //2nd arg -> projection (which fields)
    {username:1},
    //3rd arg -> callback
    (err, foundUser) => {
      if (err){
        next(err);
        return;
      }

      //don't let user register if the username is taken
      if (foundUser){
        res.render('auth/signup-view.ejs',{
          errorMessage:'Username is taken, sir or madam.'
        });
        return;
      }
// we are good to go, time to save the user.

        //encrypt the password
      const salt = bcrypt.genSaltSync(10); //signupPassword is the one user provided
      const hashPass = bcrypt.hashSync(signupPassword, salt);


        //create theUser
      const theUser = new User({
        name: req.body.signupName,
        username:req.body.signupUsername,
        encryptedPassword: req.body.hashPass
      });

        //save theUser
      theUser.save((err)=>{
        if (err){
          next(err);
          return;
        }
        //redirect to homepage if save is successful
        res.redirect('/');
      });
    }
  );
});



module.exports = authRoutes;
