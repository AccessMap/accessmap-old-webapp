var bcrypt = require('bcrypt-nodejs'),
    express = require('express'),
    passport = require('passport'),
    path = require('path'),
    request = require('request');

var models = require('../models');

var router = express.Router();

//
// Index
//

// GET index page
router.get('/', function(req, res) {
  res.render('index', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    user: req.user
  });
});

// GET routing page
router.get('/routing', function(req, res) {
  res.render('routing', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    user: req.user
  });
});

//
// About page
//

// GET index page
router.get('/about', function(req, res) {
  res.render('about', { user: req.user });
});

//
// Registration and login
//

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.returnTo = req.path;
  req.flash('error', 'You have to be logged in to access this page.');
  res.redirect('/login');
}

// GET comingsoon
router.get('/comingsoon', function(req, res) {
  res.render('comingsoon');
});

// GET register
router.get('/register', function(req, res) {
  res.redirect('/comingsoon');
  res.render('register');
});

// POST register
router.post('/register', function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  if (!username || !email || !password) {
    req.flash('error', 'Required field missing.');
    res.redirect('/register');
  } else {
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    var newUser = {
      username: username,
      email: email,
      salt: salt,
      password: hashedPassword
    };

    models.User.create(newUser).then(function() {
      res.redirect('/login');
    }).catch(function(error) {
      console.log(error);
      res.redirect('/');
    });
  }
});

// GET login page
router.get('/login', function(req, res) {
  // TODO: Remove the redirect to re-enable login page
  res.redirect('/comingsoon');
  res.render('login', { user: req.user });
});

// POST login page
router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET logout page
router.get('/logout', function(req, res) {
  res.redirect('/comingsoon');
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/');
});

// GET profile page
router.get('/profile', function(req, res) {
  res.redirect('/comingsoon');
  res.render('profile', { user: req.user });
});

//
// Map pages
//

// GET map page
router.get('/map', function(req, res) {
  res.render('map', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    user: req.user
  });
});

router.get('/isochrones', function(req, res) {
  res.render('isochrones', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    user: req.user
  });
});

router.get('/improve', function(req, res) {
  res.render('improve', { user: req.user });
});

router.get('/learnsidewalks', isAuthenticated, function(req, res, next) {
  res.render('learnsidewalks', {
    learn_url: JSON.stringify(process.env.LEARN_URL),
    user: req.user.username
  });
});

router.get('/getdata', isAuthenticated, function(req, res, next) {
  request(process.env.LEARN_URL + '/getdata' + '?user=' + req.user.username, function(e, r, b) {
    if (e) {
      res.send('Error: ' + e);
    } else {
      res.send(b);
    }
  });
});


module.exports = router;
