var multer = require('multer');

var DIR = './uploads/';

var upload = multer({dest: 'uploads/'});
var fs = require('fs');

module.exports = function (app, options) {
    options = options || {};
    options.required = options.required || [];
    /**
     * @api {get} /entry getAll
     * @apiVersion 1.0.0
     * @apiGroup entry
     *     * @apiDescription List all entry
     *     *
     * @apiSuccess (200) Json [{}] -
     * @apiError (500) String Internal server error
     */
    app.post("/api/import", app.auth, upload.single('file'), function (req, res) {

            //console.log(req.file);
            // req.file.path
            fs.readFile(req.file.path, 'utf8', function (err, data) {
                if (err) throw err;
                //console.log(data);
                res.status(200).send(data);



            });

        }
    );
};
