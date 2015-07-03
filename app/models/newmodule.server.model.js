'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Newmodule Schema
 */
var NewmoduleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Newmodule name',
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

mongoose.model('Newmodule', NewmoduleSchema);