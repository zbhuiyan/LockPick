/**
 * user.js contains methods to get the current user and to search for a specific user
 */
 
var User = require('../models/userModel.js');

userRoutes = {};

userRoutes.currentUser = function(req, res) {
	res.json(req.user);
}

userRoutes.getUser = function(req, res) {
	var usernameRegex = req.params.username;

	User.find({username:{'$regex':usernameRegex}}).select('username').exec(function(err, users) {
		if(!err) {
			if(users) {
				res.json(users);
			} else {
				res.status(404).send('Could not find any users for that username');
			}
		} else {
			res.status(500).send('Database error occurred');
		}
	});
}

module.exports = userRoutes;
