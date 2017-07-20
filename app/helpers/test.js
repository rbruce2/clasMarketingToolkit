var mongoose = require('mongoose');
var mongoconnection = 'mongodb://clastest:blah33@ds143141.mlab.com:43141/clastestsuite';
mongoose.connect(mongoconnection);
var Site = require('../modelsdb/Site');
var ButtonsTest = require('../modelsdb/ButtonsTest');

var cheerio = require('cheerio');
var Case = require('case');
var request = require('request-promise');
var osmosis = require('osmosis');

// helpers/buttons.js
module.exports = function(siteid) {
  // return 'this site id' + siteid;
  // console.log(siteid);

  Site.findById(siteid, function(err, site) {

    if (err) {

      //found an error
      console.log(err);

    } if (site) {

      var urls = site.links;

      urls.forEach(function(element) {

        //osmosis requests building data
        osmosis
        .get(element)
        .set({
            'pageTitle': 'title',
            'unitName': 'div.header__sitename > span',
            'buttons': ['.btn'],
            'globalasulinks': ['#asu_universal_nav li > a']
        })
        .delay(100)
        .data(function(ourData) {
            // console.log(ourData);

            //
            var testButtonsData = new ButtonsTest({ siteID: siteid, pageLink: element, results: ourData });
            testButtonsData.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                // console.log(testButtonsData);
              }
            });
            //

        })
        //osmosis requests building data

      });

      // .log(console.log)
      // .error(console.log)
      // .debug(console.log)

    } else {

      console.log("No site found with that ID.");

    }

});

}
