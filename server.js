
var express  = require('express');
var bodyParser = require('body-parser'); 

var schema   = require('./schema');

var app      = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var port = process.env.PORT || 8080;

// Routes

app.get('/create/table/:table', function(req, res) {
	schema.createTable(req.params.table);
	res.send("JESA");
});

app.listen(port);
console.log("App listening on port " + port);
