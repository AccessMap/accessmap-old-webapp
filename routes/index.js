var express = require('express'),
    path = require('path'),
    request = require('request');

var router = express.Router();

//
// Index
//

// GET index page
router.get('/', function(req, res) {
  res.render('index', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN)
  });
});

//
// About page
//

// GET index page
router.get('/about', function(req, res) {
  res.render('about');
});

//
// Map pages
//

router.get('/isochrones', function(req, res) {
  res.render('isochrones', {
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    user: req.user
  });
});


module.exports = router;
