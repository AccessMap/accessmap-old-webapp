var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AccessMap' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log in to AccessMap' });
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  var sess = req.session;
  sess.email = req.body.email;
  res.redirect('/learnsidewalks');
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  res.render('map', {
    title: 'AccessMap',
    mapbox_tiles: JSON.stringify(process.env.MAPBOX_TILES),
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    api_url: JSON.stringify(process.env.API_URL)
  });
});

router.get('/improve', function(req, res, next) {
  res.render('improve', { title: 'Improve AccessMap' });
});

router.get('/learnsidewalks', function(req, res, next) {
  var sess = req.session;
  if (!sess.email) {
    res.redirect('/login');
  }
  res.render('learnsidewalks', {
    title: 'Help Improve AccessMap',
    mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
    learn_url: JSON.stringify(process.env.LEARN_URL),
    email: sess.email
  });
});

module.exports = router;
