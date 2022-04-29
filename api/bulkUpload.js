const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const Profile = require('../models/Profile');
const User = require('../models/Users');

// @route  POST api/bulkUpload
// @desc   Upload bulk profiles
// @access Private
router.post('/bulkUpload/postBulk', async (req, res) => {
  profiles = req.body;
  for (let i = 0; i < profiles.length; i++) {
    try {
      elementProfile = profiles[i];
      console.log(elementProfile);
      const password = 'admin123';
      const empId = elementProfile.empId;
      const name = elementProfile.personalInformation.fullName;
      const email = elementProfile.personalInformation.fullName + '@imatmi.com';
      console.log(name);
      let profile = await Profile.findOne({ empId });
      console.log('profile');
      console.log(profile);
      if (profile) {
        console.error(
          `Attempt to create duplicate profile for empID:${elementProfile.empId}`
        );
      }
      user = new User({
        name,
        empId,
        email,
        password
      });
      //New profile
      const salt = await bcrypt.genSalt(10); // more you have the more secured
      user.password = await bcrypt.hash(password, salt);
      console.log('user');
      console.log(user);
      await user.save();
      newProfile = new Profile(elementProfile);
      await newProfile.save();

      res.json(newProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTBULKPROFILE');
    }
  }
});
module.exports = router;
