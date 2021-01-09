const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/reg", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((e) => {
    console.log("no connection");
  });
