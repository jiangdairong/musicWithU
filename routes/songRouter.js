const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Song = require('../models/song');

const songRouter = express.Router();

songRouter.use(bodyParser.json());

songRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
    Song.find(req.query)
	.populate('comments-author')
    .then((song) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(song);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Song.create(req.body)
    .then((song) => {
        console.log('Song Created ', song);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(song);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /song');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Song.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

songRouter.route('/:songId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
    Song.findById(req.params.songId)
	.populate('comments-author')
    .then((song) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(song);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /song/'+ req.params.songId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    Song.findByIdAndUpdate(req.params.songId, {
        $set: req.body
    }, { new: true })
    .then((song) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(song);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    Song.findByIdAndRemove(req.params.songId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

songRouter.route('/:songId/comments')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
	Song.findById(req.params.songId)
	.populate('comments.author')
	.then((song) => {
		if(song != null){
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(song.comments);
		}
		else{
			err = new Error('Song' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	Song.findById(req.params.songId)
	.then((Song) => {
		if(Song != null ) {
			req.body.author = req.user._id;
			song.comments.push(req.body);
			song.save()
			.then((song) =>{
				Song.findById(song._id)
				//.populate('comments.author')		
				.then((song) => {
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json(song);
				})		
			},(err) => next(err));
		}
		else {
			err = new Error('song ' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
})	
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /song/' + req.params.songId + '/comments');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	Song.findById(req.params.songId)
	.then((song) => {
		if(song != null){
			for(var i = (song.comments.length -1); i >=0 ; i --){
				song.comments.id(song.comments[i]._id).remove();
			}
			song.save()
			.then((song) => {
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(song);
			},(err)=>next(err));
		}
		else{
			err = new Error('Song' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
});

songRouter.route('/:songId/comments/:commentId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
	Song.findById(req.params.songId)
	.populate('comments.author')
	.then((song) => {
		if(song != null && song.comments.id(req.params.commentId) != null){
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(song.comments.id(req.params.commentId));
		}
		else if(song == null){
			err = new Error('Song' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
		else{
			err = new Error('Comment ' + req.params.commentId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) =>next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	res.statusCode = 403;
	res.end('POST operation not supported on /song/'+ req.params.songId + '/comments/' + req.params.commentId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	Song.findById(req,params.songId)
	.then((song) => {
		if(song != null && song.comments.id(req.params.commentId) != null){
			if(req.body.rating){	
				song.comments.id(req.params.commentId).rating = req.body.rating;
			}
			if(req.body.comment){
				song.comments.id(req.params.commentId).comment = req.body.comment;
			}
			song.save()
			.then((song) => {
				Song.findById(song._id)
				.populate('comment-author')
				.then((song) => {
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json(song);
				})
			},(err) => next(err));
		}
		else if(song == null){
			err = new Error('Song ' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment ' + req.params.commentId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	Song.findById(req.params.songId)
	.then((song) => {
		if(song != null && song.comments.id(req.params.commentId) != null) {
			song.comments.id(req.params.commentId).remove();
			song.save()
			.then((song) => {
				Song.findById(song._id)
				.populate('comments.author')
				.then((song) => {
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json(song);
				})
			},(err) =>next(err));
		}
		else if(song == null){
			err= new Error('Song ' + req.params.songId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
});


module.exports = songRouter;
