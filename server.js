var _                 = require('lodash');
var express           = require('express');
var app               = express();
var http              = require('http');
var mongoose          = require('mongoose');
var config            = require('./config');
var President         = require('./models/President');
var Vote              = require('./models/Vote');
var apiRouter         = express.Router();
var bodyParser        = require('body-parser');
var fs                = require('fs');
var multer            = require('multer');
var getIP             = require('ipware')().get_ip;

/*******************
 *
 *  UPLOADS DIRECTORY
 *
 *******************/

// Create uploads folders if they doesn't exist
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir);
}
if (!fs.existsSync(config.uploadDir + "presidents/")) {
  fs.mkdirSync(config.uploadDir + "presidents/");
}


/*******************
 *
 *  DATABASE
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
 *  HTTP SERVER
 *
 *******************/

var server = http.Server(app);

// Configure app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('client'));

var upload = multer({ dest: 'uploads/' });


/*******************
 *
 *  ROUTER
 *
 *******************/

// Prefix all api routes with /api
app.use('/api', apiRouter);

// Votes
apiRouter.post('/votes', function (req, res) {
  var vote = new Vote({
    voter: {
      ipAddress: getIP(req).clientIp
    },
    presidentId: req.body.presidentId
  });


  Vote.find({voter: {ipAddress: vote.voter.ipAddress}}, function (err, votes) {
    // Check for errors or if the IP address is already present
    if (err || votes.length > 0) {
      return res.status(403).json({
        message: 'You have already voted for a president !'
      });
    }

    vote.save(function (err, vote) {
      if (err) {
        return res.status(403).json({
          message: err
        });
      }

      res.status(201).json(vote);
    });
  });
});

// Presidents
apiRouter.post('/presidents', upload.single('drawing'), function (req, res) {
  var president = new President();

  president.name = req.body.name;
  president.drawingParts = req.body.drawingParts.split(',');

  // save the president and check for errors
  president.save(function (err, president) {
    if (err) {
      return res.status(403).json({
        message: err
      });
    }

    if (req.body.drawing) {
      var drawingFileName = president.token + '.jpeg';

      fs.writeFile(config.uploadDir + "presidents/" + drawingFileName, req.body.drawing.replace(/^data:image\/jpeg;base64,/, ""), 'base64', function () {
        console.log("Uploaded drawing for " + president.token);
      });
    }

    res.status(201).json(president);
  });
});

apiRouter.get('/presidents/:token', function (req, res) {
  President.find({token: req.params.token}, function (err, presidents) {
    if (err) {
      return res.status(403).json({
        message: err
      });
    }

    if (!presidents.length) {
      return res.status(404).json({
        message: 'no president found'
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
 *  START
 *
 *******************/

server.listen(config.port);
