'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Test1 = mongoose.model('Test1'),
	_ = require('lodash');

/**
 * Create a Test1
 */
exports.create = function(req, res) {
	var test1 = new Test1(req.body);
	test1.user = req.user;

	test1.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test1);
		}
	});
};

/**
 * Show the current Test1
 */
exports.read = function(req, res) {
	res.jsonp(req.test1);
};

/**
 * Update a Test1
 */
exports.update = function(req, res) {
	var test1 = req.test1 ;

	test1 = _.extend(test1 , req.body);

	test1.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test1);
		}
	});
};

/**
 * Delete an Test1
 */
exports.delete = function(req, res) {
	var test1 = req.test1 ;

	test1.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test1);
		}
	});
};

/**
 * List of Test1s
 */
exports.list = function(req, res) { 
	Test1.find().sort('-created').populate('user', 'displayName').exec(function(err, test1s) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test1s);
		}
	});
};

/**
 * Test1 middleware
 */
exports.test1ByID = function(req, res, next, id) { 
	Test1.findById(id).populate('user', 'displayName').exec(function(err, test1) {
		if (err) return next(err);
		if (! test1) return next(new Error('Failed to load Test1 ' + id));
		req.test1 = test1 ;
		next();
	});
};

/**
 * Test1 authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.test1.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
