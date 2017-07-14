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
			})
			.state('home.webaudit',{
				url:'/reports/webaudit',
				templateUrl: 'app/modules/reports/webaudit.html',
				controller: 'ReportsCtrl',
				controllerAs: 'vm'
			})
			.state('home.isearchaudit',{
				url:'/reports/isearchaudit',
				templateUrl: 'app/modules/reports/isearchaudit.html',
				controller: 'ReportsCtrl',
				controllerAs: 'vm'
			})
			.state('home.isearchauditwizard',{
				url:'/reports/isearchauditwizard',
				templateUrl: 'app/modules/reports/isearchauditwizard.html',
				controller: 'isearchauditwizardCtrl',
				controllerAs: 'vm'
			});


	}]);
