var express = require('express');
var bodyParser = require('body-parser');
var Mongoose = require('mongoose');
var conf = require('./conf');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
// var compression = require('compression')
var morgan = require('morgan')
var Server = function (port, ipAddress, mongoUrl) {
  var self = this;
  self.db = false
  self.ipaddress = '0.0.0.0';
  self.port = process.env.PORT || 3000;
  self.dbuser = process.env.DB_USER || '';
  self.dbpass = process.env.DB_PASS || '';
  self.dbHOST = process.env.DB_HOST || 'localhost';
  self.dbPORT = process.env.DB_PORT || '27017';
  self.dbNAME = process.env.DB_NAME || 'contas';


  if(self.dbuser && self.dbpass){
    self.mongo_url = "mongodb://"+self.dbuser+":"+self.dbpass+"@"+self.dbHOST+":"+self.dbPORT+"/"+self.dbNAME;
  }else{
    self.mongo_url = "mongodb://"+self.dbHOST+":"+self.dbPORT+"/"+self.dbNAME; 
  }



  self.connectMongo = function () {

    Mongoose.Promise = global.Promise;
    self.db = Mongoose.connect(self.mongo_url, {useMongoClient: true})
      .then(function () {
        console.error("connected on Mongo")
      })
      .catch(function (err) {
        console.error(err)
	process.exit(-1);
      });

  };

  self.initializeServer = function () {
    self.app = express(); // Create the express server
    self.app.use(morgan('combined'))
    // self.app.set('trust proxy', 1) // trust first proxy
    self.app.use(session({
      store: new FileStore(),
      secret: 'asdfasdfasdf',
      resave: true,
      saveUninitialized: true
    }))
    self.app.use('/static/', express.static('app/dist'));
    self.app.use('/', express.static('app/dist'));
    // self.app.use(compression())
    // self.app.use('/node_modules', express.static(conf.node_modules));
    // self.app.use('/site', express.static(conf.tmp));
    self.app.use(bodyParser.json());

    self.app.get('/alive', function (req, res) {
      res.send('Its a lie');
    });
    self.app.get('/pagecount', function (req, res) {
      // try to initialize the db on every request if it's not already
      // initialized.
      req.session.pageCount = (req.session.pageCount || 1) + 1;
      req.session.save()
      res.send('{ pageCount: ' + req.session.pageCount + '}');

    });
    self.app.use(function (req, res, next) {
      //Console.log(req);
      //req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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
    require('./api/login')(self.app, {});
    require('./api/user')(self.app, {});
    require('./api/bank')(self.app, {});
    require('./api/entry')(self.app, {});
    require('./api/category')(self.app, {});
    require('./api/import')(self.app, {});
    // DON'T REMOVE
    // VT-INCLUDES

  };


  self.initialize = function () {
    self.connectMongo();
    self.initializeServer();
  };

  self.start = function () {
    self.app.listen(self.port, self.ipaddress, function () {
      console.log(Date(Date.now()) + ' Node server started on ' + self.ipaddress + ':' + self.port);
    });
  };
};
module.exports = Server;
// var server = new Server(conf.port, conf.ipAddress, conf.mongoUrl);
// server.initialize();
// server.start();
