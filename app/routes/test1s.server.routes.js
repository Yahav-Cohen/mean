'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var test1s = require('../../app/controllers/test1s.server.controller');

	// Test1s Routes
	app.route('/test1s')
		.get(test1s.list)
		.post(users.requiresLogin, test1s.create);

	app.route('/test1s/:test1Id')
		.get(test1s.read)
		.put(users.requiresLogin, test1s.hasAuthorization, test1s.update)
		.delete(users.requiresLogin, test1s.hasAuthorization, test1s.delete);

	// Finish by binding the Test1 middleware
	app.param('test1Id', test1s.test1ByID);
};
