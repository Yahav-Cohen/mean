'use strict';

// Configuring the Articles module
angular.module('newmodules').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Newmodules', 'newmodules', 'dropdown', '/newmodules(/create)?');
		Menus.addSubMenuItem('topbar', 'newmodules', 'List Newmodules', 'newmodules');
		Menus.addSubMenuItem('topbar', 'newmodules', 'New Newmodule', 'newmodules/create');
	}
]);