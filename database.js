
var config     = require('./config');
var knex       = require('knex')(config.db);
var hash       = require('password-hash');
var _          = require('lodash');

var createTable = function(t, callback) {

	// msg (json) to be sent to angular

	var msg = {};

	// model for database

	var dbModel = {
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

	// check if table is declared and then if it exists,
	// and create it if not

	if (!_.isUndefined(dbModel[t])) {
		knex.schema.hasTable(t).then(function(exists) {
			if (!exists) {
				return knex.schema.createTable(t, dbModel[t]);
			}
		});
	}

	else {
		msg.error = 'No model for table ' + t;
	}

	callback(msg);
}

var addUser = function (input, callback) {

	var msg = {};

	var inserts = {
		name: input.name,
		password: hash.generate(input.password)
	};

	knex('users')
	.insert(inserts)
	.then(function() {
		msg.success = 'User ' + inserts.name + ' added';
		callback(msg);
	})
	.catch(function(error) {
		msg.error = error;
		callback(msg);
	});
	
}

var addNutri = function (input, callback) {

	var msg = {};

	var inserts = {
		name: input.name,
		fats: input.fats,
		carbs: input.carbs,
		pros: input.pros
	};

	knex('nutriments')
	.insert(inserts)
	.then(function() {
		msg.success = 'Nutriment ' + inserts.name + ' added';
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
	addUser: addUser,
	addNutri: addNutri
}
