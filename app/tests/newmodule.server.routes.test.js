'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Newmodule = mongoose.model('Newmodule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, newmodule;

/**
 * Newmodule routes tests
 */
describe('Newmodule CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Newmodule
		user.save(function() {
			newmodule = {
				name: 'Newmodule Name'
			};

			done();
		});
	});

	it('should be able to save Newmodule instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Newmodule
				agent.post('/newmodules')
					.send(newmodule)
					.expect(200)
					.end(function(newmoduleSaveErr, newmoduleSaveRes) {
						// Handle Newmodule save error
						if (newmoduleSaveErr) done(newmoduleSaveErr);

						// Get a list of Newmodules
						agent.get('/newmodules')
							.end(function(newmodulesGetErr, newmodulesGetRes) {
								// Handle Newmodule save error
								if (newmodulesGetErr) done(newmodulesGetErr);

								// Get Newmodules list
								var newmodules = newmodulesGetRes.body;

								// Set assertions
								(newmodules[0].user._id).should.equal(userId);
								(newmodules[0].name).should.match('Newmodule Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Newmodule instance if not logged in', function(done) {
		agent.post('/newmodules')
			.send(newmodule)
			.expect(401)
			.end(function(newmoduleSaveErr, newmoduleSaveRes) {
				// Call the assertion callback
				done(newmoduleSaveErr);
			});
	});

	it('should not be able to save Newmodule instance if no name is provided', function(done) {
		// Invalidate name field
		newmodule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Newmodule
				agent.post('/newmodules')
					.send(newmodule)
					.expect(400)
					.end(function(newmoduleSaveErr, newmoduleSaveRes) {
						// Set message assertion
						(newmoduleSaveRes.body.message).should.match('Please fill Newmodule name');
						
						// Handle Newmodule save error
						done(newmoduleSaveErr);
					});
			});
	});

	it('should be able to update Newmodule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Newmodule
				agent.post('/newmodules')
					.send(newmodule)
					.expect(200)
					.end(function(newmoduleSaveErr, newmoduleSaveRes) {
						// Handle Newmodule save error
						if (newmoduleSaveErr) done(newmoduleSaveErr);

						// Update Newmodule name
						newmodule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Newmodule
						agent.put('/newmodules/' + newmoduleSaveRes.body._id)
							.send(newmodule)
							.expect(200)
							.end(function(newmoduleUpdateErr, newmoduleUpdateRes) {
								// Handle Newmodule update error
								if (newmoduleUpdateErr) done(newmoduleUpdateErr);

								// Set assertions
								(newmoduleUpdateRes.body._id).should.equal(newmoduleSaveRes.body._id);
								(newmoduleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Newmodules if not signed in', function(done) {
		// Create new Newmodule model instance
		var newmoduleObj = new Newmodule(newmodule);

		// Save the Newmodule
		newmoduleObj.save(function() {
			// Request Newmodules
			request(app).get('/newmodules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Newmodule if not signed in', function(done) {
		// Create new Newmodule model instance
		var newmoduleObj = new Newmodule(newmodule);

		// Save the Newmodule
		newmoduleObj.save(function() {
			request(app).get('/newmodules/' + newmoduleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', newmodule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Newmodule instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Newmodule
				agent.post('/newmodules')
					.send(newmodule)
					.expect(200)
					.end(function(newmoduleSaveErr, newmoduleSaveRes) {
						// Handle Newmodule save error
						if (newmoduleSaveErr) done(newmoduleSaveErr);

						// Delete existing Newmodule
						agent.delete('/newmodules/' + newmoduleSaveRes.body._id)
							.send(newmodule)
							.expect(200)
							.end(function(newmoduleDeleteErr, newmoduleDeleteRes) {
								// Handle Newmodule error error
								if (newmoduleDeleteErr) done(newmoduleDeleteErr);

								// Set assertions
								(newmoduleDeleteRes.body._id).should.equal(newmoduleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Newmodule instance if not signed in', function(done) {
		// Set Newmodule user 
		newmodule.user = user;

		// Create new Newmodule model instance
		var newmoduleObj = new Newmodule(newmodule);

		// Save the Newmodule
		newmoduleObj.save(function() {
			// Try deleting Newmodule
			request(app).delete('/newmodules/' + newmoduleObj._id)
			.expect(401)
			.end(function(newmoduleDeleteErr, newmoduleDeleteRes) {
				// Set message assertion
				(newmoduleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Newmodule error error
				done(newmoduleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Newmodule.remove().exec();
		done();
	});
});