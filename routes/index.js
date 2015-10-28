var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AccessMap' });
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  res.render('map', { title: 'AccessMap',
                      mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),
                      api_url: JSON.stringify(process.env.SIDEWALKS_URL) });
});

module.exports = router;
