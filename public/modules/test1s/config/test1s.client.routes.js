'use strict';

//Setting up route
angular.module('test1s').config(['$stateProvider',
	function($stateProvider) {
		// Test1s state routing
		$stateProvider.
		state('listTest1s', {
			url: '/test1s',
			templateUrl: 'modules/test1s/views/list-test1s.client.view.html'
		}).
		state('createTest1', {
			url: '/test1s/create',
			templateUrl: 'modules/test1s/views/create-test1.client.view.html'
		}).
		state('viewTest1', {
			url: '/test1s/:test1Id',
			templateUrl: 'modules/test1s/views/view-test1.client.view.html'
		}).
		state('editTest1', {
			url: '/test1s/:test1Id/edit',
			templateUrl: 'modules/test1s/views/edit-test1.client.view.html'
		});
	}
]);