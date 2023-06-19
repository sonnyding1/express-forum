const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: [String, 'Please enter a username'],
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;