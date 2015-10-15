var _           = require('lodash');
var config      = require('./config');
var knex        = require('knex')(config.db);

var addUser = function (nimi) {
	knex('users').insert({nimi: nimi}).catch(function(error){console.error(error)});
}

// Exports

module.exports = {
	add: addUser
}