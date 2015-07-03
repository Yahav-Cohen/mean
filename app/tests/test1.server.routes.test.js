'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Test1 = mongoose.model('Test1'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, test1;

/**
 * Test1 routes tests
 */
describe('Test1 CRUD tests', function() {
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

		// Save a user to the test db and create new Test1
		user.save(function() {
			test1 = {
				name: 'Test1 Name'
			};

			done();
		});
	});

	it('should be able to save Test1 instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test1
				agent.post('/test1s')
					.send(test1)
					.expect(200)
					.end(function(test1SaveErr, test1SaveRes) {
						// Handle Test1 save error
						if (test1SaveErr) done(test1SaveErr);

						// Get a list of Test1s
						agent.get('/test1s')
							.end(function(test1sGetErr, test1sGetRes) {
								// Handle Test1 save error
								if (test1sGetErr) done(test1sGetErr);

								// Get Test1s list
								var test1s = test1sGetRes.body;

								// Set assertions
								(test1s[0].user._id).should.equal(userId);
								(test1s[0].name).should.match('Test1 Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Test1 instance if not logged in', function(done) {
		agent.post('/test1s')
			.send(test1)
			.expect(401)
			.end(function(test1SaveErr, test1SaveRes) {
				// Call the assertion callback
				done(test1SaveErr);
			});
	});

	it('should not be able to save Test1 instance if no name is provided', function(done) {
		// Invalidate name field
		test1.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test1
				agent.post('/test1s')
					.send(test1)
					.expect(400)
					.end(function(test1SaveErr, test1SaveRes) {
						// Set message assertion
						(test1SaveRes.body.message).should.match('Please fill Test1 name');
						
						// Handle Test1 save error
						done(test1SaveErr);
					});
			});
	});

	it('should be able to update Test1 instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test1
				agent.post('/test1s')
					.send(test1)
					.expect(200)
					.end(function(test1SaveErr, test1SaveRes) {
						// Handle Test1 save error
						if (test1SaveErr) done(test1SaveErr);

						// Update Test1 name
						test1.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Test1
						agent.put('/test1s/' + test1SaveRes.body._id)
							.send(test1)
							.expect(200)
							.end(function(test1UpdateErr, test1UpdateRes) {
								// Handle Test1 update error
								if (test1UpdateErr) done(test1UpdateErr);

								// Set assertions
								(test1UpdateRes.body._id).should.equal(test1SaveRes.body._id);
								(test1UpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Test1s if not signed in', function(done) {
		// Create new Test1 model instance
		var test1Obj = new Test1(test1);

		// Save the Test1
		test1Obj.save(function() {
			// Request Test1s
			request(app).get('/test1s')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Test1 if not signed in', function(done) {
		// Create new Test1 model instance
		var test1Obj = new Test1(test1);

		// Save the Test1
		test1Obj.save(function() {
			request(app).get('/test1s/' + test1Obj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', test1.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Test1 instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Test1
				agent.post('/test1s')
					.send(test1)
					.expect(200)
					.end(function(test1SaveErr, test1SaveRes) {
						// Handle Test1 save error
						if (test1SaveErr) done(test1SaveErr);

						// Delete existing Test1
						agent.delete('/test1s/' + test1SaveRes.body._id)
							.send(test1)
							.expect(200)
							.end(function(test1DeleteErr, test1DeleteRes) {
								// Handle Test1 error error
								if (test1DeleteErr) done(test1DeleteErr);

								// Set assertions
								(test1DeleteRes.body._id).should.equal(test1SaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Test1 instance if not signed in', function(done) {
		// Set Test1 user 
		test1.user = user;

		// Create new Test1 model instance
		var test1Obj = new Test1(test1);

		// Save the Test1
		test1Obj.save(function() {
			// Try deleting Test1
			request(app).delete('/test1s/' + test1Obj._id)
			.expect(401)
			.end(function(test1DeleteErr, test1DeleteRes) {
				// Set message assertion
				(test1DeleteRes.body.message).should.match('User is not logged in');

				// Handle Test1 error error
				done(test1DeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Test1.remove().exec();
		done();
	});
});