var sslRedirect = require('heroku-ssl-redirect');
var express = require("express");
var app = express();

var httpProxy = require('http-proxy');
var apiForwardingUrl = 'https://isearch.asu.edu/endpoints/dept-profiles/json/';

var proxyOptions = {
    changeOrigin: true
};

// connect to gabes mongo db
var mongoose = require('mongoose');
var mongoconnection = process.env.MONGO_URL;
mongoose.connect(mongoconnection);
var Site = require('./app/modelsdb/Site');
var ButtonsTest = require('./app/modelsdb/ButtonsTest');

httpProxy.prototype.onError = function (err) {
    console.log(err);
};


var apiProxy = httpProxy.createProxyServer(proxyOptions);

 // enable ssl redirect
 app.use(sslRedirect());

 app.use(express.static(__dirname + '/app'));

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile('index.html')
 });

 // isearchReport: Grab all requests to the server with "/isearchproxy/".
 app.get("/isearchproxy/:depId", function(req, res) {
     console.log("Request made to /isearchproxy/");
     console.log(req.params.depId);
     apiProxy.web(req, res, {target: apiForwardingUrl+req.params.depId});
 });

 // Check image status (not in use)
 app.get("/checkimagestatus", function (req, res) {
    console.log("Request made to /checkimagestatus/");
    console.log(req.query.url);
    apiProxy.web(req, res, { target: req.query.url }, function (e) {
        console.log(e);
    });
 })

 //webauditReport: get all reports
 app.get("/allwebauditreports", function (req, res) {
    console.log("Request made to /allwebauditreports/");
    // console.log(req.query.url);
    Site.find(function (err, sites) {
      if (err) {
          // Note that this error doesn't mean nothing was found,
          // it means the database had an error while searching, hence the 500 status
          res.status(500).send(err)
      } else {
          // send the list of all sites
          // res.json(sites);
          // res.render('../views/pages/allreports', { sites });
          console.log(sites);
          return res.json({sites: sites})
      }
    })
 })

//webauditReport: get a specific site report
 app.get("/webauditreport/:reportId", function (req, res) {
   console.log("Request made to /webauditreport");
   var reportId = req.params.reportId;

   // If query IS passed into .find(), filters by the query parameters
  ButtonsTest.find({"siteID": reportId}, function (err, buttonstests) {
      if (err) {
          res.status(500).send(err)
      } else {
          res.json({report: buttonstests});
      }
  });
 })

 /* webauditReport: create new report */
router.post('/', urlencodedParser, websparkcheck, sitemap, function(req, res, next) {

  var site = req.body.site;
  var sitemapLinks = req.sitemapLinks;

  var thisSite = new Site({ url: site, links: sitemapLinks });
  thisSite.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      // console.log(thisSite);
    }
  });

  // agenda process
  var agenda = new Agenda({db: {address: mongoconnection}});

  agenda.define('check dom', function(job, done) {
    console.log('checking dom...');
    // console.log(job);
    var thisSiteID = thisSite._id;
    test(thisSiteID);
    done();
  });

  agenda.on('ready', function() {
    agenda.now('check dom');
    agenda.start();
  });
  // agenda process

  // res.render('../views/pages/testrunner-started', { site, thisId: thisSite._id });
});


 // api proxy error handling
 apiProxy.on('error', function(e) {
   console.log(e);
 });

 /* serves all the static files (Angular) */
 app.get(/^(.+)$/, function(req, res){
     console.log('static file request : ' + req.params[0]);
     res.sendFile( __dirname + req.params[0]);
 });

 var port = process.env.PORT || 3000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });
