
var config      = require('./config');
var knex        = require('knex')(config.db);

var createTables = function() {

	knex.schema.hasTable('users').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('users', function(t) {
				t.increments('id').primary();
				t.string('nimi', 100);
				t.string('password', 100);
			});
		}
	});

	knex.schema.hasTable('safkat').then(function(exists) {
		if (!exists) {
			return knex.schema.createTable('safkat', function(t) {
				t.increments('id').primary();
				t.string('nimi', 100);
				t.float('rasva').defaultTo(0);
				t.float('hiilari').defaultTo(0);
				t.float('protsku').defaultTo(0);
			});
		}
	});

	knex.schema.hasTable('annokset').then(function(exists) {
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

}

module.exports = {
	createTables: createTables
}