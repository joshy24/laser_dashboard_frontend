var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmergencyTestSchema = new Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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
    reasons: [{
        type: String,
        required: true
    }],
    device: String,
    emergency_numbers: [{
        type: String
    }],
    full_address: String,
    sub_admin_address: String,
    laser_type: {
        type: String,
        default: "emergency"
    },
    is_trackable: false,
    status: {
        type: String,
        required: true
    },
    agent_feedback:{
        type: String
    }
});

module.exports = mongoose.model('EmergencyTest', EmergencyTestSchema);