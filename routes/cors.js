const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://165.227.72.244:3000','https://165.227.72.244:3443','http://165.227.72.244:3001','http://www.jiangdai.me:3001','http://165.227.72.244:3003'];

var corsOptionsDelegate = (req,callback) => {
	var corsOptions

	if(whitelist.indexOf(req.header('Origin')) != -1) {
		corsOptions = { origin: true };
	}
	else{
		corsOptions = { origin: false };
	}
	callback(null,corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
