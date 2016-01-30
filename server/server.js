var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var port = process.env.PORT || 4000;

var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + "./../app"));
app.use('/bower_components', express.static(__dirname + './../bower_components'));
app.use('/node_modules', express.static(__dirname + './../node_modules'))


server = app.listen(port, function(error){
  return (error) ? console.error(error) : console.log('Listening on port %s', port);
});

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}
