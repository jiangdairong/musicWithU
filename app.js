var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var songRouter = require('./routes/songRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');
var commentRouter = require('./routes/commentRouter');
const mongoose = require('mongoose');

const Song = require('./models/song');
const Favorites = require('./models/favorite');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected correctly to server");
},(err) => { console.log(err); })


var app = express();
/*
app.all('*',(req,res,next) =>{
	console.log("hi");	
	if(req.secure){
		console.log("secure!");
		return next();
	}
	else{
		console.log("not secure");
		res.redirect(307,'https://' + req.hostname + ':'+ app.get('secPort') + req.url);
	}
});
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/song', songRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites',favoriteRouter);
app.use('/comments',commentRouter);
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
