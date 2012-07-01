/**
 * Module dependencies.
 * uploaded images are stored under 'my_dir'/images/ directory which can be accessed and shared.
 */
var my_dir = __dirname.'/upload-app/public/';

var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

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
	console.log(JSON.stringify(req.files));
	
	var serverPath = '/images/' + req.files.userPhoto.name;
	
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
});

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.distributeMessage = function(message){
	everyone.now.receiveMessage(message);
};
