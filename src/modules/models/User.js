const mongoose = require('mongoose')

const User = mongoose.Schema({

    member: {
        type: String,
    },
    coins: {
        type: Number,
        default: 250,
    },
    bank: {
        type: Number,
        default: 0,
    },
    
});

module.exports = mongoose.model('user', User );