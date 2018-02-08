var entry = require("../models/entry");
var bank = require("../models/bank");
var category = require("../models/category");
var utils = require('./utils');
module.exports = function (app, options) {
  options = options || {};
  options.required = options.required || [];

  app.all('/api/ajustTransf'
    , app.auth
    , (req, res) => {
      entry.find({description: /Transferência/, category: {$not: /59a95de0f91f310018e5262e/}}).exec(
        function (err, data) {
          data.forEach(function (d) {
            d.category = '59a95de0f91f310018e5262e';
            d.save()
          });
          res.send('doing');
        }
      )

    });
  app.all('/api/entry/resumeTable'
    , app.auth
    , (req, res) => {
      if (req.method == 'GET') {
        return res.json({
          params: ['date.year', 'date.month', 'date.day', 'category', 'bank'],
          filter: ['confirmed'],
          values: ['value']
        })
      }
      if (req.method == 'POST') {
        var query = {
          // user: req.session.user._id
          date: {'$ne': null}
        }
        utils.load(entry, req.body.columns, req.body.value, req.body.start, req.body.end, query, function (err, result) {
          if (err) {
            return res.status(500).send(err);
          }
          if (req.query.format == 'table') {
            res.json(utils.toTable(result));
          } else {
            res.json(result);
          }
        });
      } else {
        res.status(500).send('invalid protocol')
      }
    });
  app.get('/api/entry/resumeByDate', app.auth, (req, res) => {
    //transferencias
    category.find({$or:[{name: /Transferências/},{name: /Poupança/}]}, {_id: true}, function (err, categorias) {
      var transferencias = [];
      categorias.forEach(function (d) {
        transferencias.push(d._id)
      });
      var o = {};
      o.map = function () {
        // emit(this.date.getFullYear() + '-' + (this.date.getMonth() + 1), this.value)
        emit(
          {
            data: this.date.getFullYear() + '-' + (this.date.getMonth() + 1)
          },
          {
            entrada: this.value > 0 ? this.value : 0,
            saida: this.value < 0 ? this.value : 0,
            saldo: this.value
          })
      }
      o.reduce = function (k, vals) {
        // return Array.sum(vals)
        var retorno = {entrada: 0, saida: 0, saldo: 0}
        vals.forEach(function (v) {
          retorno.entrada += v.entrada;
          retorno.saida += v.saida;
          retorno.saldo += v.saldo;
        });
        return retorno
      }
      //console.log("categorias de transferencia:", transferencias);
      o.query = {
        // confirmed: true,
        category: {$nin: transferencias},
        user: req.session.user._id
      }
      if (req.query.date) {
        var ini = new Date(req.query.date);
        ini.setDate(1)
        var end = new Date(req.query.date);
        end.setMonth(end.getMonth() + 1)
        end.setDate(1)
        ini.setHours(0)
        end.setHours(0)
        ini.setMinutes(0)
        end.setMinutes(0)
        o.query.date = {
          $gte: ini,
          $lt: end
        }
      }
      entry.mapReduce(o, function (err, results) {
        res.json(results);
      })

    });

  });
  app.get('/api/entry/resumeByDateCategory', app.auth, (req, res) => {
    //transferencias
    category.find({name: /Transferências/}, {_id: true}, function (err, categorias) {
      var transferencias = [];
      categorias.forEach(function (d) {
        transferencias.push(d._id)
      });

      var o = {};
      o.map = function () {
        // emit(this.date.getFullYear() + '-' + (this.date.getMonth() + 1), this.value)
        emit(
          {
            // data: this.date.getFullYear() + '-' + (this.date.getMonth() + 1),
            category: this.category
          },
          {
            entrada: this.value > 0 ? this.value : 0,
            saida: this.value < 0 ? this.value : 0,
            saldo: this.value
          })
      }
      o.reduce = function (k, vals) {
        // return Array.sum(vals)
        var retorno = {entrada: 0, saida: 0, saldo: 0}
        vals.forEach(function (v) {
          retorno.entrada += v.entrada;
          retorno.saida += v.saida;
          retorno.saldo += v.saldo;
        });
        return retorno
      }
      //console.log("categorias de transferencia:", transferencias);
      o.query = {
        // confirmed: true,
        category: {$nin: transferencias},
        user: req.session.user._id
      }

      //console.log('req.query.date:',req.query.date)
      var ini = new Date(req.query.date);
      ini.setDate(1)
      var end = new Date(req.query.date);
      end.setMonth(end.getMonth() + 1)
      end.setDate(1)
      ini.setHours(0)
      end.setHours(0)
      ini.setMinutes(0)
      end.setMinutes(0)
      o.query.date = {
        $gte: ini,
        $lt: end
      }

      entry.mapReduce(o, function (err, results) {
        var options = {
          path: '_id.category',
          model: 'category'
        };
        category.populate(results, options, (err, projects) => {
          res.json(projects);
        });
      })

    });

  });
  app.get('/api/entry/resumeByCategoryNew'
    , app.auth
    , (req, res) => {
      var inicio = new Date();
      var bankid = req.query.bank;
      if (req.query && req.query.date) {
        try {
          inicio = new Date(req.query.date)
        } catch (e) {

        }
      }
      inicio.setDate(1);
      inicio.setHours(0);
      var fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1);
      var o = {};
      o.map = function () {
        emit(
          {
            category: this.category
          },
          {
            entradaConfirmada: this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saidaConfirmada: this.confirmed ? this.value < 0 ? this.value : 0 : 0,
            entrada: !this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saida: !this.confirmed ? this.value < 0 ? this.value : 0 : 0
          })
      }
      o.reduce = function (k, vals) {
        var retorno = {entrada: 0, saida: 0, entradaConfirmada: 0, saidaConfirmada: 0}
        vals.forEach(function (v) {
          retorno.entradaConfirmada += v.entradaConfirmada;
          retorno.saidaConfirmada += v.saidaConfirmada;
          retorno.entrada += v.entrada;
          retorno.saida += v.saida;
        });
        return retorno
      }
      o.query = {
        user: req.session.user._id,
        date: {$gt: inicio, $lt: fim}

      };
      if (bankid) {
        o.query.bank = bankid;
      }
      entry.mapReduce(o, function (err, results) {
        var options = {
          path: '_id.category',
          model: 'category'
        };
        category.populate(results, options, (err, projects) => {
          res.json(projects);
        });
      })
    });

  app.get('/api/entry/resumeByEntry'
    , app.auth
    , (req, res) => {
      var inicio = new Date();
      var bankid = req.query.bank;
      var categoryid = req.query.category;
      if (req.query && req.query.date) {
        try {
          inicio = new Date(req.query.date)
        } catch (e) {

        }
      }
      inicio.setDate(1);
      inicio.setHours(0);
      var fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1);
      var o = {};
      o.map = function () {
        emit(
          {
            entry: this
          },
          {
            entradaConfirmada: this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saidaConfirmada: this.confirmed ? this.value < 0 ? this.value : 0 : 0,
            entrada: !this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saida: !this.confirmed ? this.value < 0 ? this.value : 0 : 0
          })
      }
      o.reduce = function (k, vals) {
        var retorno = {entrada: 0, saida: 0, entradaConfirmada: 0, saidaConfirmada: 0}
        vals.forEach(function (v) {
          retorno.entradaConfirmada += v.entradaConfirmada;
          retorno.saidaConfirmada += v.saidaConfirmada;
          retorno.entrada += v.entrada;
          retorno.saida += v.saida;
        });
        return retorno
      }
      o.query = {
        user: req.session.user._id,
        date: {$gt: inicio, $lt: fim},
        category: categoryid
      };
      if (bankid) {
        o.query.bank = bankid;
      }
      entry.mapReduce(o, function (err, results) {
        res.json(results);
      })
    });
  app.get('/api/entry/resumeByBankNew'
    , app.auth
    , (req, res) => {
      var inicio = new Date();
      if (req.query && req.query.date) {
        try {
          inicio = new Date(req.query.date)
        } catch (e) {

        }
      }
      inicio.setDate(1);
      inicio.setHours(0);
      var fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1);
      var o = {};
      o.map = function () {
        emit(
          {
            bank: this.bank
          },
          {
            entradaConfirmada: this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saidaConfirmada: this.confirmed ? this.value < 0 ? this.value : 0 : 0,
            entrada: !this.confirmed ? this.value > 0 ? this.value : 0 : 0,
            saida: !this.confirmed ? this.value < 0 ? this.value : 0 : 0
          })
      }
      o.reduce = function (k, vals) {
        var retorno = {entrada: 0, saida: 0, entradaConfirmada: 0, saidaConfirmada: 0}
        vals.forEach(function (v) {
          retorno.entradaConfirmada += v.entradaConfirmada;
          retorno.saidaConfirmada += v.saidaConfirmada;
          retorno.entrada += v.entrada;
          retorno.saida += v.saida;
        });
        return retorno
      }
      o.query = {
        // confirmed: true,
        user: req.session.user._id,
        date: {$gt: inicio, $lt: fim}

      };
      entry.mapReduce(o, function (err, results) {
        var options = {
          path: '_id.bank',
          model: 'bank'
        };
        bank.populate(results, options, (err, projects) => {
          bank.find({user: req.session.user._id}, {__v: false}).exec(function (err, banks) {
            banks.forEach(function (b) {
              var tem = false
              projects.forEach(function (r) {
                if (r._id.bank._id + "" == b._id + "") {
                  tem = true;
                }
              });
              if (!tem) {
                projects.push({
                  _id: {
                    bank: b
                  },
                  value: {
                    entradaConfirmada: 0,
                    saidaConfirmada: 0,
                    saida: 0,
                    entrada: 0
                  }
                })
              }
            });
            res.json(projects);

          });
        });
      })
    });
  app.get('/api/entry/resumeByBank', app.auth, (req, res) => {

    var query = entry.aggregate();
    var fim = new Date();
    if (req.query && req.query.date) {
      try {
        fim = new Date(req.query.date)
      } catch (e) {

      }
    }
    fim.setDate(1);
    fim.setHours(0);
    fim.setMonth(fim.getMonth() + 1);
    //console.log("fim:", fim);
    query.match({
      user: req.session.user._id,
      date: {$lt: fim}
    });
    // query.project({
    //     bank:'$bank'
    // })
    query.group({
      _id: {bank: '$bank', confirmed: '$confirmed'},
      value: {$sum: '$value'}
    })

    query.exec((err, docs) => {
      if (err) {
        return res.status(500).send(err);
      }
      var options = {
        path: '_id.bank',
        model: 'bank'
      };
      bank.populate(docs, options, (err, projects) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(projects);
      });

    })
  })
  // app.get('/api/entry/resumeByCategory', app.auth, (req, res) => {
  //   var inicio = new Date();
  //   var bankid = req.query.bank;
  //   if (req.query && req.query.date) {
  //     try {
  //       inicio = new Date(req.query.date)
  //     } catch (e) {
  //
  //     }
  //   }
  //   inicio.setDate(1);
  //   inicio.setHours(0);
  //   var fim = new Date(inicio);
  //   fim.setMonth(fim.getMonth() + 1);
  //
  //   var query = entry.aggregate();
  //   query.match({
  //     user: req.session.user._id,
  //     date: {$gt: inicio, $lt: fim},
  //     bank: bankid
  //   });
  //   query.group({
  //     _id: {category: '$category', confirmed: '$confirmed'},
  //     value: {$sum: '$value'}
  //   })
  //
  //   query.exec((err, docs) => {
  //     var options = {
  //       path: '_id.category',
  //       model: 'category'
  //     };
  //     category.populate(docs, options, (err, projects) => {
  //       res.json(projects);
  //     });
  //
  //   })
  // })
  app.get('/api/entry/resumeTotalByCategory', app.auth, (req, res) => {
    var inicio = new Date();
    if (req.query && req.query.date) {
      try {
        inicio = new Date(req.query.date)
      } catch (e) {

      }
    }
    inicio.setDate(1);
    inicio.setHours(0);
    var fim = new Date(inicio);
    fim.setMonth(fim.getMonth() + 1);

    var query = entry.aggregate();
    query.match({
      user: req.session.user._id,
      date: {$gt: inicio, $lt: fim},
    });
    // query.project({
    //     bank:'$bank'
    // })
    query.group({
      _id: {category: '$category', confirmed: '$confirmed'},
      value: {$sum: '$value'}
    })

    query.exec((err, docs) => {
      var options = {
        path: '_id.category',
        model: 'category'
      };
      category.populate(docs, options, (err, projects) => {
        res.json(projects);
      });

    })
  })

  /**
   * @api {get} /entry getAll
   * @apiVersion 1.0.0
   * @apiGroup entry
   *     * @apiDescription List all entry
   *     *
   * @apiSuccess (200) Json [{}] -
   * @apiError (500) String Internal server error
   */
  app.get("/api/entry", app.auth, function (req, res) {
      var query = entry.find({user: req.session.user._id}, {__v: false})
      query.sort({date: -1})
      query.exec(function (err, data) {

        if (err) {
          res.status(500).send(err);
        } else {
          var options = {
            path: 'category',
            model: 'category'
          };
          category.populate(data, options, (err, projects) => {
            if (err) {
              return res.status(500).send(err);
            }

            var options = {
              path: 'bank',
              model: 'bank'
            };
            bank.populate(projects, options, (err, projects) => {
              if (err) {
                return res.status(500).send(err);
              }
             // console.log('3', projects)

              res.json(projects);
            });
          });
        }
      });
    }
  );

  app.get("/api/entry/pendents", app.auth, function (req, res) {
      entry.find({user: req.session.user._id, confirmed: false}, {__v: false})
        .sort('date')
        .exec(function (err, data) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(data || []);
          }
        });
    }
  );

  /**
   * @api {get} /entry/:id getOne
   * @apiVersion 1.0.0
   * @apiGroup entry
   *     * @apiDescription get one entry
   *     *
   * @apiSuccess (200) Json {} -
   * @apiError (500) String Internal server error
   */
  app.get("/api/entry/:id", app.auth, function (req, res) {
    entry.findOne({_id: req.params.id, user: req.session.user._id}, function (err, entity) {
      if (err)
        return res.status(500).send(err);
      res.json(entity || []);
    });
  });

  /**
   * @api {post} /entry/ insert
   * @apiVersion 1.0.0
   * @apiGroup entry
   *     * @apiDescription Add entry
   *     *
   * @apiSuccess (200) String
   * @apiError (403) String User or password invalid
   * @apiError (500) String Internal server error
   */
  app.post("/api/entry", app.auth, function (req, res, next) {
    var erro = "";

    var entity = new entry(req.body);
    entity.user = req.session.user._id;
    options.required.forEach(function (v, k) {
      if (!entity[v]) {
        erro += ( v + " is required!\n" );
      }
    });
    if (erro) {
      res.status(500).send(erro);
      return;
    }
    try {
      if (options.pre) options.pre("pre", "create", entity);
      entity.save(function (err, saved) {
        if (err) {
          res.status(500).send(err);
        }
        if (options.post) options.post("post", "create", entity);
        res.send(saved);
      });


    } catch (e) {
      res.status(500).send(e);
    }
  });

  /**
   * @api {post} /entry/:id update
   * @apiVersion 1.0.0
   * @apiGroup entry
   *     * @apiDescription update one entry
   *     *
   * @apiSuccess (200) String
   * @apiError (403) String User or password invalid
   * @apiError (500) String Internal server error
   */
  app.post("/api/entry/:id", app.auth, function (req, res) {
    entry.findOne({_id: req.params.id, user: req.session.user._id}, function (err, entity) {
      if (err)
        res.send(err);

      var erro = "";
      options.required.forEach(function (v, k) {
        if (!req.body[v]) {
          erro += ( v + " is required!\n" );
        }
      });
      if (erro) {
        res.status(500).send(erro);
        return;
      }
      try {
        if (options.pre) options.pre("pre", "update", entity, req.body);
        for (var attrname in req.body) {
          entity[attrname] = req.body[attrname];
        }
        entity.save(function (err, saved) {
          if (err)
            res.status(500).send(err);
          if (options.post) options.post("post", "update", entity);
          res.send(saved);
        });
      } catch (e) {
        res.status(500).send(e);
      }

    });
  });
  /**
   * @api {delete} /entry/:id delete
   * @apiVersion 1.0.0
   * @apiGroup entry
   *     * @apiDescription delete entry
   *     *
   * @apiSuccess (200) String
   * @apiError (403) String User or password invalid
   * @apiError (500) String Internal server error
   */
  app.delete("/api/entry/:id", app.auth, function (req, res) {
    if (options.pre) options.pre("pre", "delete", req.param.id);
    entry.findOne({_id: req.params.id, user: req.session.user._id}, function (err, entity) {
      entry.remove({
        _id: req.params.id
      }, function (err, result) {
        if (err)
          res.status(500).send(err);
        if (options.post) options.post("post", "delete", entity);
        res.json(result.result);
      });
    });
  });
};
