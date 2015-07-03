'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Newmodule = mongoose.model('Newmodule'),
	_ = require('lodash');

/**
 * Create a Newmodule
 */
exports.create = function(req, res) {
	var newmodule = new Newmodule(req.body);
	newmodule.user = req.user;

	newmodule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newmodule);
		}
	});
};

/**
 * Show the current Newmodule
 */
exports.read = function(req, res) {
	res.jsonp(req.newmodule);
};

/**
 * Update a Newmodule
 */
exports.update = function(req, res) {
	var newmodule = req.newmodule ;

	newmodule = _.extend(newmodule , req.body);

	newmodule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newmodule);
		}
	});
};

/**
 * Delete an Newmodule
 */
exports.delete = function(req, res) {
	var newmodule = req.newmodule ;

	newmodule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newmodule);
		}
	});
};

/**
 * List of Newmodules
 */
exports.list = function(req, res) { 
	Newmodule.find().sort('-created').populate('user', 'displayName').exec(function(err, newmodules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newmodules);
		}
	});
};

/**
 * Newmodule middleware
 */
exports.newmoduleByID = function(req, res, next, id) { 
	Newmodule.findById(id).populate('user', 'displayName').exec(function(err, newmodule) {
		if (err) return next(err);
		if (! newmodule) return next(new Error('Failed to load Newmodule ' + id));
		req.newmodule = newmodule ;
		next();
	});
};

/**
 * Newmodule authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.newmodule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
