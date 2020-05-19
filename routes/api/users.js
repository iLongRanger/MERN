const express = require("express"); //
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register User
// @access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valide email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //to send errors back
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      // check if the user exist
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // grabbing gravatar
      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm", // default
      });
      // creating new user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // encrypting password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      // saving user to database
      await user.save();
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
          payload, 
          config.get("jwtSecret"),
          { expiresIn : 36000 }, // 3600 for an hour for production 
          (err, token)=>{
              res.json({ token });
          }); 
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
