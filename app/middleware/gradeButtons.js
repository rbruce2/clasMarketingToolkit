var gradeButtons = function(req, res, next) {

  var mongoose = require('mongoose');
  var mongoconnection = 'mongodb://clastest:blah33@ds143141.mlab.com:43141/clastestsuite';
  mongoose.createConnection(mongoconnection);

  var ButtonsTest = require('../models/ButtonsTest');

  var unitnameid = req.params.pageid;
  var Case = require('case');
  var isNumber = require('is-number');

  // If query IS passed into .find(), filters by the query parameters
  ButtonsTest.find({"_id": unitnameid}, function (err, data) {
      if (err) {
          res.status(500).send(err)
      } else {

          var ourButtonsData = data[0].results[0].buttons;
          var ourButtonsPossibleTotal = data[0].results[0].buttons.length*100;
          var correctAnswers = 0;

          var buttonswithgrades = [];

          for(var i = 0; i < ourButtonsData.length; ++i){
              // console.log(ourButtonsData[i]);
              // console.log(Case.of(ourButtonsData[i]));
              if((Case.of(ourButtonsData[i]) == 'sentence')||(Case.of(ourButtonsData[i]) == 'header')){
                correctAnswers++;
              }

              var buttontext = ourButtonsData[i];
              var casing = Case.of(ourButtonsData[i]);

              if ( (casing == "sentence") || (casing == "header") ){
                var grade = 100;
              } else {
                var grade = 0;
              }

              var singlebuttondata = {
                buttontext: buttontext,
                casing: casing,
                grade: grade
              };

              buttonswithgrades.push(singlebuttondata);

          }

          var ourButtonsGrade = correctAnswers*100;
          // console.log(ourButtonsGrade);
          // console.log(ourButtonsPossibleTotal);

          var buttonsgrade = Math.round((ourButtonsGrade/ourButtonsPossibleTotal)*100);
          if (isNumber(buttonsgrade)){
            var buttonsgrade = Math.round((ourButtonsGrade/ourButtonsPossibleTotal)*100);
          } else {
            var buttonsgrade = 0;
          }
          // console.log(buttonsgrade);

      }
      req.buttonsgrade = buttonsgrade;
      req.buttonswithgrades = buttonswithgrades;
      next();
  });

};

module.exports = gradeButtons;
