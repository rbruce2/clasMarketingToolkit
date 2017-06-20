(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:reportsService
	 * @description
	 * # reportsService
	 * Service of the app
	 */

  	angular.module('reports')
		.factory('ReportsService', Reports);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Reports.$inject = ['$http', '$q', '$rootScope'];

		function Reports ($http, $q, $rootScope) {

			// var baseUrl = 'https://isearch.asu.edu/endpoints/dept-profiles/json/';

			return {
				getDepTree: function(success, error) {
					$http.get('depTree.json').then(success, error);
				},
				getDepInfo: function(depIds) {
					var promises = [];

					angular.forEach(depIds, function(depId) {
						var promise = $http.get('isearchproxy/' + depId);
						promises.push(promise);
					});

					// $rootScope.load_notes = 'loading dep ids: ' + promises;

					var depsInfo = $q.all(promises);
					return depsInfo

				},
				checkImageStatus: function (url, success, error) {
					$http.get('checkimagestatus?url=' + url).then(success, error)
				},
				isImage: function (photoUrls) {
						var promises = []

						angular.forEach(photoUrls, function(photoUrl) {
							var deferred = $q.defer();

	            var image = new Image();
	            image.onerror = function() {
	                deferred.resolve(false);
	            };
	            image.onload = function() {
	                deferred.resolve(true);
	            };
	            image.src = photoUrl;

							var promise =  deferred.promise;
							promises.push(promise);

						})

						var photoUrlStatus = $q.all(promises)
						return photoUrlStatus

				}
			};

		}

})();
