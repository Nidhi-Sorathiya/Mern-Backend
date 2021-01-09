require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Student = require("./models/students");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partial");

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partial_path);

app.get("/", auth, (req, res) => {
  res.render("index");
});

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currelm) => {
      return currelm.token != req.token;
    });
    res.clearCookie("jwt");
    console.log("log out");
    await req.user.save();
    res.render("login");
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/reg", (req, res) => {
  res.render("reg");
});

app.get("*", (req, res) => {
  res.render("err");
});

app.post("/reg", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const regemp = new Student({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const token = await regemp.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });

      const registered = await regemp.save();

      res.status(200).render("login");
    } else {
      res.send("pass not match");
    }
  } catch (e) {
    res.send(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.name;
    const password = req.body.password;

    const findlogin = await Student.findOne({
      $or: [{ email: email }, { name: email }],
    });
    console.log(findlogin);
    const ismatch = await bcrypt.compare(password, findlogin.password);

    const token = await findlogin.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
      // secure: true,
    });

    if (ismatch) {
      res.status(200).render("index");
    } else {
      res.status(200).render("login");
    }
  } catch (e) {
    res.status(200).render("login");
  }
});

app.listen(port, () => {
  console.log("listen");
});
