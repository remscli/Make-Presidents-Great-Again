var _             = require('lodash');
var express       = require('express');
var app           = express();
var http          = require('http');
var mongoose      = require('mongoose');
var config        = require('./config');
var President     = require('./models/President');
var apiRouter     = express.Router();
var bodyParser    = require('body-parser');

/*******************
 *
 *	DATABASE
 *
 *******************/

mongoose.connect(config.database);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log("Mongoose connection opened !");
});


/*******************
 *
 *	HTTP SERVER
 *
 *******************/

var server = http.Server(app);

// Configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('client'));


/*******************
 *
 *	ROUTER
 *
 *******************/

// Prefix all api routes with /api
app.use('/api', apiRouter);

// Presidents
apiRouter.post('/presidents', function (req, res) {
  var president = new President();

  president.name = req.body.name;
  president.drawingParts = req.body.drawingParts;

  // save the president and check for errors
  president.save(function(err, president) {
    if (err){
      return res.status(403).json({
        message: err
      });
    }

    res.status(201).json(president);
  });
});

apiRouter.get('/presidents/:token', function (req, res) {
  President.find({token: req.params.token}, function (err, presidents) {
      if (err){
        return res.status(403).json({
          message: err
        });
      }

      var president = presidents[0];

      res.status(200).json(president);
    });
});

// Otherwise redirect to the app
app.get('*', function (req, res) {
  res.sendFile('index.html', {"root": __dirname + '/client'});
});


/*******************
 *
 *	START
 *
 *******************/

server.listen(config.port);
