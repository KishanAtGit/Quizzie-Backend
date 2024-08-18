const express = require("express");
const router = express();
const User = require("../../schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//to register an User
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    next(error);
  }
});

//to authenticate an user's credentials
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Wrong email or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: "Wrong email or password" });
    } else {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_TOKEN_SECRET_KEY
      );
      res
        .header("auth-token", token)
        .json({ message: "Logged in successfully!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
