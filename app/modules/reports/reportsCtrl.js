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

		Reports.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Reports() {
			/*jshint validthis: true */
			var vm = this;

		}

})();
