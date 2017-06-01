var express = require("express");
var app = express();

var httpProxy = require('http-proxy');
var apiForwardingUrl = 'https://isearch.asu.edu/endpoints/dept-profiles/json/';

var proxyOptions = {
    changeOrigin: true
};

httpProxy.prototype.onError = function (err) {
    console.log(err);
};


var apiProxy = httpProxy.createProxyServer(proxyOptions);

 app.use(express.static(__dirname + '/app'));

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile('index.html')
 });

 // Grab all requests to the server with "/isearchproxy/".
 app.get("/isearchproxy/:depId", function(req, res) {
     console.log("Request made to /isearchproxy/");
     console.log(req.params.depId);
     apiProxy.web(req, res, {target: apiForwardingUrl+req.params.depId});
 });

 // Check image status
 app.get("/checkimagestatus", function (req, res) {
    console.log("Request made to /checkimagestatus/");
    console.log(req.query.url);
    apiProxy.web(req, res, { target: req.query.url }, function (e) {
        console.log(e);
    });
 })

 apiProxy.on('error', function(e) {
   console.log(e);
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
