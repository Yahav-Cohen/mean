'use strict';

//Newmodules service used to communicate Newmodules REST endpoints
angular.module('newmodules').factory('Newmodules', ['$resource',
	function($resource) {
		return $resource('newmodules/:newmoduleId', { newmoduleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);