const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    OriginPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: "3d",
      }
    );
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
