const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed:", err.name);
        process.exit(1);
    }
}

module.exports = connectDB;