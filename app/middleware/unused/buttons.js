var buttons = function(req, res, next) {

  var sitemapLinks = req.sitemapLinks;
  var cheerio = require('cheerio');
  var Case = require('case');
  var request = require('request-promise');

  var parsedResults = [];

  function parseSites(urls, callback) {
      var parsedSites = [];
      var promiseList = urls.map(getPage)

      Promise.all(promiseList).then(function (data) {
          callback(data.map(parse))
      })

      return parsedSites;
  }

  function getPage(url) {
      return request.get(url)
  }

  function parse(body) {
      var $ = cheerio.load(body);
      // return $('#header > div > div > div > div.header__sitename > span').text()
      $('.btn').each(function(i, element){

        var text = $(this).text().trim();
        var casing = Case.of($(this).text().trim());

        if ( (casing == "sentence") || (casing == "header") ){
          var passfail = "PASS";
        } else {
          var passfail = "FAIL";
        }

        var testResults = {
          text: text,
          casing: casing,
          passfail: passfail
        };

        parsedResults.push(testResults);

      });

  }

  parseSites(sitemapLinks,function(data) {
      // console.log(data)
      req.buttonsNamesResults = data;
      next();
  })

};

module.exports = buttons;
