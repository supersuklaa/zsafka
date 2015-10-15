
var express      = require('express');
var bodyParser   = require('body-parser'); 
var schema       = require('./schema');
var users        = require('./users');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var port = process.env.PORT || 8080;

// Routes

app.post('/create/table/', function(req, res) {
	schema.createTable(req.body.table);
});

app.post('/add/user/', function(req, res) {
	users.add(req.body.nimi);
	res.redirect('/');
});

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// Listen

app.listen(port);
console.log("App listening on port " + port);
