var express = require('express');
var index = require('./routes/index');
var register = require('./routes/register');
var users = require('./routes/users');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./public/models/user');
var flash = require('connect-flash');

var mongoose = require('mongoose');

var mongoDB = mongoose.connect('mongodb://localhost/passport_lecture').connection;

mongoDB.on('error', function(err){
    if(err){
        console.log("MONGO ERROR: ", err);
    }
});

mongoDB.once('open', function(){
    console.log("YOU ARE CONNECTED TO MONGO!!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

app.use(flash());


app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({
        passReqToCallback : true,
        usernameField: 'username'
    },
    function(req, username, password, done){
        User.findOne({ username: username }, function(err, user) {
            if (err) throw err;
            if (!user)
                return done(null, false, {message: 'Incorrect username.'});

            // test a matching password
            user.comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                if(isMatch)
                    return done(null, user);
                else
                console.log('Could not log user in -- incorrect password');
                done(null, false, { message: 'Incorrect password.' });
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
        if(err) done(err);
        done(null,user);
    });
});

app.use('/', index);
app.use('/register', register);
app.use('/users', users);

app.set("port", (process.env.PORT || 5000));

app.listen(app.get("port"), function(){
    console.log("Listening on port: " + app.get("port"));
});

module.exports = app;