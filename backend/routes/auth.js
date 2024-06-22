const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const verifyToken = require("../middlewares/jwt");

router.post(
  "/createUser",
  [
    body("name", "Enter a valid value").isLength({ min: 3 }),
    body("email", "Enter a valid value").isEmail(),
    body("password", "Enter a valid value").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "duplicate email" });
      }

      const salt = await bcryptjs.genSalt(10);
      const passKey = await bcryptjs.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passKey,
      });
      user.save();

      const token = jwt.sign({ id: user._id }, "iNotebook");
      res.json({ message: token });
    } catch (error) {
      console.log("error while creating user", error);
      return res.status(500).json({ message: error });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid value").isEmail(),
    body("password", "Enter a valid value").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingUser = await User.findOne({ email: req.body.email });
      if (!existingUser) {
        return res.status(400).json({ message: "sorry user not found" });
      }

      const pass = await bcryptjs.compare(
        req.body.password,
        existingUser.password
      );

      if (!pass) {
        return res.status(400).json({ message: "sorry user not found" });
      }

      const token = jwt.sign({ id: existingUser._id }, "iNotebook");

      res.status(200).json({ message: token });
    } catch (error) {
      console.log("error while creating user", error);
      return res.status(500).json({ message: error });
    }
  }
);

router.get("/getUser", verifyToken, async (req, res) => {
  try {
    const id = req.id;
    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(400).json({ message: "sorry user not found" });
    }

    res.json({ message: " hello", data: existingUser });
  } catch (error) {
    console.log("error while creating user", error);
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
