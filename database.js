const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

class DBConnection {
  connect() {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected.");
      return;
    }
    mongoose.connect(
      `mongodb://localhost:27017/${process.env.NODE_APP_MODE}`,
      {
        useNewUrlParser: true,
      },
      (err) => {
        if (err) throw err;
        console.log("Connected to mongodb.");
      }
    );
  }
}

module.exports = DBConnection;
