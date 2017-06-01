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

		Reports.$inject = ['ReportsService', '$rootScope', '$http', '$mdSidenav'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Reports(ReportsService, $rootScope, $http, $mdSidenav) {
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

			// var testUrl = 'https://webapp4.asu.edu/photo-ws/directory_photo/2304281'
			// var testUrl = 'https://webapp4.asu.edu/photo-ws/directory_photo/1048162'
			// ReportsService.checkImageStatus(testUrl, function (res) {
			// 	console.log('succes pic');
			// 	console.log(res.status);
			// 	console.log(res);
			// },
			// function (err_res) {
			// 	console.log('fail pic');
			// 	console.log(err_res.status);
			// 	console.log(err_res);
			// })


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

									var pass = 15;
									var totalScore = 0;

									// Phone Number (1pt)
									if (!res[i].data[x].phone) {
										res[i].data[x].audit_phone = 'fail';
										pass--;
									}

									// Photo (1pt)
									if (!res[i].data[x].photoUrl) {
										res[i].data[x].audit_photoUrl = 'fail';
										pass--;
									}

									// if (res[i].data[x].photoUrl) {
									// 	ReportsService.checkImageStatus(res[i].data[x].photoUrl, function (res) {
									// 		console.log('succes pic');
									// 		console.log(res.status);
									// 		console.log(res);
									// 	},
									// 	function (err_res) {
									// 		console.log('fail pic');
									// 		console.log(err_res.status);
									// 		console.log(err_res);
									// 	})
									// }

									// if (res[i].data[x].photoUrl) {
									// 	var isImageResult = true
									// 	console.log(res[i].data[x].displayName);
									// 	ReportsService.isImage(res[i].data[x].photoUrl).then(function(result) {
									// 			console.log('isImage: ');
									// 			console.log(result);
						      //       isImageResult = result;
						      //   });
									// 	res[i].data[x].audit_photoUrl = isImageResult
									// }

									// if (res[i].data[x].photoUrl) {
									// 	console.log($http.get(res[i].data[x].photoUrl));
									// }


									// Email address (1pt)
									if (!res[i].data[x].emailAddress) {
										res[i].data[x].audit_email = 'fail';
										pass--;
									}

									// Affiliation title (1pt)
									if (!res[i].data[x].primaryDepartment) {
										res[i].data[x].audit_affiliationTitle = 'fail';
										pass--;
									}

									// Unit name (1pt)
									if (!res[i].data[x].primaryiSearchDepartmentAffiliation) {
										res[i].data[x].audit_unitName = 'fail';
										pass--;
									}

									// expertiseAreas (1pt)
									if (!res[i].data[x].expertiseAreas) {
										res[i].data[x].audit_expertiseAreas = 'fail';
										console.log('no expertise areas');
										pass--;
									}else if (res[i].data[x].expertiseAreas.length <= 1) {
										console.log('need more than 1 expertise area');
										res[i].data[x].audit_expertiseAreas_length = 'shoud have more than one expertise area';
										pass--;
									}

									// Employee category (1pt)
									if (!res[i].data[x].primarySimplifiedEmplClass) {
										res[i].data[x].audit_emplCat = 'fail';
										pass--;
									}

									// Campus location (1pt)
									if (!res[i].data[x].primaryJobCampus) {
										res[i].data[x].audit_campus = 'fail';
										pass--;
									}

									// Mailcode (1pt)
									if (!res[i].data[x].primaryMailCode) {
										res[i].data[x].audit_mailCode = 'fail';
										pass--;
									}

									// Bio (word limit: 100min 300max) (3rd person) (no primary affiliations) (3pt)
									if (!res[i].data[x].bio) {
										res[i].data[x].audit_bio = 'No bio found';
										pass = pass - 3
									}

									else if (res[i].data[x].bio) {
										var words = res[i].data[x].bio.split(' ')
										var wordCount = res[i].data[x].bio.split(' ').length

										// min bio word limit
										if (wordCount < 100) {
											console.log('Bio must be at least 100 words in length');
											res[i].data[x].audit_bio_min = 'Bio must be at least 100 words in length'
											pass--;
										}

										// max bio word limit
										if (wordCount > 300) {
											console.log('Bio must be less than 300 words in length');
											res[i].data[x].audit_bio_max = 'Bio must be less than 300 words in length'
											pass--;
										}

										// check if written in first person
										var count = 0
										for (var w = 0; w < words.length; w++) {
											if ( words[w] == 'I' || words[w] == 'me' || words[w] == 'my' ) {
												// console.log(words[w]);
												count++
											}
											if (count > 1) {
												res[i].data[x].audit_bio_1stPerson_warning = 'fail'
												pass--;
												break
											}
										}
									}

									// Short Bio (word limit: 40max) (3rd person) (no full name just last) (3pt)
									if (!res[i].data[x].shortBio) {
										res[i].data[x].audit_shortBio = 'No shortBio found';
										pass = pass - 3
									}

									else if (res[i].data[x].shortBio) {
										var words = res[i].data[x].shortBio.split(' ')
										var wordCount = res[i].data[x].shortBio.split(' ').length

										// max shortBio word limit
										if (wordCount > 40) {
											console.log('Short Bio must be less than 40 words in length');
											res[i].data[x].audit_shortBio_max = 'Bio must be less than 40 words in length'
											pass--;
										}

										// check if written in first person and if first name is used
										var pronounCount = 0
										var firstNameCount = 0
										for (var w = 0; w < words.length; w++) {
											if ( words[w] == 'I' || words[w] == 'me' || words[w] == 'my' ) {
												console.log(words[w]);
												pronounCount++
											}
											else if ( words[w] == res[i].data[x].firstName ) {
												console.log(words[w]);
												firstNameCount++
											}
											if (pronounCount >= 1 && firstNameCount >= 1) {
												console.log('first person and first name fail');
												res[i].data[x].audit_shortBio_1stPerson_warning = 'fail'
												res[i].data[x].audit_shortBio_firstName = 'fail'
												pass = pass - 2;
												break
											}
											if (pronounCount >= 1 && w + 1 == words.length) {
												console.log('third person fail');
												res[i].data[x].audit_shortBio_1stPerson_warning = 'fail'
												pass--
											}
											if (firstNameCount >= 1 && w + 1 == words.length) {
												console.log('first name fail');
												res[i].data[x].audit_shortBio_firstName = 'fail'
												pass--
											}
										}
									}


									// Education
									// if (!res[i].data[x].education) {
									// 	res[i].data[x].audit_education = 'fail';
									// 	pass--;
									// }



									totalScore = pass/15 * 100;

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

			}; //end runProfileAudit


			// user details slideout vars
			vm.openRightMenu = function() {
				$mdSidenav('right').toggle();
			};

			// user details slideout vars
			vm.userDetailSlideout = function(userArrayId) {
				$mdSidenav('right').toggle();
			};

			// pageslide
			vm.UserSlider = {}
			vm.UserSlider.displayName = ''
			vm.UserSlider.primaryDepartment = ''
			vm.UserSlider.audit_score = 0;
			vm.UserSlider.titles = []
			vm.UserSlider.expertiseAreas = []
			vm.UserSlider.bio = ''
			vm.UserSlider.publications = ''
			vm.UserSlider.courses = ''
			vm.UserSlider.pub_work = ''

			vm.togglePageslide = function(userIndex){

					console.log('im here');
					console.log(userIndex);
					console.log(vm.isearch_results);
					if (!vm.checked) {
						vm.UserSlider.displayName = vm.isearch_results[userIndex].displayName
						vm.UserSlider.photoUrl = vm.isearch_results[userIndex].photoUrl
						vm.UserSlider.primaryDepartment = vm.isearch_results[userIndex].primaryDepartment
						vm.UserSlider.titles = vm.isearch_results[userIndex].titles
						vm.UserSlider.expertiseAreas = vm.isearch_results[userIndex].expertiseAreas
						vm.UserSlider.bio = vm.isearch_results[userIndex].bio
						vm.UserSlider.shortBio = vm.isearch_results[userIndex].shortBio
						vm.UserSlider.publications = vm.isearch_results[userIndex].publications
						vm.UserSlider.courses = vm.isearch_results[userIndex].courses
						vm.UserSlider.pub_work = vm.isearch_results[userIndex].honorsAwards
						vm.UserSlider.eid = 'https://isearch.asu.edu/profile/' + vm.isearch_results[userIndex].eid
						// test results
						vm.UserSlider.audit_score = vm.isearch_results[userIndex].audit_score
						vm.UserSlider.audit_phone = vm.isearch_results[userIndex].audit_phone
						vm.UserSlider.audit_photoUrl = vm.isearch_results[userIndex].audit_photoUrl
						vm.UserSlider.audit_email = vm.isearch_results[userIndex].audit_email
						vm.UserSlider.audit_affiliationTitle = vm.isearch_results[userIndex].audit_affiliationTitle
						vm.UserSlider.audit_unitName = vm.isearch_results[userIndex].audit_unitName
						vm.UserSlider.audit_expertiseAreas = vm.isearch_results[userIndex].audit_expertiseAreas
						vm.UserSlider.audit_expertiseAreas_length = vm.isearch_results[userIndex].audit_expertiseAreas_length
						vm.UserSlider.audit_emplCat = vm.isearch_results[userIndex].audit_emplCat
						vm.UserSlider.audit_campus = vm.isearch_results[userIndex].audit_campus
						vm.UserSlider.audit_mailCode = vm.isearch_results[userIndex].audit_mailCode
						vm.UserSlider.audit_bio = vm.isearch_results[userIndex].audit_bio
						vm.UserSlider.audit_bio_min = vm.isearch_results[userIndex].audit_bio_min
						vm.UserSlider.audit_bio_max = vm.isearch_results[userIndex].audit_bio_max
						vm.UserSlider.audit_bio_1stPerson_warning = vm.isearch_results[userIndex].audit_bio_1stPerson_warning
						vm.UserSlider.audit_shortBio = vm.isearch_results[userIndex].audit_shortBio
						vm.UserSlider.audit_shortBio_max = vm.isearch_results[userIndex].audit_shortBio_max
						vm.UserSlider.audit_shortBio_1stPerson_warning = vm.isearch_results[userIndex].audit_shortBio_1stPerson_warning
						vm.UserSlider.audit_shortBio_firstName = vm.isearch_results[userIndex].audit_shortBio_firstName



					}

          vm.checked = !vm.checked;
      }


			// isearch Audit Filter
			vm.filterScore = function(prop, val) {
				console.log('filter ran');
				return function(user) {
					if(item[prop] > val) return true;
				}
			};

		} //end ReportsCtrl function

		// helper functions
		function calculateAverage(scores) {

			var total = 0;

			for (var i = 0; i < scores.length; i++) {
				total+=scores[i];
			}


			return total/scores.length;

		}

})();
