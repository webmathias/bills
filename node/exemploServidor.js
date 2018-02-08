var express = require('express');
var bodyParser = require('body-parser');
var Mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var Server = function () {
  var self = this;
  self.db = false
  self.ipaddress = "0.0.0.0";
  self.port = 8080;
  self.mongo_host = "localhost";
  self.mongo_port = 27017;
  self.mongo_user = "";
  self.mongo_pass = "";
  self.mongo_url = "mongodb://" + self.mongo_user + ":" + self.mongo_pass + "@" + self.mongo_host + ":" + self.mongo_port + "/mydatabase";

  self.connectMongo = function () {
    if (!self.db) {
      self.db = Mongoose.connect(self.mongo_url, function (err, db) {
        if (err) {
          console.log("Couldn't connect to mongo. Error: " + err);
        } else {
          console.log("Connected to mongo");
        }
      });
    }
  };

  self.initializeServer = function () {
    self.app = express(); // Create the express server
    self.app.set('trust proxy', 1) // trust first proxy
    self.app.use(session({
      store: new FileStore(),
      secret: 'asdfasdfasdf',
      resave: true,
      saveUninitialized: true
    }))
    // self.app.use('/', express.static('app/dist')); // Para pagina statica se precisar
    self.app.use(bodyParser.json());

    self.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", ["OPTIONS", "GET", "POST", "DELETE", "PUT"]);
      next();
    });
    self.app.auth = function (req, res, next) {
      if (!req.session.user) {
        return res.status(403).send('');
      }
      next();
    }

    self.app.get('/alive', function (req, res) {
      res.json({'status': 'Its a lie'});
    });

  };

  self.initialize = function () {
    self.connectMongo();
    self.initializeServer();
  };

  self.start = function () {
    self.app.listen(self.port, self.ipaddress, function () {
      console.log(Date(Date.now()) + ' Node server started on ' + self.ipaddress + ':' + self.port);
      console.log(' http://localhost:' + self.port+'/alive');
    });
  };
};
var server = new Server();
server.initialize();
server.start();
