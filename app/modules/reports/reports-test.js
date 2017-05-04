(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:reportsTest
	 * @description
	 * # reportsTest
	 * Test of the app
	 */

	describe('reports test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('clas-marketing-tool-kit');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('ReportsCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
