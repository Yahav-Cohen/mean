'use strict';

// Newmodules controller
angular.module('newmodules').controller('NewmodulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Newmodules',
	function($scope, $stateParams, $location, Authentication, Newmodules) {
		$scope.authentication = Authentication;

		// Create new Newmodule
		$scope.create = function() {
			// Create new Newmodule object
			var newmodule = new Newmodules ({
				name: this.name
			});

			// Redirect after save
			newmodule.$save(function(response) {
				$location.path('newmodules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Newmodule
		$scope.remove = function(newmodule) {
			if ( newmodule ) { 
				newmodule.$remove();

				for (var i in $scope.newmodules) {
					if ($scope.newmodules [i] === newmodule) {
						$scope.newmodules.splice(i, 1);
					}
				}
			} else {
				$scope.newmodule.$remove(function() {
					$location.path('newmodules');
				});
			}
		};

		// Update existing Newmodule
		$scope.update = function() {
			var newmodule = $scope.newmodule;

			newmodule.$update(function() {
				$location.path('newmodules/' + newmodule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Newmodules
		$scope.find = function() {
			$scope.newmodules = Newmodules.query();
		};

		// Find existing Newmodule
		$scope.findOne = function() {
			$scope.newmodule = Newmodules.get({ 
				newmoduleId: $stateParams.newmoduleId
			});
		};
	}
]);