const express = require('express'); //
const router = express.Router();
const auth = require('../../middleware/auth')
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const User = require('../../models/User')

// @route    GET api/auth
// @desc     Test route GET
// @access   Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
    "/",
    [
      check("email", "Please include a valide email").isEmail(),
      check(
        "password",
        "Password is required!"
      ).exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //to send errors back
      }
  
      const {  email, password } = req.body;
  
      try {
        let user = await User.findOne({ email });
        // check if the user exist
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials!" }] });
        }

        //will check the password if its match 
        const isMatch = await bcrypt.compare(password, user.password);
        // check if username and password match data on database 
        if(!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials!" }] });
        }

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