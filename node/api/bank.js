var bank = require("../models/bank");

module.exports = function (app, options) {
    options = options || {};
    options.required = options.required || [];
    /**
     * @api {get} /bank getAll
     * @apiVersion 1.0.0
     * @apiGroup bank
     *     * @apiDescription List all bank
     *     *
     * @apiSuccess (200) Json [{}] -
     * @apiError (500) String Internal server error
     */
    app.get("/api/bank",app.auth, function (req, res) {
        bank.find({ user:req.session.user._id}, {__v: false}, function (err, data) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(data || []);
                }
            });
        }
    );

    /**
     * @api {get} /bank/:id getOne
     * @apiVersion 1.0.0
     * @apiGroup bank
     *     * @apiDescription get one bank
     *     *
     * @apiSuccess (200) Json {} -
     * @apiError (500) String Internal server error
     */
    app.get("/api/bank/:id",app.auth, function (req, res) {
        bank.findOne({_id: req.params.id, user:req.session.user._id},  function (err, entity) {
            if (err)
                res.status(500).send(err);
            res.json(entity || []);
        });
    });

    /**
     * @api {post} /bank/ insert
     * @apiVersion 1.0.0
     * @apiGroup bank
     *     * @apiDescription Add bank
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/bank",app.auth, function (req, res, next) {
        var erro = "";

        var entity = new bank(req.body);
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
            if (options.pre)options.pre("pre", "create", entity);
            entity.save(function (err, saved) {
                if (err) {
                    res.status(500).send(err);
                }
                if (options.post)options.post("post", "create", entity);
                res.send(saved);
            });


        } catch (e) {
            res.status(500).send(e);
        }
    });

    /**
     * @api {post} /bank/:id update
     * @apiVersion 1.0.0
     * @apiGroup bank
     *     * @apiDescription update one bank
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/bank/:id",app.auth, function (req, res) {
        bank.findOne({_id: req.params.id, user:req.session.user._id}, function (err, entity) {
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
                if (options.pre)options.pre("pre", "update", entity, req.body);
                for (var attrname in req.body) {
                    entity[attrname] = req.body[attrname];
                }
                entity.save(function (err, saved) {
                    if (err)
                        res.status(500).send(err);
                    if (options.post)options.post("post", "update", entity);
                    res.send(saved);
                });
            } catch (e) {
                res.status(500).send(e);
            }

        });
    });
    /**
     * @api {delete} /bank/:id delete
     * @apiVersion 1.0.0
     * @apiGroup bank
     *     * @apiDescription delete bank
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.delete("/api/bank/:id",app.auth, function (req, res) {
        if (options.pre)options.pre("pre", "delete", req.param.id);
        bank.findOne({_id: req.params.id, user:req.session.user._id}, function (err, entity) {
            bank.remove({
                _id: req.params.id
            }, function (err, result) {
                if (err)
                    res.status(500).send(err);
                if (options.post)options.post("post", "delete", entity);
                res.json(result.result);
            });
        });
    });
};