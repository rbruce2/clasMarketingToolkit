(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:reportsCtrl
	* @description
	* # reportsCtrl
	* Controller of the app
	*/

  	angular
		.module('reports')
		.controller('ReportsCtrl', Reports);

		Reports.$inject = ['ReportsService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Reports(ReportsService) {
			/*jshint validthis: true */
			var vm = this;

			vm.runProfileAudit = function() {
				console.log(vm.department);
				ReportsService.getHello();
				ReportsService.getDepInfo(vm.department, function(res) {
					console.log(res);

					// run tests in response results
					for (var i = 0; i < res.data.length; i++) {
						var pass = 9;
						var totalScore = 0;

						// Phone Number
						if (!res.data[i].phone) {
							res.data[i].audit_phone = 'fail';
							pass--;
						}

						// Photo
						if (!res.data[i].photoUrl) {
							res.data[i].audit_photoUrl = 'fail';
							pass--;
						}

						// Email address
						if (!res.data[i].emailAddress) {
							res.data[i].audit_email = 'fail';
							pass--;
						}

						// Affiliation title
						if (!res.data[i].primaryDepartment) {
							res.data[i].audit_affiliationTitle = 'fail';
							pass--;
						}

						// Unit name
						if (!res.data[i].primaryiSearchDepartmentAffiliation) {
							res.data[i].audit_unitName = 'fail';
							pass--;
						}

						// Employee category
						if (!res.data[i].primarySimplifiedEmplClass) {
							res.data[i].audit_emplCat = 'fail';
							pass--;
						}

						// Campus location
						if (!res.data[i].primaryJobCampus) {
							res.data[i].audit_campus = 'fail';
							pass--;
						}

						// Mailcode
						if (!res.data[i].primaryMailCode) {
							res.data[i].audit_mailCode = 'fail';
							pass--;
						}

						// Bio
						if (!res.data[i].bio) {
							res.data[i].audit_bio = 'fail';
							pass--;
						}

						totalScore = pass/9 * 100;

						res.data[i].audit_score = totalScore;

					}

					vm.isearch_results = res.data;



				}, function(res_err) {
					console.log('error');
					console.log(res_err);
				});
			}



		}

})();
