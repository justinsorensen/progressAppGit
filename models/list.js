var mongoose = require( 'mongoose' );
var config = require('../config');
//var db = mongoose.connect(config.development.dbUrl);
var Schema   = mongoose.Schema;		//TESTING REMOVAL


var ListSchema = new mongoose.Schema({
	name: String,
	userID: String,
	item: [{
		value: { type: Number, default: 1 },
		date: { type: Date, default: Date.now }
	}],
	dateCreated: { type: Date, defualt: Date.now },
	tag: { type: String, default: " " },
	note: String,
	unit: String
});

var List = mongoose.model('List', ListSchema);

module.exports = List;							//exports module for use elsewhere