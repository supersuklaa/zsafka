

var express  = require('express');
var app      = express();

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8080;

var pg = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL
});

knex.schema.hasTable('users').then(function(exists) {
	if (!exists) {
		return knex.schema.createTable('users', function(t) {
			t.increments('id').primary();
			t.string('nimi', 100);
		});
	}
});

knex('users').insert({nimi: 'antti'})

app.listen(port);
console.log("App listening on port " + port);

