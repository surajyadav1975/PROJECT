const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGOURL;
    if (!MONGO_URI) {
        console.error("Error: MONGODB_URL environment variable is not set");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
        process.exit(1); 
    }
};

module.exports = { DBConnection };