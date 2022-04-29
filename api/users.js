const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Flags = require('../models/Flags');
const Profile = require('../models/Profile');
const RevDB = require('../models/RevDB');
const config = require('config');
// @route POST api/users
// @desc  Register Users
// @access Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('empId', 'Employee ID is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with more than 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, empId, email, password } = req.body;
    try {
      //check if user exists
      let user = await User.findOne({ empId });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      user = new User({
        name,
        empId,
        email,
        password
      });
      let profileFlag,
        empReviewReportFlag,
        actionPlanFlag = false;
      let profile = await Profile.findOne({ empId });
      if (profile) profileFlag = true;
      let revDB = await RevDB.findOne({ empId });
      if (revDB) empReviewReportFlag = true;
      flags = new Flags({
        empId,
        profileFlag,
        empReviewReportFlag,
        actionPlanFlag
      });
      //Get users avatar TODO

      //encrypt password
      const salt = await bcrypt.genSalt(10); // more you have the more secured
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      await flags.save();
      //return jwt (so the user can log in as soon as they register)
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
