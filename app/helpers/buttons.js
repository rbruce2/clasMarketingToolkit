var mongoose = require('mongoose');
var mongoconnection = 'mongodb://clastest:blah33@ds143141.mlab.com:43141/clastestsuite';
mongoose.connect(mongoconnection);
var Site = require('../models/Site');
var ButtonsTest = require('../models/ButtonsTest');

var cheerio = require('cheerio');
var Case = require('case');
var request = require('request-promise');

// helpers/buttons.js
module.exports = function(siteid) {
  // return 'this site id' + siteid;
  // console.log(siteid);

  Site.findById(siteid, function(err, site) {

      if (err) {

        //found an error
        console.log(err);

      } if (site) {

        //site object found, parse through links
        var parsedresults = [];
        var thisurlresults = [];
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
            return request.get(url).catch(function(err){
            console.error(err); // This will print any error that was thrown in the previous error handler.
        });
        }

        function parse(body) {
            var $ = cheerio.load(body);
            $('.btn').each(function(i, element){

              var buttontext = $(this).text().trim();
              var casing = Case.of($(this).text().trim());

              if ( (casing == "sentence") || (casing == "header") ){
                var passfail = "PASS";
              } else {
                var passfail = "FAIL";
              }

              // console.log(i);
              // console.log(buttontext);
              // console.log(passfail);
              // console.log(urls[i]);

              // var urlresults = {
              //   urlstring: urls[i],
              // };

              var testresults = {
                buttontext: buttontext,
                casing: casing,
                passfail: passfail
              };

              // thisurlresults.push(urlresults);
              parsedresults.push(testresults);

            });

            // console.log(parsedresults);

            //
            var testButtonsData = new ButtonsTest({ siteID: siteid, url: 'blakkow.com', results: parsedresults });
            testButtonsData.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                // console.log(testButtonsData);
              }
            });
            //

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
