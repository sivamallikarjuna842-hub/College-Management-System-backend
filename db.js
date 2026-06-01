const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/college_db";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  mongoose.set("strictQuery", true);

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });

  isConnected = true;
  console.log("✓ MongoDB connected:", MONGODB_URI);
}

module.exports = { connectDB, mongoose };
