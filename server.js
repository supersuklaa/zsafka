
var express  = require('express');

var config = require('./config');
//var knex     = require('knex')(config.db);
var schema   = require('./schema');

var app      = express();

var port = process.env.PORT || 8080;


app.listen(port);
console.log("App listening on port " + port);
