var User = require('../models/userModel.js');

userRoutes = {};

userRoutes.getUser = function(req, res) {
	var usernameRegex = req.params.username;

	User.find({username:{'$regex':usernameRegex}}).select('username').exec(function(err, users) {
		if(!err) {
			if(users) {
				res.json(users);
			} else {
				res.status(404).send('could not find any users for that username');
			}
		} else {
			res.status(500).send('database error occurred');
		}
	});
}

module.exports = userRoutes;