var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema(
    {
        username: {type: 'String', default: ""}
        , password: {type: 'String', default: ""}
        , name: {type: 'String', default: ""}
        , admin: {type: 'Boolean', default: false}
    }
);


module.exports = mongoose.model('user', user);
