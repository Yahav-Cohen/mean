'use strict';

// Test1s controller
angular.module('test1s').controller('Test1sController', ['$scope', '$stateParams', '$location', 'Authentication', 'Test1s',
	function($scope, $stateParams, $location, Authentication, Test1s) {
		$scope.authentication = Authentication;

		// Create new Test1
		$scope.create = function() {
			// Create new Test1 object
			var test1 = new Test1s ({
				name: this.name
			});

			// Redirect after save
			test1.$save(function(response) {
				$location.path('test1s/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Test1
		$scope.remove = function(test1) {
			if ( test1 ) { 
				test1.$remove();

				for (var i in $scope.test1s) {
					if ($scope.test1s [i] === test1) {
						$scope.test1s.splice(i, 1);
					}
				}
			} else {
				$scope.test1.$remove(function() {
					$location.path('test1s');
				});
			}
		};

		// Update existing Test1
		$scope.update = function() {
			var test1 = $scope.test1;

			test1.$update(function() {
				$location.path('test1s/' + test1._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Test1s
		$scope.find = function() {
			$scope.test1s = Test1s.query();
		};

		// Find existing Test1
		$scope.findOne = function() {
			$scope.test1 = Test1s.get({ 
				test1Id: $stateParams.test1Id
			});
		};
	}
]);