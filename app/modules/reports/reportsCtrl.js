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

		Reports.$inject = ['ReportsService', '$rootScope', '$http'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Reports(ReportsService, $rootScope, $http) {
			/*jshint validthis: true */
			var vm = this;
			var clasDepTree = {};
			vm.ranReport = false;
			vm.reportDone = false;

			// loading text/gif
			vm.loading = function () {
				return !!$http.pendingRequests.length;
			}


			// load depTree.json file
			ReportsService.getDepTree(function(res) {
					console.log(res);
					clasDepTree = res.data[0].children[15].children[16];
			}, function(res_err) {
					console.log(res_err);
			});


			vm.runProfileAudit = function () {

				var depIdsToApi = [];
				vm.isearch_results = [];
				var overallScores = [];
				$rootScope.load_notes = 0;
				vm.ranReport = true;



				//build depIdsToApi array
				if (vm.department == 1409) {
					depIdsToApi.push(1409);

				}
				else {

					if (clasDepTree.children[vm.department].children) {

						for (var i = 0; i < clasDepTree.children[vm.department].children.length; i++) {
							depIdsToApi.push(clasDepTree.children[vm.department].children[i].dept_nid);
						}

					}

					depIdsToApi.push(clasDepTree.children[vm.department].dept_nid);

				}

				ReportsService.getDepInfo(depIdsToApi).then(function(res) {

					console.log(res);

						// run tests in response results
						for (var i = 0; i < res.length; i++) {

							for (var x = 0; x < res[i].data.length; x++) {

									var pass = 9;
									var totalScore = 0;

									// Phone Number
									if (!res[i].data[x].phone) {
										res[i].data[x].audit_phone = 'fail';
										pass--;
									}

									// Photo
									if (!res[i].data[x].photoUrl) {
										res[i].data[x].audit_photoUrl = 'fail';
										pass--;
									}

									// Email address
									if (!res[i].data[x].emailAddress) {
										res[i].data[x].audit_email = 'fail';
										pass--;
									}

									// Affiliation title
									if (!res[i].data[x].primaryDepartment) {
										res[i].data[x].audit_affiliationTitle = 'fail';
										pass--;
									}

									// Unit name
									if (!res[i].data[x].primaryiSearchDepartmentAffiliation) {
										res[i].data[x].audit_unitName = 'fail';
										pass--;
									}

									// Employee category
									if (!res[i].data[x].primarySimplifiedEmplClass) {
										res[i].data[x].audit_emplCat = 'fail';
										pass--;
									}

									// Campus location
									if (!res[i].data[x].primaryJobCampus) {
										res[i].data[x].audit_campus = 'fail';
										pass--;
									}

									// Mailcode
									if (!res[i].data[x].primaryMailCode) {
										res[i].data[x].audit_mailCode = 'fail';
										pass--;
									}

									// Bio
									if (!res[i].data[x].bio) {
										res[i].data[x].audit_bio = 'fail';
										pass--;
									}

									totalScore = pass/9 * 100;

									res[i].data[x].audit_score = totalScore;
									vm.isearch_results.push(res[i].data[x]);
									overallScores.push(totalScore);

							}
						}

						vm.reportDone = true;
						vm.overall_total = calculateAverage(overallScores);

					}, function(res_err) {
						console.log('error');
						console.log(res_err);
					});


			} //end runProfileAudit2




		}

		// helper functions
		function calculateAverage(scores) {

			var total = 0;

			for (var i = 0; i < scores.length; i++) {
				total+=scores[i];
			}


			return total/scores.length;

		}

})();
