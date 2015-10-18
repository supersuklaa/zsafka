
var express      = require('express');
var bodyParser   = require('body-parser');
var _            = require('lodash');
var sess         = require('express-session');
var db           = require('./database');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sess({
  secret:'kalankakkaa', // TODO heroku has something for this ?
  resave: false,
  saveUninitialized: true}));

var port = process.env.PORT || 8080;

// create table
// TODO make sense with this route

app.post('/create/table/:table', function(req, res) {
	db.createTable(req.params.table, function(msg) {
		res.json(msg);
	});
});

// get daily portions

app.get('/data/dailyportions', function(req, res) {

  var user = req.session.userid || "";

  if (user) {
    db.dailyportions(user, function(data) {
      res.json(data);
    });

  } else {
    res.json({ 'error': 'log in please' });

  }

});

// get daily nutritional values

app.get('/data/dailyvalues', function(req, res) {

  var user = req.session.userid || "";

  if (user) {
    db.dailyvalues(user, function(data) {
      res.json(data);
    });

  } else {
    res.json({ 'error': 'log in please' });

  }

});

// add user, nutriment or portion

app.post('/add/:target', function(req, res) {

  var target = req.params.target;
  var user = req.session.userid || "";

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
      user: user,
      amount: req.body.amount,
      nutriment: req.body.nutriment
    }
  }

  // if it is defined above, send input to database.js

  if (!_.isUndefined(input[target])) {

  	db.add(target, input[target], function(msg) {
  		  res.json(msg);
  	});

  } else { res.json({ 'error': 'wtf is ' + target + '???' }); }

});

// handle login

app.post('/login/', function(req, res) {

  var input = {
    username: req.body.username,
    password: req.body.password
  };

  db.login(input, function(userid, username) {
    if (userid) {
      req.session.username = username;
      req.session.userid = userid;
      res.json({'success': '1'});
    } else { res.json({ 'error': 'wrong username or password' }); }
  });

});

// route to front-end js

app.get('/front/js', function(req, res) {

  // check if user is logged in
  var user = req.session.userid || "";

  if (user) res.sendfile('./www/core.js');
  else res.sendfile('./www/login.js');

});

// logout

app.get('/logout/', function(req, res) {
  req.session.username = "";
  req.session.userid = "";

  res.redirect('/');
});

// actual html-page, angular handles that sh*t

app.get('*', function(req, res) {

  // check if user is logged in
  var user = req.session.userid || "";

  if (user) {
    res.sendfile('./www/index.html');

  } else { 
    res.sendfile('./www/login.html');

  }

});

// listen

app.listen(port);
console.log("App listening on port " + port);
