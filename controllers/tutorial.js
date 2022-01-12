const { StatusCodes } = require('http-status-codes');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tutorial = require('../models/tutorial');
const user = require('../models/user');
const validator = require('../helpers/validator');
const logger = require('../loggers/prodlogger');
// Register
const registerUser = async (req, res) => {
  try {
    const resultvalidated = await validator.registerUserSchema.validateAsync(req.body);
    // for checking the username and email
    const usernameexist = await user.findOne({ username: resultvalidated.username });
    if (usernameexist) {
      return res.status(StatusCodes.BAD_REQUEST).send('username already registered');
    }
    const emailexist = await user.findOne({ email: resultvalidated.email });
    if (emailexist) {
      return res.status(StatusCodes.BAD_REQUEST).send('email already registered');
    }
    // encrypt the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(resultvalidated.password, salt);
    const userdb = await user({
      username: resultvalidated.username,
      email: resultvalidated.email,
      password: hashedPassword,
    });
    userdb.save();
    if (userdb) {
      return res.status(StatusCodes.OK).json({ userdb });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('something went wrong');
  } catch (error) {
    return res.json(error.message);
  }
};
// Login
const loginUser = async (req, res) => {
  try {
    const resultvalidated = await validator.loginUserSchema.validateAsync(req.body);
    const userdata = await user.findOne({ email: resultvalidated.email });
    if (!userdata) {
      return res.status(StatusCodes.BAD_REQUEST).send('email doesnt existed');
    }
    const validpassword = await bcryptjs.compare(resultvalidated.password, userdata.password);
    if (!validpassword) {
      return res.status(StatusCodes.BAD_REQUEST).send('invalid password');
    }
    // res.send(userdata[]);
    const token = jwt.sign({ _id: userdata._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token);
    return res.send(token);
  } catch (error) {
    return res.json(error.message);
  }
};
// After login
const getTutorial = async (req, res) => {
  try {
    let { sorting } = req.query;
    if (sorting === 'asc') {
      sorting = 1;
    } else {
      sorting = -1;
    }
    let { at } = req.query;
    if (at === 'createdAt') {
      at = { createdAt: sorting };
    } else {
      at = { updatedAt: sorting };
    }
    const tutorialdb = await tutorial.find().sort(at);
    if (tutorialdb) {
      res.json({ tutorialdb });
    }
  } catch (error) {
    // logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Somethig Went Wrong!');
  }
};
const postTutorial = async (req, res) => {
  try {
    const resultvalidated = await validator.swaggerschemasPOST.validateAsync(req.body);
    const tutorialdb = await tutorial(resultvalidated);
    tutorialdb.save();
    if (tutorialdb) {
      res.status(200).json({
        tutorialdb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};
const putTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('check your id');
    } else {
      const resultBody = await validator.swaggerschemasPUT.validateAsync(req.body);
      const tutorialdb = await tutorial.findOneAndUpdate({ _id: id }, resultBody);
      if (!tutorialdb) {
        throw new Error('Tutorial Not Found');
      } else {
        res.json(tutorialdb);
      }
    }
  } catch (error) {
    if (error.message === 'check your id') {
      res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
    if (error.message === 'Tutorial Not Found') {
      res.status(StatusCodes.NOT_FOUND).json(error.message);
    }
  }
};
const deleteTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      throw new Error('check your id');
    }
    const tutorialdb = await tutorial.findByIdAndRemove(id);
    if (!tutorialdb) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialdb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};
const findTutorial = async (req, res) => {
  try {
    const id = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    if (id == null) {
      // logger.info(id);
      throw new Error('check your id');
    }
    const tutorialdb = await tutorial.findById(id);
    if (!tutorialdb) {
      throw new Error('Tutorial Not Found');
    } else {
      res.json(tutorialdb);
    }
  } catch (error) {
    if (error.message === 'check your id') {
      res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
    if (error.message === 'Tutorial Not Found') {
      res.status(StatusCodes.NOT_FOUND).json(error.message);
    }
  }
};
const findByTitleTutorial = async (req, res) => {
  try {
    const { title } = req.params;
    let { sorting } = req.query;
    if (sorting === 'asc') {
      sorting = 1;
    } else {
      sorting = -1;
    }
    let { at } = req.query;
    if (at === 'createdAt') {
      at = { createdAt: sorting };
    } else {
      at = { updatedAt: sorting };
    }
    const tutorialdb = await tutorial.find({ title }).sort(at);
    if (!tutorialdb.length) {
      res.send('Tutorial Not Found');
    } else {
      res.json({
        tutorialdb,
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getTutorial,
  postTutorial,
  putTutorial,
  deleteTutorial,
  findTutorial,
  findByTitleTutorial,
  registerUser,
  loginUser,
};
