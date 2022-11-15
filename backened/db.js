const mongoose = require("mongoose");
const mongoURI="mongodb://localhost:27017/iNotebook?tls=false&directConnection=true"
const connectToMongo = async()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo")
    })
}

module.exports = connectToMongo