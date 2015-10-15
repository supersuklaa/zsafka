var config = require('./config');

var express  = require('express');
var app      = express();
//var pg       = require('pg');
var knex     = require('knex')(config.db);

var port = process.env.PORT || 8080;

/*
knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('first_name', 100);
      t.string('last_name', 100);
      t.text('bio');
    });
  }
});*/

knex('users').insert({first_name: 'etu', last_name: 'suku'})

app.listen(port);
console.log("App listening on port " + port);