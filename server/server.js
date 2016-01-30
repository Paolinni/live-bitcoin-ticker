var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));

server = app.listen(port, function(error){
  return (error) ? console.error(error) : console.log('Listening on port %s', port);
});
