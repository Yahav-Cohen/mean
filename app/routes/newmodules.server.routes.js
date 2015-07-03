'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var newmodules = require('../../app/controllers/newmodules.server.controller');

	// Newmodules Routes
	app.route('/newmodules')
		.get(newmodules.list)
		.post(users.requiresLogin, newmodules.create);

	app.route('/newmodules/:newmoduleId')
		.get(newmodules.read)
		.put(users.requiresLogin, newmodules.hasAuthorization, newmodules.update)
		.delete(users.requiresLogin, newmodules.hasAuthorization, newmodules.delete);

	// Finish by binding the Newmodule middleware
	app.param('newmoduleId', newmodules.newmoduleByID);
};
