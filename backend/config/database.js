const mongoose = require("mongoose");

const connectedDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB running... ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectedDB;
