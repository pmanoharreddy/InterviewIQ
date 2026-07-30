const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;