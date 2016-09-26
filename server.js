var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

app.get('*', function (req, res) {
  res.sendFile('index.html', {"root": __dirname + '/client'});
});

server.listen(4000);
