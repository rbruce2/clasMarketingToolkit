var gradeUnitName = function(req, res, next) {

  var mongoose = require('mongoose');
  var mongoconnection = 'mongodb://clastest:blah33@ds143141.mlab.com:43141/clastestsuite';
  mongoose.createConnection(mongoconnection);

  var ButtonsTest = require('../models/ButtonsTest');

  var unitnameid = req.params.pageid;
  var Case = require('case');

  // If query IS passed into .find(), filters by the query parameters
  ButtonsTest.find({"_id": unitnameid}, function (err, data) {
      if (err) {
          res.status(500).send(err)
      } else {

          var unitnamewithgrade = [];

          var ourUnitName = data[0].results[0].unitName;
          var ourUnitNameCasing = Case.of(ourUnitName);
          if (ourUnitNameCasing == 'title'){
            var unitnamegrade = 100;
          } else {
            var unitnamegrade = 0;
          }

          var unitnametext = data[0].results[0].unitName;
          var casing = Case.of(unitnametext);

          var unitnamedata = {
            unitnametext: unitnametext,
            casing: casing,
            grade: unitnamegrade
          };

          unitnamewithgrade.push(unitnamedata);

      }
      req.unitnamegrade = unitnamegrade;
      req.unitnamewithgrade = unitnamewithgrade;
      next();
  });

};

module.exports = gradeUnitName;
