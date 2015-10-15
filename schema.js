/*
var config      = require('./config');
var knex        = require('knex')(config.db);
*/
var db = {};

db.create = function (knex) {

	return knex.schema.
		createTable('users', function(t) {
			t.increments('id').primary();
			t.string('nimi', 100);
			t.string('password', 100);
		}).
		createTable('safkat', function(t) {
			t.increments('id').primary();
			t.string('nimi', 100);
			t.float('rasva');
			t.float('hiilari');
			t.float('protsku');
		}).
		createTable('annokset', function(t) {
			t.increments('id').primary();
			t.dateTime('date');
			t.integer('maara');
			t.integer('safka').references('id').inTable('safkat');
			t.integer('user').references('id').inTable('users');
		});
/*		
	return knex.schema.
		hasTable('users').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('users', function(t) {
					t.increments('id').primary();
					t.string('nimi', 100);
					t.string('password', 100);
				});
			}
		}).

		hasTable('safkat').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('safkat', function(t) {
					t.increments('id').primary();
					t.string('nimi', 100);
					t.float('rasva');
					t.float('hiilari');
					t.float('protsku');
				});
			}
		}).

		hasTable('annokset').then(function(exists) {
			if (!exists) {
				return knex.schema.createTable('annokset', function(t) {
					t.increments('id').primary();
					t.dateTime('date');
					t.integer('maara');
					t.integer('safka').references('id').inTable('safkat');
					t.integer('user').references('id').inTable('users');
				});
			}
		});
*/
}

// Module exports
module.exports = db;