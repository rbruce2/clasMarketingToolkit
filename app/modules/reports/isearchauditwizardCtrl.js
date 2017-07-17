(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:isearchauditwizardCtrl
	* @description
	* # isearchauditwizardCtrl
	* Controller of the app
	*/

  	angular
		.module('reports')
		.controller('isearchauditwizardCtrl', iSearchAuditWizard);

		iSearchAuditWizard.$inject = ['ReportsService', '$rootScope', '$http', '$location'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function iSearchAuditWizard(ReportsService, $rootScope, $http, $location) {
			/*jshint validthis: true */
			var vm = this;
			vm.params = 18;
			// vm.params = $location.search();
			// console.log($location.search());


		} //end iSearchAuditWizardCtrl function

		// helper functions

})();
