var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bank = new Schema(
    {
        name: {type: 'String'}
        , number: {type: 'Number', default: 0}
        , bank: {type: 'Number', default: 0}
        , account: {type: 'Number', default: 0}
        , intialvalue: {type: 'Number', default: 0}
        , data: {type: 'Date'}
        , active: {type: 'Boolean', default: true}
        , saveaccount: {type: 'Boolean', default: false}
        , user: {type: 'String'}
    }
);


module.exports = mongoose.model('bank', bank);
