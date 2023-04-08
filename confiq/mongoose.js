// require mongoose

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

//connect ot the database

mongoose.connect("mongodb://127.0.0.1/Node", { useNewUrlParser: true });

const db = mongoose.connection;

//check error
db.on(
  "error",
  console.error.bind(console, "Cant connected to the Mongoose db")
);

// is connection is succesfully

db.once("open", () => {
  console.log("Data Base will Connected");
});

module.exports = db;
