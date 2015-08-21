var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

router.get("/", function(req,res,next){
    res.sendFile(path.resolve(__dirname, '../public/assets/views/index.html'));
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '../users',
        failureRedirect: '/'
    })
);

module.exports = router;