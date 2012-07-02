/**
 * Module dependencies.
 * uploaded images are stored under 'my_dir'/images/ directory which can be accessed and shared.
 */
var my_dir = __dirname+'/public/';

var express = require('express'),
    routes = require('./routes'),
		mongoose = require('mongoose');

require('./upimage');

var app = module.exports = express.createServer();

var Image = mongoose.model('YouAdWorld');
var image = new Image();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
	//app.get('/', routes.index); first time load ~/public/index.html
	var html = require('fs').readFileSync(__dirname+'/public/index.html');
	res.end(html);
});

app.post('/api/photos', function(req, res) {
	//console.log(JSON.stringify(req.files));
	console.log(req.files);
	
	var serverPath = '/images/' + req.files.userPhoto.name;

	//image.name = req.files.userPhoto.name;
	image.name = serverPath;
	image.size = req.files.userPhoto.size;
	image.type = req.files.userPhoto.type;
	image.modifed = req.files.userPhoto.lastModifiedDate;

	image.save(function(err, res) {
		if(err) { throw err; }
		console.log(res);
	});


	require('fs').rename(
		req.files.userPhoto.path,
		my_dir + serverPath,
		function(error) {
			if(error) {
				res.send({
					error: 'Ah crap! Something bad happened'
				});
				return;
			}
			res.send({
				path: serverPath
			});
		}
	);	

	Image.find({}, function(err, docs) {
		console.log(docs);
	});
});


app.get('/list', function(req, res){
  var query = Image.find({});
	query.sort('date', 'descending');
	query.exec(function(err, docs) {
		if(err) {
			throw err;
		}
	  console.log(docs);
		res.render('list', {
			layout: false,
			locals: {
				files: docs
			}
		})
	});
});

app.get('/deletephoto/:id', function(req, res) {

	Image.findById(req.params.id, function(err, img) {
		console.log(img);
		img.remove(function(err) {
			if(!err) {
				console.log("removed");
				res.redirect('/list');
			}
			else {
				throw err;
			}
		});
	});
});



app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.distributeMessage = function(message){
	everyone.now.receiveMessage(message);
};
