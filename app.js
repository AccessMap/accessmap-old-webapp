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

var models = require('./models');
var index = require('./routes/index');
var api = require('./routes/api');

var app = express();
var env = process.env.NODE_ENV || 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
if (env == 'production') {
  var secret = 'productionSecret';
} else if (env == 'development') {
  var secret = 'developmentSecret';
}

// Store session info (automatically) in the database
var SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
  store: new SequelizeStore({
    db: models.sequelize
  }),
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

// Set up flash messages (e.g. bad login message at top of page)
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

// Set up testing user if not using production database
if (env === 'development') {
  models.user
    .sync({force: true})
    .then(function(err) {
      var salt = bcrypt.genSaltSync(10);
      models.user.create({
        username: 'test',
        email: 'test@test.com',
        salt: salt,
        password: bcrypt.hashSync('test', salt)
      });
      return 1;
    }, function(err) {
      console.log('Error syncing database');
    });
}

// Passport (login)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.user.findOne({
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
  models.user.findOne({
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
app.use('/', index);
app.use('/api', api);

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
