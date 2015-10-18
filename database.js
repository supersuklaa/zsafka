
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
	// check if it exists (in postgres)
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

	// sql explained:

	// join nutriments and portions via nutriments.id
	// select date, names and sums of nutriments
	// where user is da user
	// group by date, name

	knex('portions')
		.join('nutriments', 'nutriments.id', 'portions.nutriment')
		.select(knex.raw("to_char(portions.date, 'DD.MM.YY') as date"))
		.select('nutriments.name').sum('portions.amount as amount')
		.where('portions.user', user)
		.groupBy('portions.date', 'nutriments.name')
		.then(function(data) {
			callback(data);
		});
}

// get daily nutritional values of a user

var dailyvalues = function (user, callback) {

	// sql explained:

	// join nutriments and portions via nutriments.id
	// select date
	// calculate nutrional values per date:
	// --- value * amount / 100
	// --- divided by 100 because values are issued per 100 grams
	// where user is da user
	// group by date
	// order by desc date so latest are listed first

	knex('portions')
		.join('nutriments', 'nutriments.id', 'portions.nutriment')
		.select(knex.raw("to_char(portions.date, 'DD.MM.YY') as date"))
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

var login = function (input, callback) {

	// sql query

	knex('users')
		.select('password', 'id', 'name')
		.where({ name: input.username })
		.then(function(data) {

			var result = data[0];

			if (result) {
				// compare passwords

				if (hash.verify(input.password, result.password)) {
					callback(result.id, result.name);

				} else { callback() }
			} else { callback() }

		});

}

// exports

module.exports = {
	createTable: createTable,
	add: add,
	dailyportions: dailyportions,
	dailyvalues: dailyvalues,
	login: login
}

