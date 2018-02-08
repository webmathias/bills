var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var entry = new Schema(
    {
        description: {type: 'String'}
        , category: {type: 'String'}
        , bank: {type: 'String'}
        , value: {type: 'Number', default: 0}
        , date: {type: 'Date', default: Date.now}
        , confirmed: {type: 'Boolean', default: false}
        , credito: {type: 'Boolean', default: false}
        , user: {type: 'String'}
    }
);


module.exports = mongoose.model('entry', entry);
