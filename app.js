
//module dependencies
var express = require('express')
  , http = require('http')
  , mysql = require('mysql')
  , passport = require('passport')
  , path = require('path'),LocalStrategy = require('passport-local').Strategy;
var app = express();
// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function( req, res) {
	res.render('index');
});
//connect to mysql database
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'admin',
	database : 'nodejsmysql'
});
connection.connect();
app.get('/users', function (req, res) {
	connection.query('select * from nodejs', function(err, docs) {
	res.render('users', {users: docs});
	});
});
// Add a new User
app.get("/users/new", function (req, res) {
	res.render("new");
});
// Save the Newly created User
app.post("/users", function (req, res) {
	var fname=req.body.fname,
		lname=req.body.lname;
	connection.query('INSERT INTO nodejs (fname, lname) VALUES (? , ?);', [fname, lname], function(err, docs) {
	if (err) res.json(err);
	
	res.redirect('users');
	});
});


app.get('/login', function(req, res, next) {
  res.render("login", { user : req.user });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
  });
													
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
