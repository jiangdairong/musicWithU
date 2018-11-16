const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Favorites = require('../models/favorite');
const Song = require('../models/song');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res) => {res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next) =>{
	Favorites.findOne({user: req.user._id})
	.populate('user')
	.populate('song')
	.exec((err,favorites) =>{
		if (err) return next(err);
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(favorites);
	});
})


.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorite) =>{
		if(favorite){
			for(var i=0; i<req.body.length;i++){
				if(favorite.song.indexOf(req.body[i]._id ===-1 )){
					favorite.song.push(req.body[i]._id);
				}
			}
			favorite.save()
	 		.then((favorite) => {
				Favorites.findById(favorite._id)
				.populate('user')
				.populate('song')
				.then((favorite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json(favorition);
				})
			},(err) => next(err));
		}
		else{
			Favorite.create({"user":req.user._id,"song":req.body})
			.then((favorite) =>{
				Favorites.findById(favorite._id)
				.populate('user')
				.populate('song')
				.then((favorite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);
				})
			})
			.catch((err) => {
				return next(err);
			});
		}	
	},(err) => next(err))
	.catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOneAndRemove({"user":req.user._id})
	.then((resp) => {
		res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
	},(err) => next(err))
	.catch((err) => next(err));
});

favoriteRouter.route('/:songId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.song.indexOf(req.params.songId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.song.indexOf(req.params.songId) === -1) {
                favorite.song.push(req.params.songId)
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
					.populate('user')
					.populate('song')
					.then((favorite) => {
						res.statusCode = 200;
                    	res.setHeader('Content-Type', 'application/json');
                    	res.json(favorite);
					})	
                })
				.catch((err) => {
					return next(err);
				})
            }
        }
        else {
            Favorites.create({"user": req.user._id, "song": [req.params.songId]})
            .then((favorite) => {
				Favorites.findById(favorite._id)
				.populate('user')
				.populate('song')
				.then((favorite) => {
                	res.statusCode = 200;
               		res.setHeader('Content-Type', 'application/json');
                	res.json(favorite);
				})
            })
			.catch((err) => {
				return next(err);
			});
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.songId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.song.indexOf(req.params.songId);
            if (index >= 0) {
                favorite.song.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
					.populate('user')
					.populate('song')
					.then((favorite) => {
						res.statusCode = 200;
                    	res.setHeader('Content-Type', 'application/json');
                    	res.json(favorite);
					})
                })
				.catch((err) => {
					return next(err);
				})
            }
            else {
                err = new Error('Song ' + req.params.songId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;

