var express = require("express");
 var app = express();

 app.use(express.static(__dirname + '/app'));

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile('index.html')
 });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){
     console.log('static file request : ' + req.params[0]);
     res.sendFile( __dirname + req.params[0]);
 });

 var port = process.env.PORT || 3000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });
