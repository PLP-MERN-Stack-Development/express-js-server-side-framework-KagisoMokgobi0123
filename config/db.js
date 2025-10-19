const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.nextTick.MONGO_URI, {
      useNewUrlParse: true,
      userUniFiedTopology: true,
    });
    console.log("MongoDB Connected..");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
