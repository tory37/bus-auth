"use strict";

const Validator = require(`validator`);
const isEmpty = require(`is-empty`);
const { addErrorMessages } = require(`../utils/errorHandler`);

module.exports = function validateRegisterInput(data, errors) {
	// Convert empty fields to an empty string so we can use validator functions
	data.name = !isEmpty(data.name) ? data.name : ``;
	data.email = !isEmpty(data.email) ? data.email : ``;
	data.password = !isEmpty(data.password) ? data.password : ``;
	data.password2 = !isEmpty(data.password2) ? data.password2 : ``;

	// Email checks
	if (Validator.isEmpty(data.email)) {
		addErrorMessages(`Email field is required`);
	} else if (!Validator.isEmail(data.email)) {
		addErrorMessages(`Email is invalid`);
	}

	// Password checks
	if (Validator.isEmpty(data.password)) {
		addErrorMessages(`Password field is required`);
	}

	if (Validator.isEmpty(data.password2)) {
		addErrorMessages(`Confirm password field is required`);
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		addErrorMessages(`Password must be at least 6 characters`);
	}
	if (!Validator.equals(data.password, data.password2)) {
		addErrorMessages(`Passwords must match`);
	}

	return isEmpty(errors.messages);
};
