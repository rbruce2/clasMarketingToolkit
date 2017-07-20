(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:WebAuditCtrl
	* @description
	* # WebAuditCtrl
	* Controller of the app
	*/

  	angular
		.module('reports')
		.controller('WebAuditCtrl', WebAuditCtrl);

		WebAuditCtrl.$inject = ['ReportsService', '$rootScope', '$http', '$location'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function WebAuditCtrl(ReportsService, $rootScope, $http, $location) {
			/*jshint validthis: true */
			var vm = this;
			vm.ranReport = false;
			vm.sites = {}
			vm.showOverallDetails = false;

			ReportsService.getAllWebAuditReports(function (res) {
				console.log(res);
				vm.sites = res.data.sites
			}, function (res_err) {
				console.log(res_err);
			})

			vm.getSiteReport = function (reportId, siteUrl) {
				console.log(reportId);
				ReportsService.getWebAuditReoprt(reportId, function (res) {
						console.log(res);
						vm.siteReport = res.data;
						vm.linkCount = 0;
						var overallgradeobject = [];
						var allSitesGradeArray = [];
						var allSitesGradeArray_unitnamegrade = [];
						var allSitesGradeArray_globalasulinksgrade = [];
						var allSitesGradeArray_buttonsgrade = [];

						// run tests
						vm.siteReport.report.forEach(function(element) {

						// unit name grade
						var ourUnitName = element.results[0].unitName;
						var ourUnitNameCasing = Case.of(ourUnitName);
						if (ourUnitNameCasing == 'title'){
							var unitnamegrade = 100;
							element.auditResults_unitnamegrade = {
								'unitName' : ourUnitName,
								'grade' : unitnamegrade
							}
						} else {
							var unitnamegrade = 0;
							element.auditResults_unitnamegrade = {
								'unitName' : ourUnitName,
								'grade' : unitnamegrade
							}
						}

						// console.log(unitnamegrade);
						// unit name grade

						// global asu links grade
						var baselineLinks = [ 'ASU Home', 'News/Events', 'Academics', 'Research', 'Athletics', 'Alumni', 'Giving', 'President', 'About ASU', 'My ASU', 'Colleges & Schools', 'Arts and Sciences', 'Business', 'Design and the Arts', 'Education', 'Engineering', 'Future of Innovation in Society', 'Graduate', 'Health Solutions', 'Honors', 'Journalism', 'Law', 'Nursing and Health Innovation', 'Public Service and Community Solutions', 'Sustainability', 'University College', 'Thunderbird School of Global Management', 'Map & Locations', 'Map', 'Tempe', 'West', 'Polytechnic', 'Downtown Phoenix', 'Online and Extended', 'Lake Havasu', 'Thunderbird', 'Skysong', 'Research Park', 'Washington D.C.', 'China', 'Directory', ];

						var ourGlobalASULinks = element.results[0].globalasulinks;

						var baselineLinksObject = JSON.stringify(baselineLinks);
						var ourLinksObject = JSON.stringify(ourGlobalASULinks);

						var globalasulinksgrade = baselineLinksObject === ourLinksObject ? 100 : 0;

						if (globalasulinksgrade === 100) {
							element.auditResults_globalasulinksgrade = {
								'grade' : globalasulinksgrade
							}
						}
						else {
							element.auditResults_globalasulinksgrade = {
								'grade' : globalasulinksgrade
							}
						}

						// global asu links grade

						// buttons grade
						var ourButtonsData = element.results[0].buttons;
						var ourButtonsPossibleTotal = element.results[0].buttons.length*100;
						var correctAnswers = 0;
						element.auditResults_buttonsgrade = [];

						for(var i = 0; i < ourButtonsData.length; ++i){
								if((Case.of(ourButtonsData[i]) == 'sentence')||(Case.of(ourButtonsData[i]) == 'header')){
									correctAnswers++;
									element.auditResults_buttonsgrade.push({
										'buttonName' : ourButtonsData[i],
										'grade' : 100
									})
								}
								else {
									element.auditResults_buttonsgrade.push({
										'buttonName' : ourButtonsData[i],
										'grade' : 0
									})
								}
						}

						if (correctAnswers > 0) {
							var ourButtonsGrade = correctAnswers*100;

							var buttonsgrade = Math.round((ourButtonsGrade/ourButtonsPossibleTotal)*100);
						}
						else {
							var buttonsgrade = 0;
						}

						// console.log(buttonsgrade);
						// buttons grade

						var pagegrade = Math.round(((unitnamegrade + globalasulinksgrade + buttonsgrade) / 300)*100);
						// console.log(pagegrade);
						//graph overall grades
						allSitesGradeArray.push(pagegrade);
						allSitesGradeArray_unitnamegrade.push(unitnamegrade);
						allSitesGradeArray_buttonsgrade.push(buttonsgrade);
						allSitesGradeArray_globalasulinksgrade.push(globalasulinksgrade);

						var singlelinkoverallgrades = {
							pagelink: element.pageLink,
							overallgrade: pagegrade,
							unitnamegrade: unitnamegrade,
							globalasulinksgrade: globalasulinksgrade,
							buttonsgrade: buttonsgrade,
							pageid: element._id,
							idxIdentifier: vm.linkCount
						};
						vm.linkCount++;
						overallgradeobject.push(singlelinkoverallgrades);
				});
						console.log(overallgradeobject);
						vm.siteUrl = siteUrl;
						vm.overallLinkGrades = overallgradeobject;
						vm.allSitesGrade = calculateAverage(allSitesGradeArray);
						vm.allSitesGrade_unitnamegrade = calculateAverage(allSitesGradeArray_unitnamegrade);
						vm.allSitesGrade_buttonsgrade = calculateAverage(allSitesGradeArray_buttonsgrade);
						vm.allSitesGrade_globalasulinksgrade = calculateAverage(allSitesGradeArray_globalasulinksgrade);

						console.log(vm.siteReport);
						vm.ranReport = true;
				}, function (res_err) {
						console.log(res_err);
				})
			}

			vm.togglePageslide = function(linkIndex){

					vm.LinkSlider = {}

					console.log('im here');
					console.log(linkIndex);
					console.log(vm.siteReport.report[3].results[0].pageTitle);
					if (!vm.checked) {
						vm.LinkSlider.pageTitle = vm.siteReport.report[linkIndex].results[0].pageTitle
						vm.LinkSlider.pageUrl = vm.siteReport.report[linkIndex].pageLink
						vm.LinkSlider.audit_unitnamegrade = vm.siteReport.report[linkIndex].auditResults_unitnamegrade
						vm.LinkSlider.audit_globalasulinksgrade = vm.siteReport.report[linkIndex].auditResults_globalasulinksgrade
						vm.LinkSlider.audit_buttonsgrade = vm.siteReport.report[linkIndex].auditResults_buttonsgrade

					}

          vm.checked = !vm.checked;
      }

			// create new report
			vm.createNewReport = function (){
				console.log('createNewReport running');
				ReportsService.creteNewWebauditReport(vm.webaudit, function (res) {
					console.log(res);
				}, function (res_err) {
					console.log(res_err);
				})
			}

			// isearch Audit Filter (less than)
			vm.scoreFilter = 100
			vm.lessThan = function(prop, val) {
				return function(user) {
					if(user[prop] <= val) return true;
				}
			};

			//back button
			vm.backToiSearchAuditList = function() {
				vm.ranReport = false;
			}



		} //end webaudit Ctrl function

		// helper functions
		//calculate average of array of values
		function calculateAverage(scores) {
			console.log('the avg of ' + scores);
			console.log('is');
			var total = 0;
			for (var i = 0; i < scores.length; i++) {
				total+=scores[i];
			}
			console.log(total/scores.length);
			return total/scores.length;
		}

})();
