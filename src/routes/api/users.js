"use strict";

const express = require(`express`);
const router = express.Router();
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
const keys = require(`../../../config/keys`);

// Load input validation
const validateRegisterInput = require(`../../validation/register`);
const validateLoginInput = require(`../../validation/login`);
// Load User model
const User = require(`../../models/User`);
const { addErrorMessages, createErrorObject } = require(`../../utils/errorHandler`);

// router.get(`/`, passport.authenticate(`jwt`), (req, res, next) => {
// 	const errorObject = createErrorObject();

// 	const id = req.body.id;
// 	User.findOne({ id }).then(user => {
// 		if (!user) {
// 			addErrorMessages(errorObject, `User with id \${id} not found`);
// 			return res.status(404).json(errorObject);
// 		} else {
// 			return
// 		}
// 	});
// });

// @route POST api/users/register
// @desc Register user
// @access Public
router.post(`/register`, (req, res, next) => {
	try {
		console.log(`Hit Register`);
		let errorObject = createErrorObject();
		// Form validation
		const isValid = validateRegisterInput(req.body, errorObject);
		// Check validation
		if (!isValid) {
			return res.status(400).json(errorObject);
		}
		User.findOne({ email: req.body.email }).then(user => {
			if (user) {
				addErrorMessages(errorObject, `Email already exists`);
				return res.status(400).json(errorObject);
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});
				// Hash password before saving in database
				bcrypt.genSalt(10, (err, salt) => {
					if (err) throw err;
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					});
				});
			}
		});
	} catch (err) {
		next(err);
	}
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post(`/login`, (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;
	// Find user by email
	User.findOne({ email }).then(user => {
		// Check if user exists
		if (!user) {
			return res.status(404).json({ emailNotfound: `Email not found` });
		}
		// Check password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id
				};
				// Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 172800 // 1 year in seconds
					},
					(err, token) => {
						if (err) throw err;
						res.json({
							success: true,
							token: `Bearer ` + token,
							user: {
								id: user.id,
								name: user.name,
								email: user.email,
								imageUrl: user.imageUrl
							}
						});
					}
				);
			} else {
				return res.status(400).json({ passwordincorrect: `Password incorrect` });
			}
		});
	});
});

// router.post(`/user/avatar`, passport.authenticate(`jwt`), (req, res) => {
// 	let errorObject = createErrorObject();
// 	const query = { email: req.user.email };
// 	User.findOneAndUpdate(
// 		query,
// 		{ imageUrl: req.imageUrl },
// 		{
// 			runValidators: true
// 		},

// 	);

// 	User.findOne({ email }).then(user => {
// 		if (!user) {
// 			addErrorMessages(errorObject, `User not found`);
// 			return res.status(400).json(errorObject);
// 		} else {
// 		}
// 	});
// });

module.exports = router;
