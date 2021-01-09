const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

studentschema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};

studentschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`${this.password}`);
  }
  next();
});

const Student = new mongoose.model("regdetail", studentschema);

module.exports = Student;
