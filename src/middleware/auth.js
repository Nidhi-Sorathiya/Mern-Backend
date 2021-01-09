const jwt = require("jsonwebtoken");
const Student = require("../models/students");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const veruser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(veruser);

    const user = await Student.findOne({ _id: veruser._id });
    console.log(user);
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.render("login");
  }
};
module.exports = auth;
