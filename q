[1mdiff --git a/routes/index.js b/routes/index.js[m
[1mindex 6a19756..abf974a 100644[m
[1m--- a/routes/index.js[m
[1m+++ b/routes/index.js[m
[36m@@ -16,15 +16,17 @@[m [mvar router = express.Router();[m
 router.get('/', function(req, res) {[m
   res.render('index', {[m
     mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),[m
[31m-    user: req.user[m
[32m+[m[32m    user: req.user,[m
[32m+[m[32m    routing: false[m
   });[m
 });[m
 [m
 // GET routing page[m
 router.get('/routing', function(req, res) {[m
[31m-  res.render('routing', {[m
[32m+[m[32m  res.render('index', {[m
     mapbox_token: JSON.stringify(process.env.MAPBOX_TOKEN),[m
[31m-    user: req.user[m
[32m+[m[32m    user: req.user,[m
[32m+[m[32m    routing: true[m
   });[m
 });[m
 [m
