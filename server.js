
var express      = require('express');
var bodyParser   = require('body-parser');
var db           = require('./database');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var port = process.env.PORT || 8080;

// routes

// create table

app.get('/create/table/:table', function(req, res) {
	db.createTable(req.params.table, function(msg) {
		res.json(msg);
	});
});


// add nutriment

app.post('/add/nutri/', function(req, res) {

  var input = {
  	name: req.body.name,
  	fats: req.body.fats,
  	carbs: req.body.carbs,
  	pros: req.body.pros
  }

	db.addNutri(input, function(msg) {
		res.json(msg);
	});

});

// add user

app.post('/add/user/', function(req, res) {

  var input = {
  	name: req.body.name,
  	password: req.body.password
  }

	db.addUser(input, function(msg) {
		res.json(msg);
	});

});

// actual html-page, angular handles front-end rendering

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// listen

app.listen(port);
console.log("App listening on port " + port);
