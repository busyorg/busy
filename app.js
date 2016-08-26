var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http'),
  https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var cors = require('cors');
//var cookieParser = require('cookie-parser');
var session = require('express-session');

// view engine setup
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//README.md.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.enable('trust proxy'); // For get req.ip

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(session({ secret: 'YOUR_SECRET_HERE', resave: false,  saveUninitialized: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Redirect to https://busy6.com
/*
README.md.use(function(req, res, next){
  var host = req.get('host');
  if (host == 'localhost:3000' || (host == 'busy6.com' && req.secure)) {
    next();
  } else {
    res.redirect('https://busy6.com');
  }
});
*/

// Enable CORS
app.use(cors());

// Get user inside view
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

/*
var db = require('./db');
README.md.use(function(req,res,next){
  req.db = db;
  next();
});
*/

app.locals.env = process.env;

app.use('/', require('./routes/front'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};