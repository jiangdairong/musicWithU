const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const English = require('../models/english');

const englishRouter = express.Router();

englishRouter.use(bodyParser.json());

englishRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
    English.find(req.query)
    .then((english) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(english);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    English.create(req.body)
    .then((english) => {
        console.log('English Created ', english);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(english);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /english');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
  	English.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

englishRouter.route('/:englishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
    English.findById(req.params.englishId)
    .then((english) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(english);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /english/'+ req.params.englishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    English.findByIdAndUpdate(req.params.englishId, {
        $set: req.body
    }, { new: true })
    .then((english) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(english);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
    English.findByIdAndRemove(req.params.englishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

englishRouter.route('/:englishId/comments')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
	English.findById(req.params.englishId)
	.then((english) => {
		if(english != null){
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(english.comments);
		}
		else{
			err = new Error('English ' + req.params.englishId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	English.findById(req.params.englishId)
	.then((english) => {
		if(english != null ) {
			english.comments.push(req.body);
			english.save()
			.then((english) =>{
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(english);
			},(err) => next(err));
		}
		else {
			err = new Error('English ' + req.params.EnglishId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) =>next(err))
	.catch((err) => next(err));
})	
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /english/' + req.params.englishId + '/comments');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	Leaders.findById(req.params.englishId)
	.then((english) => {
		if(english != null){
			for(var i = (english.comments.length -1); i >=0 ; i --){
				english.comments.id(english.comments[i]._id).remove();
			}
			english.save()
			.then((english) => {
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(english);
			},(err)=>next(err));
		}
		else{
			err = new Error('English ' + req.params.englishId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
});

englishRouter.route('/:englishId/comments/:commentId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
	English.findById(req.params.englishId)
	.then((English) => {
		if(english != null && english.comments.id(req.params.commentId) != null){
			res.statusCode = 200;
			res.setHeader('Content-Type','application/json');
			res.json(english.comments.id(req.params.commentId));
		}
		else if(english == null){
			err = new Error('English ' + req.params.englishId + ' not found');
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
	res.end('POST operation not supported on /english/'+ req.params.englishId + '/comments/' + req.params.commentId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next) => {
	English.findById(req,params.englishId)
	.then((english) => {
		if(english != null && english.comments.id(req.params.commentId) != null){
			if(req.body.rating){	
				english.comments.id(req.params.commentId).rating = req.body.rating;
			}
			if(req.body.comment){
				english.comments.id(req.params.commentId).comment = req.body.comment;
			}
			english.save()
			.then((english) => {
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(english);
			},(err) => next(err));
		}
		else if(english == null){
			err = new Error('English ' + req.params.englishId + ' not found');
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
	English.findById(req.params.englishId)
	.then((english) => {
		if(english != null && english.comments.id(req.params.commentId) != null) {
			english.comments.id(req.params.commentId).remove();
			english.save()
			.then((english) => {
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				res.json(english);
			},(err) =>next(err));
		}
		else if(english == null){
			err= new Error('English ' + req.params.englishId + ' not found');
			err.status = 404;
			return next(err);
		}
	},(err) => next(err))
	.catch((err) => next(err));
});


module.exports = englishRouter;
