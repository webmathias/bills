var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new Schema(
    {
        name: {type: 'String'}
        , type: {type: 'Number'}
        , cor: {type: 'String', default: '#FFFFFF'}
        , user: {type: 'String'}
    }
);


module.exports = mongoose.model('category', category);
