var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
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
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    created: {
        type: Date,
        dafault: new Date(),
        required:true
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);