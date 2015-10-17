
var config     = require('./config');
var knex       = require('knex')(config.db);
var hash       = require('password-hash');
var _          = require('lodash');

// create table

var createTable = function(t, callback) {

	// msg (json) to client

	var msg = {};

	// model for database

	var dbModels = {
		users: function(t) {
			t.increments('id').primary();
			t.string('name', 100).unique();
			t.string('password', 100);
		},

		nutriments: function(t) {
			t.increments('id').primary();
			t.string('name', 100);
			t.float('fats').defaultTo(0);
			t.float('carbs').defaultTo(0);
			t.float('pros').defaultTo(0);
		},

		portions: function(t) {
			t.increments('id').primary();
			t.dateTime('date');
			t.integer('amount');
			t.integer('nutriment').references('id').inTable('nutriments');
			t.integer('user').references('id').inTable('users');
		}
	}

	// check if table is declared
	// then if it exists
	// if not, create it

	if (!_.isUndefined(dbModels[t])) {
		knex.schema.hasTable(t).then(function(exists) {
			if (!exists) {
				return knex.schema.createTable(t, dbModels[t]);
			}
		});
	}

	callback(msg);
}

var add = function (target, input, callback) { // TODO better naming for 'target'

	// msg to client (json)

	var msg = {}

	// tables for targets

	var table = {
		user: 'users',
		nutriment: 'nutriments',
		portion: 'portions'
	}

	// hash the password

	if (input.password) input.password = hash.generate(input.password);

	// actual sql-insert

	knex(table[target])
	.insert(input)
	.then(function() {
		msg.success = 'Added ' + target;
		msg.insert = input;
		callback(msg);
	})
	.catch(function(error) {
		msg.error = error;
		callback(msg);
	});

}

// exports

module.exports = {
	createTable: createTable,
	add: add
}

