'use strict';

//Test1s service used to communicate Test1s REST endpoints
angular.module('test1s').factory('Test1s', ['$resource',
	function($resource) {
		return $resource('test1s/:test1Id', { test1Id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);