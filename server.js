var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();
var port        = process.env.PORT || 8080;

app.use(bodyParser());

app.all('*', function (req, res, next) {
    'use strict';
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    
    next();
});

app.post('/slowXHR', function (req, res) {
    
    setTimeout(function () {
        console.log('Slow XHR response...');
        res.json({ id: req.body.id });
    }, 5000);
});

app.post('/slowHTTP', function (req, res) {
    
    setTimeout(function () {
        console.log('Slow HTTP response...');
        res.json({ id: req.body.id });
    }, 5000);
});

app.get('/quick', function (req, res) {
    console.log('Quick response...');
    res.send('ok');
});

// STARTING SERVER
console.log('listening on port ' + port);

app.listen(port);