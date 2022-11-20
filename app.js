require('dotenv').config()


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require("serve-favicon")
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('express-flash')
const methodOverride= require('method-override')
const compression = require("compression");
const helmet = require("helmet");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var User = require('./models/user')
var app = express();

const bcrypt = require('bcryptjs')


//favicon 

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('stylesheets/css', express.static(__dirname + '/node_modules/bootstrap-icons/icons'));
app.use('/icons', express.static('./icons'));

app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());

app.use(methodOverride('_method'))

app.use('/', indexRouter);
app.use('/user', usersRouter);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});



// database 
const mongoose = require('mongoose');
let mongoDB = ''
if (process.env.KEY){
  mongoDB =process.env.KEY
}
else {
  mongoDB = process.env.url
}

mongoose.connect(mongoDB, {useNewUrlParser:true,
  useUnifiedTopology:true})
  const db = mongoose.connection;
  
  db.on('error',console.error.bind(console, "MongoDB connection error;"))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


passport.use(
  new LocalStrategy((username, password,done)=>{
      User.findOne({user_name:username},(err,user)=>{
      if (err){
          return done(err);
      }
      if (!user){
          return done(null,false, {message:"Incorrect username"})
      }
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res){
          return done(null,user)
        }
        else {
          return done(null,false,{message:'Incorrect password'})
        }
      })
  })
})
)


// passport config
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
})

module.exports = app;
