'use strict';

//Setting up route
angular.module('newmodules').config(['$stateProvider',
	function($stateProvider) {
		// Newmodules state routing
		$stateProvider.
		state('listNewmodules', {
			url: '/newmodules',
			templateUrl: 'modules/newmodules/views/list-newmodules.client.view.html'
		}).
		state('createNewmodule', {
			url: '/newmodules/create',
			templateUrl: 'modules/newmodules/views/create-newmodule.client.view.html'
		}).
		state('viewNewmodule', {
			url: '/newmodules/:newmoduleId',
			templateUrl: 'modules/newmodules/views/view-newmodule.client.view.html'
		}).
		state('editNewmodule', {
			url: '/newmodules/:newmoduleId/edit',
			templateUrl: 'modules/newmodules/views/edit-newmodule.client.view.html'
		});
	}
]);