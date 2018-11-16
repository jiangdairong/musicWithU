const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const songSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique:true
	},
	description:{
		type: String,
		required:true
	},
	language:{
		type: String,
		required:true
	},
	image:{
		type: String,
		required:true
	},
	featured:{
		type: Boolean,
		default:false
	},
},{
	timestamps: true
});

var Song = mongoose.model('Song',songSchema);

module.exports = Song;
