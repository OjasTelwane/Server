const express = require('express');
const router = express.Router();

// @route  GET api/flags/user/:empId
// @desc   Get flags by empId
// @access Private
router.get('/flags/:empId', async (req, res) => {
  try {
    const flags = await Flags.findOne({
      empId: req.params.empId
    });
    if (!flags) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(flags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETPROFILEID');
  }
});

// @route  POST api/flags
// @desc   Create/Update a flag
// @access Private
router.post(
  '/flags',
  [
    check('profileFlag', 'profileFlag is required').not().isEmpty(),
    check('empReviewReportFlag', 'empReviewReportFlag is required')
      .not()
      .isEmpty(),
    check('actionPlanFlag', 'actionPlanFlag is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      empId,
      profileFlag,
      empReviewReportFlag,
      actionPlanFlag
    } = req.body;
    const flagFields = {};
    flagFields.empId = empId;
    flagFields.profileFlag = profileFlag;
    flagFields.empReviewReportFlag = empReviewReportFlag;
    flagFields.actionPlanFlag = actionPlanFlag;

    try {
      let flags = await Flags.findOne({ empId });

      if (flags) {
        //update in this case
        flags = await Profile.findOneAndUpdate(
          { empId },
          { $set: flagFields },
          { new: true }
        );
        return res.json(profile);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTPROFILE');
    }
  }
);
