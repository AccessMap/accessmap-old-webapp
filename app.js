var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    bcrypt = require('bcrypt-nodejs'),
    LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user'),
    routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(session({
  store: new (require('connect-pg-simple')(session))(),
  secret: 'reallybadsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport (login)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      where: {
        'username': username
      }
    }).then(function (user) {
      var failed = false;
      if (user === null) {
        return done(null, false, { message: 'Incorrect username or pass.' });
      }

      var hashedPassword = bcrypt.hashSync(password, user.salt);

      if (user.password === hashedPassword) {
        return done(null, user);
      }

      return done(null, false, { message: 'Incorrect username or pass.' });
      });
    }
  ));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user === null) {
      done(new Error('Wrong user id.'));
    }

    done(null, user);
  });
});

// Routes
app.use('/', routes);

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


module.exports = app;
