
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
			t.date('date').defaultTo(knex.raw('now()'));
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

// add user, nutriment or portion

var add = function (target, input, callback) {

	// TODO better naming for 'target'

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

// get daily portions of a user

var dailyportions = function (user, callback) {

	// inb4 complex knex-sql-scheise

	// sql explained:

	// join nutriments and portions
	// select date, names and sums of nutriments
	// where user is da user
	// group by date, name
	// --> profit???

	knex('portions')
		.join('nutriments', 'nutriments.id', 'portions.nutriment')
		.select('portions.date', 'nutriments.name').sum('portions.amount as amount')
		.where('portions.user', user)
		.groupBy('portions.date', 'nutriments.name')
		.then(function(data) {
			callback(data);
		});
}

// get daily nutritional values of a user

var dailyvalues = function (user, callback) {

	knex('portions')
		.join('nutriments', 'nutriments.id', 'portions.nutriment')
		.select('portions.date')
		.select(knex.raw('sum(nutriments.fats * portions.amount / 100) as fats'))
		.select(knex.raw('sum(nutriments.carbs * portions.amount / 100) as carbs'))
		.select(knex.raw('sum(nutriments.pros * portions.amount / 100) as pros'))
		.where('portions.user', user)
		.groupBy('portions.date')
		.orderBy('portions.date', 'desc')
		.then(function(data) {
			callback(data);
		});

}

// exports

module.exports = {
	createTable: createTable,
	add: add,
	dailyportions: dailyportions,
	dailyvalues: dailyvalues
}

