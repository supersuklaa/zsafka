var _           = require('lodash');
var config      = require('./config');
var knex        = require('knex')(config.db);

// Delcaring tables and their columns

var tableSchema = {
	users: function(t) {
		t.increments('id').primary();
		t.string('nimi', 100);
		t.string('password', 100);
	},

	safkat: function(t) {
		t.increments('id').primary();
		t.string('nimi', 100);
		t.float('rasva').defaultTo(0);
		t.float('hiilari').defaultTo(0);
		t.float('protsku').defaultTo(0);
	},

	annokset: function(t) {
		t.increments('id').primary();
		t.dateTime('date');
		t.integer('maara');
		t.integer('safka').references('id').inTable('safkat');
		t.integer('user').references('id').inTable('users');
	}
}

// Check if table is declared and then if it exists,
// and create it if not

var createTable = function(table) {
	if (!_.isUndefined(tableSchema[table])) {
		knex.schema.hasTable(table).then(function(exists) {
			if (!exists) {
				return knex.schema.createTable(table, tableSchema[table]);
			}
		});
	}
}

// Exports

module.exports = {
	createTable: createTable
}