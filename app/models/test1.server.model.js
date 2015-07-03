'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Test1 Schema
 */
var Test1Schema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Test1 name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Test1', Test1Schema);