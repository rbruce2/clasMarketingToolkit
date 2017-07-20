var mongoose = require('mongoose');
var mongoconnection = 'mongodb://clastest:blah33@ds143141.mlab.com:43141/clastestsuite';
mongoose.connect(mongoconnection);
var Site = require('../models/Site');

var cheerio = require('cheerio');
var Case = require('case');
var request = require('request-promise');

// helpers/unitnames.js
module.exports = function(siteid) {
  // return 'this site id' + siteid;
  // console.log(siteid);

  Site.findById(siteid, function(err, site) {

      if (err) {

        //found an error
        console.log(err);

      } if (site) {

        //site object found, parse through it
        var parsedResults = [];
        var urls = site.links;

        function parseSites(urls, callback) {
            var parsedSites = [];
            var promiseList = urls.map(getPage);

            Promise.all(promiseList).then(function(data) {
                callback(data.map(parse));
            })

            return parsedSites;
        }

        function getPage(url) {
            return request.get(url);
        }

        function parse(body) {
            var $ = cheerio.load(body);
            $('div.header__sitename > span').each(function(i, element){

              var unitname = $(this).text().trim();
              var casing = Case.of($(this).text().trim());

              if ( (casing == "title") || (casing == "capital") ){
                var passfail = "PASS";
              } else {
                var passfail = "FAIL";
              }

              console.log(i);
              console.log(unitname);
              console.log(passfail);

              // var testResults = {
              //   unitname: unitname,
              //   casing: casing,
              //   passfail: passfail
              // };
              //
              // parsedResults.push(testResults);

            });

        }

        parseSites(urls, function(data) {
            // console.log(data)
            // req.buttonsNamesResults = data;
            // next();
        })

      } else {

        console.log("No site found with that ID.");

      }

  });

}
