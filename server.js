
var express      = require('express');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var db           = require('./database');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

var port = process.env.PORT || 8080;

// create table

app.get('/create/table/:table', function(req, res) {
	db.createTable(req.params.table, function(msg) {
		res.json(msg);
	});
});

// get daily portions

app.get('/data/dailyportions', function(req, res) {

  var user = 1; // dev setting!!!

  db.dailyportions(user, function(data) {
    res.json(data);
  });

});

// get daily nutritional values

app.get('/data/dailyvalues', function(req, res) {

  var user = 1; // dev setting!!!

  db.dailyvalues(user, function(data) {
    res.json(data);
  });

});

// add user, nutriment or portion

app.post('/add/:target', function(req, res) {

  var target = req.params.target;

  var input = {
    user: {
      name: req.body.name,
      password: req.body.password
    },

    nutriment: {
      name: req.body.name,
      fats: req.body.fats,
      carbs: req.body.carbs,
      pros: req.body.pros
    },

    portion: {
      user: req.body.user,
      amount: req.body.amount,
      nutriment: req.body.nutriment
    }
  }

  // if it is defined above, send input to database.js

  if (!_.isUndefined(input[target])) {

  	db.add(target, input[target], function(msg) {
  		  res.json(msg);
  	});

  } else {
    res.json({
      'error': 'wtf is ' + target + '???'
    });
  }

});

// actual html-page, angular handles that sh*t

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// listen

app.listen(port);
console.log("App listening on port " + port);
