const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Japan = require('../models/japan');

const japanRouter = express.Router();

japanRouter.use(bodyParser.json());

japanRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next) => {
	Japan.find({})
	.then((japan) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(japan);
	},(err) => next(err))
	.catch((err) => next(err));
})


.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next)=>{
	Promotions.create(req.body)
	.then((japan) => {
		console.log('Japan Created ',japan);
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(japan);
	},(err) => next(err))
	.catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next)=>{
	res.statusCode = 403;
	res.end('PUT operation not supported on /japan');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req,res,next)=>{
	Japan.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err) => next(err))
	.catch((err) => next(err));
});

japanRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); } )
.get(cors.cors,(req,res,next)=>{
	Japan.findById(req.params.japanId)
	.then((japan) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(japan);
	},(err) => next(err))
	.catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /japan/'+ req.params.japanId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
	Japan.findByIdAndUpdate(req.params.japanId, {
		$set: req.body	
	},{ new: true })
	.then((japan) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(japan);
	},(err) => next(err))
	.catch((err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyUser,(req, res, next) => {
	Japan.findByIdAndRemove(req.params.japanId)
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Contnet-Type','application/json');
		res.json(resp);
	},(err) => next(err))
	.catch((err) => next(err));
});

module.exports = japanRouter;
