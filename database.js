const mongoose = require("mongoose");

let isConnecting = false;

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  try {
    isConnecting = true;
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
    return mongoose.connection;
  } finally {
    isConnecting = false;
  }
};

module.exports = connectDb;
