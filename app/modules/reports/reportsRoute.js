'use strict';

/**
 * @ngdoc function
 * @name app.route:reportsRoute
 * @description
 * # reportsRoute
 * Route of the app
 */

angular.module('reports')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.reports', {
				url:'/reports',
				templateUrl: 'app/modules/reports/reports.html',
				controller: 'ReportsCtrl',
				controllerAs: 'vm'
			});

		
	}]);
