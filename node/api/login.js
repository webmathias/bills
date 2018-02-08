let User = require("../models/user");
module.exports = function (app, options) {
    options = options || {};
    options.required = options.required || [];
    /**
     * @api {get} /api/login getAll
     * @apiVersion 1.0.0
     * @apiGroup login
     *     * @apiDescription Login in sistem
     *     *
     * @apiSuccess (200) Json [{}] -
     * @apiError (500) String Internal server error
     */
    app.post("/api/login", (req, res)=>{
            if (req.body.user && req.body.password) {
                // TODO implementar armazenamento com md5
                User.findOne({username:req.body.user, password:req.body.password},{password:false},(err, user)=>{

                    if(!err && user) {
                        req.session.user = user;
                        req.session.save(()=>{
                            //console.log("Saved", req.session)
                            req.session.touch();
                        })
                        return res.status(200).send(user);
                    }else
                        return res.status(403).send(err);
                });

            } else {
                return res.status(403).send('');
            }

        }
    );
    app.get("/api/logincheck", app.auth, (req, res)=>{
        return res.status(200).send(req.session.user);
    });
    app.get("/api/logoff", app.auth, (req, res)=>{
        req.session.user = null;
        return res.status(200).send('');
    });
}
