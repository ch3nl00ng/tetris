var http = require('http');
var express = require('express');
var device = require('express-device');

var app = express(http);

// Template Engines
app.engine('html', require('ejs').renderFile);
app.engine('pug', require('pug').__express);

// Enable device detection
app.use(device.capture());
device.enableDeviceHelpers(app);

// Static assets
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/css', express.static(__dirname + '/static/css'));

// Routing
app.use('/tetris', function(req, res) {
    res.render('tetris.html');
});
app.use('/p1', function(req, res) {
    res.render('p1.html');
});
app.use('/test', function(req, res) {
    res.render('test.pug', {
        title: 'TMD',
        message: 'CA',
    });
});

app.use('/', function(req, res) {
    res.render('index.html');
});

// Note: Uses the CLOUD9 port
app.listen(process.env.PORT);