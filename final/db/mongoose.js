const mongoose = require('mongoose')

// connect to our database
const mongoURI = "mongodb+srv://mrNeedles:GeorgeLopez@cluster0-gyhl5.mongodb.net/csc309?retryWrites=true"

//mongoose.connect('mongodb://localhost:27017/StudentAPI', { useNewUrlParser: true});
mongoose.connect(mongoURI, { useNewUrlParser: true});

module.exports = { mongoose }