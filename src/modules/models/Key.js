const mongoose = require('mongoose');

const KeySession = mongoose.Schema({
    member: {
        type: String
    },
    Key: {
        type: String
    }
})

module.exports = mongoose.model("requestSession", KeySession);