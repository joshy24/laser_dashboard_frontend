var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
    phone_number: {
        type: String,
        maxlength: 20
    },
    email:String,
    digits_user_id:String,
    google_id:String,
    firstname: {
        type: String,
        required: true,
        maxlength: 100
    },
    gender: {
        type: String
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    created: {
        type: Date,
        dafault: Date.now(),
        required:true
    },
    tokens:[{
        type: String   
    }],
    password: {
        type: String,
        minlength: 8,
        maxlength:100
    },
    emergency_numbers: [
        {
            type: String,
            minlength: 3
        }
    ]
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

UserSchema.index({phone_number:1, google_id:1, email:1}, {unique:true});

module.exports = mongoose.model('User', UserSchema);
