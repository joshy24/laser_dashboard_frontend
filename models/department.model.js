var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        dafault: new Date(),
        required:true
    }
});

module.exports = mongoose.model('Department', DepartmentSchema);