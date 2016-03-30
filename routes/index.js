var path = require('path');

var routes = {};

routes.home = function(req, res) {
	res.sendFile(__dirname + 'public/main.html');
}

routes.draw = function(req, res) {
	res.sendFile('drawing.html', { root: path.join(__dirname, '../public/') });
}

routes.dashboard = function(req, res) {
	res.sendFile('dashboard.html', { root: path.join(__dirname, '../public/') });
}

module.exports = routes;

