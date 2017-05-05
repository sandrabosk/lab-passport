const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');


mongoose.connect('mongodb://localhost/passport-app'); //he's doing this by himself

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

//MIDDLEWARES COME BEFORE THE ROUTES

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
//we add this line of code after installing express-session
app.use(session({
  secret:'my cool passpot app',
  //these 2 options are there to prevent warnings
  resave: true,
  saveUninitialized: true
 }) );

 //these come after the session middleware and before routes
app.use(passport.initialize());
app.use(passport.session());

//determines WHAT TO PUT in the session (what to put in the box)
  //called when you log in
passport.serializeUser((user, cb)=>{
  //cb==> callback
  cb ( null, user._id );
});

const User         = require('./models/user-model.js');

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


//routes go here:
//---------------------------------

const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes.js');
app.use ('/', myAuthRoutes);

// ---------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
