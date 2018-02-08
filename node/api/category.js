var category = require("../models/category");

module.exports = function (app, options) {
    options = options || {};
    options.required = options.required || [];
    /**
     * @api {get} /category getAll
     * @apiVersion 1.0.0
     * @apiGroup category
     *     * @apiDescription List all category
     *     *
     * @apiSuccess (200) Json [{}] -
     * @apiError (500) String Internal server error
     */
    app.get("/api/category",app.auth, function (req, res) {
        category.find({ user:req.session.user._id}, {__v: false}, function (err, data) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(data || []);
                }
            });
        }
    );

    /**
     * @api {get} /category/:id getOne
     * @apiVersion 1.0.0
     * @apiGroup category
     *     * @apiDescription get one category
     *     *
     * @apiSuccess (200) Json {} -
     * @apiError (500) String Internal server error
     */
    app.get("/api/category/:id",app.auth, function (req, res) {
        category.findOne({_id: req.params.id, user:req.session.user._id},  function (err, entity) {
            if (err)
                res.status(500).send(err);
            res.json(entity || []);
        });
    });

    /**
     * @api {post} /category/ insert
     * @apiVersion 1.0.0
     * @apiGroup category
     *     * @apiDescription Add category
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/category",app.auth, function (req, res, next) {
        var erro = "";

        var entity = new category(req.body);
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
     * @api {post} /category/:id update
     * @apiVersion 1.0.0
     * @apiGroup category
     *     * @apiDescription update one category
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.post("/api/category/:id",app.auth, function (req, res) {
        category.findOne({_id: req.params.id, user:req.session.user._id}, function (err, entity) {
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
     * @api {delete} /category/:id delete
     * @apiVersion 1.0.0
     * @apiGroup category
     *     * @apiDescription delete category
     *     *
     * @apiSuccess (200) String
     * @apiError (403) String User or password invalid
     * @apiError (500) String Internal server error
     */
    app.delete("/api/category/:id",app.auth, function (req, res) {
        if (options.pre)options.pre("pre", "delete", req.param.id);
        category.findOne({_id: req.params.id, user:req.session.user._id}, function (err, entity) {
            category.remove({
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