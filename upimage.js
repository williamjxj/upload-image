
var mongohq_url = 'mongodb://williamjxj:Benjamin001@flame.mongohq.com:27075/williamjxj';

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

mongoose.connect(mongohq_url);

//	size: { type: String, match: /(\d\.\w)/ }
var FileSchema = new Schema({
	  name: { type: String, index: true }
	, type: { type: String }
	, size: { type: String }
	, modified: String
	, date: { type: Date, default: Date.now }
});

FileSchema.path('name').set(function(v) {
	return v;
});

FileSchema.pre('save', function(next) {
	//notify(this.get('email'));
	next();
});

var UpImage = mongoose.model('UpImage', FileSchema);

exports.FileSchema = FileSchema;

