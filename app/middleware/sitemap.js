var sitemap = function(req, res, next) {

  var request = require('request');
  var cheerio = require('cheerio');

  // var url = "https://clas.asu.edu";
  var site = req.body.site;

  var sitemapLinks = [];

  //testing url argument and building sitemap
  request(site, function (error, response, html) {

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      $('#ASUNavMenu li > a').each(function(i, element){

        var link = $(this).attr('href').trim();

        if (link.substring(0, 1) == "/") {
          link = site+link;
        } else {
          link = link;
        }

        if (link.startsWith(site)) {
          sitemapLinks.push(link);
        }

      });

      req.sitemapLinks = sitemapLinks;
      next();

    };

  });

};

module.exports = sitemap;
