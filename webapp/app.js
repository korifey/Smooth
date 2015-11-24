var express = require('express');
var exphbs = require('express-handlebars');
var hbshelpers = require('./lib/hsbhelpers');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var models = require('./models/');
var locale = require('./public/javascripts/locale');

var routes = require('./routes/index');
var app_route = require('./routes/app');
var users = require('./routes/users');
var obstacle = require('./routes/obstacle');
var contributor = require('./routes/contributor');
var setlang = require('./routes/setlang');

var app = express();

// view engine setup
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: hbshelpers,
  partialsDir: 'views/partials'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({
  secret: "fdghbnnvgcf",
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest: './obstacle/' }));

sess = {};

// Res object
app.use(function (req, res, next) {
  req.resobj = {};

  next();
});

// Language
app.use(function (req, res, next) {
  var lang = req.session.lang;

  if (!lang) {
    lang = req.session.lang = "ru-RU";
  }

  req.resobj.lang = lang;
  req.resobj.langs = locale.getLanguages();
  sess = req.session;

  console.log("Language:", req.session.lang, req.resobj);

  next();
});

app.use('/', routes);
app.use('/app', app_route);
app.use('/users', users);
app.use('/obstacle', obstacle);
app.use('/contributor', contributor);
app.use('/setlang', setlang);

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
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

models.sequelize.sync({force: true});


module.exports = app;
