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
			var overallScores = [];
			// loading text/gif
			vm.loading = false;


			// load depTree.json file
			ReportsService.getDepTree(function(res) {
					console.log(res);
					clasDepTree = res.data[0].children[15].children[16];
			}, function(res_err) {
					console.log(res_err);
			});

			vm.startProfileAudit = function () {

				var depIdsToApi = [];
				vm.isearch_results = []
				$rootScope.load_notes = 0;
				vm.ranReport = true;
				vm.loading = true;

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
					for (var i = 0; i < res.length; i++) {
						for (var x = 0; x < res[i].data.length; x++) {
								vm.isearch_results.push(res[i].data[x]);
								// overallScores.push(totalScore);
						}
					}

					return checkImageExists(vm.isearch_results)

					}, function(res_err) {
						console.log('error')
						console.log(res_err)
					})

			}; //end startProfileAudit


			// run picture test
			vm.pictureStatusArray = []
			function checkImageExists(result) {
				console.log(result);
			  var imgUrls = []
				for (var i = 0; i < vm.isearch_results.length; i++) {
					console.log(vm.isearch_results[i].photoUrl)
					imgUrls.push(vm.isearch_results[i].photoUrl)
				}
				ReportsService.isImage(imgUrls).then(function(res) {
					console.log(res);
					vm.pictureStatusArray = res
				}).then(function(res) {
					return testAllProfiles(res)
				})
			}


			// run tests
			function testAllProfiles() {
				console.log(vm.pictureStatusArray);
				console.log(vm.isearch_results);

				//run all tests
				for (var i = 0; i < vm.isearch_results.length; i++) {

					// merge pictureStatusArray results to isearch_results
					vm.isearch_results[i].audit_photoUrlStatus = vm.pictureStatusArray[i]

					//setup index identifier for filter
					vm.isearch_results[i].idxIdentifier = i

					var pass = 15;
					var totalScore = 0;

					// Phone Number (1pt)
					if (!vm.isearch_results[i].phone) {
						vm.isearch_results[i].audit_phone = 'fail';
						pass--;
					}

					// Photo (1pt)
					if (!vm.isearch_results[i].photoUrl) {
						vm.isearch_results[i].audit_photoUrl = 'fail';
						pass--;
					}

					if (vm.isearch_results[i].audit_photoUrlStatus === false) {
						vm.isearch_results[i].audit_photoUrl = 'fail'
						pass--;
					}

					// Email address (1pt)
					if (!vm.isearch_results[i].emailAddress) {
						vm.isearch_results[i].audit_email = 'fail';
						pass--;
					}

					// Affiliation title (1pt)
					if (!vm.isearch_results[i].primaryDepartment) {
						vm.isearch_results[i].audit_affiliationTitle = 'fail';
						pass--;
					}

					// Unit name (1pt)
					if (!vm.isearch_results[i].primaryiSearchDepartmentAffiliation) {
						vm.isearch_results[i].audit_unitName = 'fail';
						pass--;
					}

					// expertiseAreas (1pt)
					if (!vm.isearch_results[i].expertiseAreas) {
						vm.isearch_results[i].audit_expertiseAreas = 'fail';
						console.log('no expertise areas');
						pass--;
					}else if (vm.isearch_results[i].expertiseAreas.length <= 1) {
						console.log('need more than 1 expertise area');
						vm.isearch_results[i].audit_expertiseAreas_length = 'shoud have more than one expertise area';
						pass--;
					}

					// Employee category (1pt)
					if (!vm.isearch_results[i].primarySimplifiedEmplClass) {
						vm.isearch_results[i].audit_emplCat = 'fail';
						pass--;
					}

					// Campus location (1pt)
					if (!vm.isearch_results[i].primaryJobCampus) {
						vm.isearch_results[i].audit_campus = 'fail';
						pass--;
					}

					// Mailcode (1pt)
					if (!vm.isearch_results[i].primaryMailCode) {
						vm.isearch_results[i].audit_mailCode = 'fail';
						pass--;
					}

					// Bio (word limit: 100min 300max) (3rd person) (no primary affiliations) (3pt)
					if (!vm.isearch_results[i].bio) {
						vm.isearch_results[i].audit_bio = 'No bio found';
						pass = pass - 3
					}

					else if (vm.isearch_results[i].bio) {
						var words = vm.isearch_results[i].bio.split(' ')
						var wordCount = vm.isearch_results[i].bio.split(' ').length

						// min bio word limit
						if (wordCount < 100) {
							console.log('Bio must be at least 100 words in length');
							vm.isearch_results[i].audit_bio_min = 'Bio must be at least 100 words in length'
							pass--;
						}

						// max bio word limit
						if (wordCount > 300) {
							console.log('Bio must be less than 300 words in length');
							vm.isearch_results[i].audit_bio_max = 'Bio must be less than 300 words in length'
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
								vm.isearch_results[i].audit_bio_1stPerson_warning = 'fail'
								pass--;
								break
							}
						}
					}

					// Short Bio (word limit: 40max) (3rd person) (no full name just last) (3pt)
					if (!vm.isearch_results[i].shortBio) {
						vm.isearch_results[i].audit_shortBio = 'No shortBio found';
						pass = pass - 3
					}

					else if (vm.isearch_results[i].shortBio) {
						var words = vm.isearch_results[i].shortBio.split(' ')
						var wordCount = vm.isearch_results[i].shortBio.split(' ').length

						// max shortBio word limit
						if (wordCount > 40) {
							console.log('Short Bio must be less than 40 words in length');
							vm.isearch_results[i].audit_shortBio_max = 'Bio must be less than 40 words in length'
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
							else if ( words[w] == vm.isearch_results[i].firstName ) {
								console.log(words[w]);
								firstNameCount++
							}
							if (pronounCount >= 1 && firstNameCount >= 1) {
								console.log('first person and first name fail');
								vm.isearch_results[i].audit_shortBio_1stPerson_warning = 'fail'
								vm.isearch_results[i].audit_shortBio_firstName = 'fail'
								pass = pass - 2;
								break
							}
							if (pronounCount >= 1 && w + 1 == words.length) {
								console.log('third person fail');
								vm.isearch_results[i].audit_shortBio_1stPerson_warning = 'fail'
								pass--
							}
							if (firstNameCount >= 1 && w + 1 == words.length) {
								console.log('first name fail');
								vm.isearch_results[i].audit_shortBio_firstName = 'fail'
								pass--
							}
						}
					}


					// Education
					// if (!vm.isearch_results[i].education) {
					// 	vm.isearch_results[i].audit_education = 'fail';
					// 	pass--;
					// }


					totalScore = pass/15 * 100;

					vm.isearch_results[i].audit_score = totalScore;
					overallScores.push(totalScore);

				}

				vm.overall_total = calculateAverage(overallScores);
				vm.reportDone = true;
				vm.loading = false;


			}//end testAllProfiles


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


			// isearch Audit Filter (less than)
			vm.scoreFilter = 100
			vm.lessThan = function(prop, val) {
				return function(user) {
					if(user[prop] < val) return true;
				}
			};

			//print report contents
			vm.printDiv = function() {
			  var printContents = document.getElementById('reportResults').innerHTML;
			  var popupWin = window.open('', '_blank', 'width=800,height=600');
			  popupWin.document.open();
			  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/app/assets/css/reports.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
			  popupWin.document.close();
			}

			var originatorEv;

	    this.menuHref = "http://www.google.com/design/spec/components/menus.html#menus-specs";

	    this.openMenu = function($mdMenu, ev) {
	      originatorEv = ev;
	      $mdMenu.open(ev);
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
