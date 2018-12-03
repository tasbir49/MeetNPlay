const mongoose = require('mongoose')

// connect to our database
const mongoURI = "mongodb://tasbir49:suck%40it69@cluster0-shard-00-00-gyhl5.mongodb.net:27017,cluster0-shard-00-01-gyhl5.mongodb.net:27017,cluster0-shard-00-02-gyhl5.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"

//mongoose.connect('mongodb://localhost:27017/StudentAPI', { useNewUrlParser: true});
mongoose.connect(mongoURI, { useNewUrlParser: true});

module.exports = { mongoose }