"use strict";

const mongoose = require(`mongoose`);
require(`mongoose-type-url`);
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	userName: {
		type: String,
		required: true
	},
	roles: {
		type: [String],
		enum: [`ADMIN`, `CIVILIAN`],
		default: [`CIVILIAN`]
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	imageUrl: {
		type: mongoose.SchemaTypes.Url,
		default: `https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_960_720.png`,
		required: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	lastModifiedDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model(`users`, UserSchema);
