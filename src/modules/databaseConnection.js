const mongoose = require('mongoose');

module.exports = async function connectDb()
{
    // mongodb database
    console.log("[DB] connected ")
    await mongoose.connect("mongodb://localhost:27017/userData?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
}
