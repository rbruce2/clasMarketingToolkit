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

			vm.testAlert = function() {
				console.log(vm.department);
				ReportsService.getHello();
				ReportsService.getDepInfo(vm.department, function(res) {
					console.log(res);

				}, function(res_err) {
					console.log('error');
					console.log(res_err);
				});
			}



		}

})();
