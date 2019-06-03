var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    full_name: {
        type: String,
        required: true
    },
    phone_number: String,
    email: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        dafault: new Date(),
        required:true
    },
    reason: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema);