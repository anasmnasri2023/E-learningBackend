const mongoose = require("mongoose");

module.exports.connecttoMongoDB = async () => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(process.env.URL_MONGO);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};
