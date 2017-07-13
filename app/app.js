(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	angular.module('clas-marketing-tool-kit', [
		'ngResource',
		'ngAria',
		'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngAnimate',
		'ngSanitize',
		'ui.router',
		'home',
		'reports',
		'angularjs-gauge',
		'pageslide-directive',
		'angAccordion',
		'dcbImgFallback',
		'ngCsv'
	]);

})();
