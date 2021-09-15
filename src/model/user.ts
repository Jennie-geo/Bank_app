const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;