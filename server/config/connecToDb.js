const mongoose = require('mongoose')


const connectToDb = async () => {
    try {
        await mongoose.connect(Process.env.MONGO_URI)
        console.log("Database is connected Succesfully");
    } catch (error) {
        console.log("Database Connection failed", error);        
    }
}

module.exports = connectToDb