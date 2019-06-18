"use strict";

const mongoose = require(`mongoose`);
require(`mongoose-type-url`);
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	imageUrl: {
		type: mongoose.SchemaTypes.Url,
		default: `https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_960_720.png`,
		required: true
	}
});

module.exports = mongoose.model(`users`, UserSchema);
