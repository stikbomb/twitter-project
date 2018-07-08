var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var path = require('path');


// For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true})); //session secret WTF?
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions WTF?

//Models
var models = require('./models');

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Database looks fine!')
    }).catch(function (err) {
    console.log(err, 'Somethings went wrong with Database!')
});

//For EJS
//app.engine('ejs', require('ejs'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//For public directory
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


//For routes
var routes = require('./routes/routes.js')(app, passport);


//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

app.get('/', function(req, res) {
    res.send('Welcome!')
});

app.listen(5000, function(err) {
    if (!err)
        console.log('Site is alive!');
    else console.log(err);
});


