var http = require('http');
var express = require('express');
var app = express(http);

// Template Engines
app.engine('html', require('ejs').renderFile);
app.engine('pug', require('pug').__express);

// Static assets
app.use('/js', express.static(__dirname + '/static/js'));
app.use('/css', express.static(__dirname + '/static/css'));

// Routing
app.use('/tetris', function(req, res) {
    res.render('tetris.html');
});
app.use('/test', function(req, res) {
    res.render('test.pug', {
        title: 'TMD',
        message: 'CA',
    });
});

app.use('/', function(req, res) {
    res.send('Hello world');
});

// Note: Uses the CLOUD9 port
app.listen(process.env.PORT);