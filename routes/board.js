/**
 * board.js contains all the board methods, including:
 * - addUser
 * - removeUser
 * - getBoardUsers
 * - add
 * - getAvailablePrivateBoards
 * - getPublic
 * - getByName
 * - deleteBoard
 * - getBoardPublic
 */

var Board = require('../models/boardModel.js');
var SVG = require('../models/svgModel.js');
var Edit = require('../models/editModel.js');
var Chat = require('../models/chatModel.js');

// Wrapping up all the methods
var boardRoutes = {};

boardRoutes.addUser = function(req,res) {
	var boardId = req.params.boardId;
	var user = req.params.userId;
	Board.findOneAndUpdate({_id:boardId}, {$push: {users: user}}, {new:true}, function (err, board) {
		if (!err) {
			res.json(board.users);
		}
		else {
			res.status(500).send('could not add the user to the board');
		}
	})
};

boardRoutes.removeUser = function(req, res) {
	var boardId = req.params.boardId;
	var user = req.params.userId;
	Board.findOneAndUpdate({_id:boardId}, {$pull: {users: user}}, {new:true}, function(err, board)  {
		if(!err) {
			res.json(board.users);
		} else {
			res.status(500).send('could not remove user from the board');
		}
	});
};

boardRoutes.getBoardUsers = function(req, res) {
	var boardId = req.params.boardId;

	Board.findOne({_id:boardId}).select('users').exec(function(err, board) {
		if(!err) {
			res.json(board);
		} else {
			res.status(500).send('could not get board');
		}
	});
};

boardRoutes.add = function(req,res) {
	dbBoardReq = req.body;
	var user = req.user.username;
	dbBoard = new Board({
		users: [user], 
		owner: user, 
		name: dbBoardReq.name, 
		isPublic: dbBoardReq.isPublic,
		tags: dbBoardReq.tags,
		timestamp: new Date()
	});

	dbBoard.save(function (err, savedBoard) {
		if (!err) {
			res.json(savedBoard); 
		} else {
			res.status(500).send('could not add board');
		}
	});
};

boardRoutes.getAvailablePrivateBoards = function(req, res) {
	if(req.user != null) {
		Board.find({isPublic:false, users:{'$in':[req.user.username]}}, function(err, boards) {
			if(!err) {
				if(boards) {
					res.json(boards);
				} else {
					res.status(404).send('could not find boards');
				}
			} else {
				res.status(500).send('error finding all boards');
			}
		});
	} else {
		res.status(403).send('not logged in');
	}
};

boardRoutes.getPublic = function(req,res) {
	Board.find({"isPublic": true}, function (err, publicBoards) {
		if(!err) {
			if(publicBoards) {
				res.json(publicBoards);
			} else {
				res.status(404).send('could not find any boards');
			}
		} else {
			res.status(500).send('error on finding public boards');
		}
	});
};

boardRoutes.getByName = function(req,res) {
	var name = req.params.name;
	Board.find({"name": name}).exec(function (err, match) {
		if (err) {
			res.status(500).send('could not get boards by that name');
		} else {
			res.json(match);
		}
	});
};

boardRoutes.deleteBoard = function(req,res) {
	var board = req.params;
	var removedAll = [];

	Board.remove({_id: board.boardId, owner: board.owner}, function (err) {
        if(!err) {
        	Edit.remove({boardId:board.boardId}, function(err) {
        		if(!err) {
					SVG.remove({boardId:board.boardId}, function(err) {
						if(!err) {
				        	Chat.remove({boardId:board.boardId}, function(err) {
				        		if(!err) {
				        			res.status(204).send('removed all board information');
				        		} else {
				        			res.status(500).send('error removing chats');
				        		}
				        	});
						} else {
							res.status(500).send('error removing associated svgs');
						}
					});
        		} else {
        			res.status(500).send('error removing edits');
        		}
        	});
        } else {
        	res.status(500).send('error removing board');
        }
    });
};

boardRoutes.getBoardPublic = function(req, res) {
	var boardId = req.params.boardId;

	Board.findOne({_id:boardId}).select('isPublic').exec(function(err, board) {
		if(!err) {
			res.json(board);
		} else {
			res.status(500).send('Error getting public/not public of board');
		}
	});
};

module.exports = boardRoutes;
