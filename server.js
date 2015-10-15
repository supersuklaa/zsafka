
var express  = require('express');
var bodyParser = require('body-parser'); 

var schema   = require('./schema');

var app      = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var port = process.env.PORT || 8080;

// Routes

app.get('/createTables', function(req, res) {
	schema.createTables();
});

app.listen(port);
console.log("App listening on port " + port);
