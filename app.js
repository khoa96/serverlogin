var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors');
var app = express();
app.use(cors());
app.options('*', cors());
// connect to mongoose mlab
const mongoose = require('mongoose');
const db = "mongodb://abc:khoanguyen96@ds143532.mlab.com:43532/node_mongoose";
mongoose.Promise = require('bluebird');

/*CONNECT  to monngoose  */
mongoose.connect(db, {useNewUrlParser: true}, err => {
  if(err) {
    console.log(err);
  }else {
    console.log('connnected');
  }
});
app.set('superSecret', config.secret); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
