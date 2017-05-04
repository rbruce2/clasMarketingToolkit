(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:reportsService
	 * @description
	 * # reportsService
	 * Service of the app
	 */

  	angular
		.module('reports')
		.factory('ReportsService', Reports);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Reports.$inject = ['$http'];

		function Reports ($http) {

		}

})();
