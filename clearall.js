// scripts/clearAllData.js
require("dotenv").config();
const mongoose = require("mongoose");

const clearAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Deleted: ${collection.collectionName}`);
    }

    console.log("All data deleted successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

clearAllData();