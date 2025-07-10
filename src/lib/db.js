import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    console.log("📍 MongoDB URI:", process.env.MONGO_URI ? "URI is set" : "❌ URI is missing");
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB Atlas:");
    console.log("📝 Error message:", error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log("🔐 Authentication failed - Check your username and password");
    } else if (error.message.includes('network')) {
      console.log("🌐 Network error - Check your internet connection");
    } else if (error.message.includes('ENOTFOUND')) {
      console.log("🔍 DNS error - Check your connection string");
    }
    
    process.exit(1); // 1 means failure
  }
};
