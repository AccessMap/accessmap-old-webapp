var express = require('express');
var router = express.Router();
var proxy = require('express-http-proxy');
var url = require('url');

/////////
// API //
/////////

router.get(['/', '/*'], proxy(process.env.API_URL, {
  forwardPath: function(req, res) {
    // Forward requests to /api to API server target
    return url.parse(req.url).path
  }
}));


module.exports = router;
