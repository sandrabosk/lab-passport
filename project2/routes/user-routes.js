const express      = require('express');
const ensure       = require('connect-ensure-login');
const bcrypt       = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User         = require('../models/user-model.js');


const routerThingy = express.Router();

const myUploader = multer({
  dest:path.join( __dirname, '../public/uploads')
 });

routerThingy.get('/profile',

    //     redirects to '/login' if you are NOT logged in
    //                      |
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    res.render('user/profile-view.ejs', {
      successMessage: req.flash('success')
    });
  }
);





// routerThingy.get('/user/:id', (req, res, next) => {

routerThingy.get('/profile',

    //     redirects to '/login' if you are NOT logged in
    //                      |
  ensure.ensureLoggedIn('/login'), myUploader.single('userPhoto'),

  (req, res, next) => {
  res.render('user/profile-view.ejs', {
      successMessage: req.flash('success')
    });
  }
);

// <form method="post" action="/profile/edit">
routerThingy.post('/profile',

  ensure.ensureLoggedIn('/login'),
  myUploader.single('userPhoto'),
  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

    User.findOne(
      { username: profileUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // if there's a user with the username and it's not you
        // if (foundUser && !foundUser._id.equals(req.user._id)) {
        //   res.render('user/edit-profile-view.ejs', {
        //     errorMessage: 'Username already taken. 😤'
        //   });
        //   return;
        // }
        // const profileChanges = {
        //   name: req.body.profileName,
        //   username: req.body.profileUsername
        // };
     // add updates from form !!!!!!!
        req.user.name = req.body.profileName;
        req.user.username = req.body.profileUsername;
        // dodato na osnovu forme koju popunjavaju da bi napravili profil
        req.user.birthday = req.body.userBirthday;
        req.user.location = req.body.userCountry;
        req.user.profession = req.body.userProfession;
        req.user.email = req.body.userEmail;
        req.user.favPlace = req.body.userFavPlace;

        if (currentPassword && newPassword && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          // add new encryptedPassword to the updates
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt); //my comment: here we use new password
          // profileChanges.encryptedPassword = hashPass;
          req.user.encryptedPassword = hashPass;
        }
        req.user.about = req.body.userAbout;
        if (req.body.pic === 'false') {
          req.user.save((err) => {
            if (err) {
              next(err);
              return;
            }

    req.flash('success', 'Changes saved. 👻');

    res.redirect('/profile');
  });
return;
}
if (req.body.pic === 'true') {

  req.user.photo = `/uploads/${req.file.filename}`;
  req.user.save((err) => {
    if (err) {
      next(err);
      return;
    }

    req.flash('success', 'Changes saved. 👻');

    res.redirect('/profile');
  });

}



        // if both passwords are filled and the current password is correct

        // save updates!


        // User.findByIdAndUpdate(
        //   req.user._id,
        //   profileChanges,
        //   (err, theUser) => {
        //     if (err) {
        //       next(err);
        //       return;
        //     }
        //
        //     req.flash('success', 'Changes saved. 👻');
        //
        //     res.redirect('/profile/edit');
        //   }
        // );
      }
    );
  }
);

routerThingy.get('/users', (req, res, next)=>{
  if(req.user && req.user.role === 'admin'){

  User.find((err, usersList)=>{
    if(err){
      next(err);
      return;
    }

    res.render('user/users-list-view.ejs',{
      users:usersList,
      successMessage: req.flash('success')
    });
  });
}

  else {
    next();
  }
});

routerThingy.post('/users/:id/admin', (req, res, next)=>{
  if (req.user && req.user.role === 'admin'){

  User.findByIdAndUpdate(
    req.params.id,
    {role:'admin'},
    (err, theUser) => {
      if(err){
        next(err);
        return;
      }
      req.flash('success', `User '${theUser.name}' is the admin now 😎`);
      res.redirect('/users');
    }
  );
  return;
}
  else{
    next();
  }
});


module.exports = routerThingy;
