'use strict';

// Configuring the Articles module
angular.module('test1s').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Test1s', 'test1s', 'dropdown', '/test1s(/create)?');
		Menus.addSubMenuItem('topbar', 'test1s', 'List Test1s', 'test1s');
		Menus.addSubMenuItem('topbar', 'test1s', 'New Test1', 'test1s/create');
	}
]);