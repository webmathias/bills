var user = require("../models/user");

module.exports = function (app, options) {
    options = options || {};
    options.required = options.required || [];
    /**
     * @api {get} /user getAll
     * @apiVersion 1.0.0
     * @apiGroup user
     *     * @apiDescription List all user
     *     *
     * @apiSuccess (200) Json [{}] -
     * @apiError (500) String Internal server error
     */
    app.get("/api/user", function (req, res) {
        var justself = {};
        if(!req.session.user.admin){
            justself = {user:req.session.user._id};
        }
        user.find(justself, {__v: false}, function (err, data) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(data || []);
                }
            });
        }
    );

    /**
     * @api {get} /user/:id getOne
     * @apiVersion 1.0.0
     * @apiGroup user
     *     * @apiDescription get one user
     *     *
     * @apiSuccess (200) Json {} -
     * @apiError (500) String Internal server error
     */
    app.get("/api/user/:id", function (req, res) {
        if(!req.session.user.admin && req.params.id != req.session.user._id) {
            return
            res.status(500).send(err);
        }
            user.findOne({_id: req.params.id},  function (err, entity) {
            if (err)
                return res.status(500).send(err);
            res.json(entity || []);
        });
    });

    /**
     * @api {post} /user/ insert
     * @apiVersion 1.0.0
     * @apiGroup user
     *     * @apiDescription Add user
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/user", function (req, res, next) {
        var erro = "";

        var entity = new user(req.body);
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
     * @api {post} /user/:id update
     * @apiVersion 1.0.0
     * @apiGroup user
     *     * @apiDescription update one user
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/user/:id", function (req, res) {
        if(!req.session.user.admin && req.params.id != req.session.user._id) {
            return
            res.status(500).send(err);
        }
        user.findOne({_id: req.params.id}, function (err, entity) {
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
     * @api {delete} /user/:id delete
     * @apiVersion 1.0.0
     * @apiGroup user
     *     * @apiDescription delete user
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.delete("/api/user/:id", function (req, res) {
        if(!req.session.user.admin && req.params.id != req.session.user._id) {
            return
            res.status(500).send(err);
        }
        user.findOne({_id: req.params.id}, function (err, entity) {
            user.remove({
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