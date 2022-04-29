const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const SkillModule = require('../models/SkillModule');

// @route  POST api/skillModule
// @desc   Create/Update a skillModule
// @access Private
router.post(
  '/post',
  [check('skill', 'skill is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      skill,
      child,
      beginnerModule,
      beginnerTime,
      moderateModule,
      moderateTime,
      advancedModule,
      advancedTime
    } = req.body;
    const skillModuleFields = {};
    let skillVar = skill.toLowerCase();
    skillModuleFields.skill = skillVar;

    if (child) skillModuleFields.child = child;
    if (beginnerModule) skillModuleFields.beginnerModule = beginnerModule;
    if (beginnerTime) skillModuleFields.beginnerTime = beginnerTime;
    if (moderateModule) skillModuleFields.moderateModule = moderateModule;
    if (moderateTime) skillModuleFields.moderateTime = moderateTime;
    if (advancedModule) skillModuleFields.advancedModule = advancedModule;
    if (advancedTime) skillModuleFields.advancedTime = advancedTime;

    try {
      let skillModule = await SkillModule.findOne({ skillVar });

      if (skillModule) {
        //update in this case
        skillModule = await SkillModule.findOneAndUpdate(
          { skillVar },
          { $set: skillModuleFields },
          { new: true }
        );
        return res.json(skillModule);
      }

      //New module
      newModule = new SkillModule(skillModuleFields);
      await newModule.save();
      res.json(newModule);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error/POSTSKILLMODULE');
    }
  }
);

// @route  GET api/skillModule/all
// @desc   Get all skillModules
// @access Private
router.get('/skills', async (req, res) => {
  try {
    const skillModules = await SkillModule.find();
    res.json(skillModules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETALLSKILLMODS');
  }
});
// @route  GET api/skillModule/:skill
// @desc   Get skillModule by skill
// @access Private
router.get('/skills/:skill', async (req, res) => {
  try {
    const skillModule = await SkillModule.findOne({
      skill: req.params.skill
    });
    console.log(req.params.skill);
    console.log(skillModule);

    if (!skillModule) {
      return res.status(400).json({ msg: 'There is no Module for this skill' });
    }
    res.json(skillModule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error/GETSKILLMOD');
  }
});
module.exports = router;
