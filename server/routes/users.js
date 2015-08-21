var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../public/assets/views/users.html'));
    //res.json(req.isAuthenticated());
});

module.exports = router;