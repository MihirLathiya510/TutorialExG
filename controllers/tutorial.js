const { StatusCodes } = require('http-status-codes');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const tutorial = require('../models/tutorial');
const user = require('../models/user');
const token = require('../models/token');
const validator = require('../helpers/validator');
const logger = require('../loggers/prodlogger');

const sendAnEmail = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICES,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `"TutorialExG" <${process.env.EMAIL}>`, // sender address
      to: toEmail, // list of receivers
      subject: 'Resseting Password', // Subject line
      text: `your one time password`, // plain text body
      html: `<b>your one time password is : ${otp}</b>`, // html body
    });
    // return info;
    // logger.info(info.messageId);
    return info.messageId;
  } catch (error) {
    // console.log(error.message);
    return error.message;
  }
};
const otpGenrator = function () {
  const characters = 'ABCDEFGHIJLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  let result = '';
  const charactersLength = characters.length;
  const numberslength = numbers.length;

  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    result += numbers.charAt(Math.floor(Math.random() * numberslength));
  }

  return result;
};

// Register
// API - Allow user to Register using username, email, password
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
      return res.status(StatusCodes.BAD_REQUEST).send('email doesnt exist');
    }
    const validpassword = await bcryptjs.compare(resultvalidated.password, userdata.password);
    if (!validpassword) {
      return res.status(StatusCodes.BAD_REQUEST).send('invalid password');
    }
    // res.send(userdata[]);
    // API - Login - Allow User to create a JWT token which should expire after 12 hours
    const tokendb = jwt.sign({ _id: userdata._id }, process.env.TOKEN_SECRET, { expiresIn: '12h' });
    res.header('auth-token', tokendb);
    return res.send(tokendb);
  } catch (error) {
    return res.json(error.message);
  }
};
// After login
// API - Allow User to Forgot Password. An OTP  (unique random 6 characters (numbers + alpha) )should be sent to user’s email.
const forgetPasswordUser = async (req, res) => {
  try {
    const resultvalidated = await validator.forgetPasswordSchema.validateAsync(req.body);
    const userdata = await user.findOne({ email: resultvalidated.email });
    if (!userdata) {
      return res.status(StatusCodes.BAD_REQUEST).send('email doesnt exist');
    }
    // check the email is exists or not in token
    const otpexist = await token.findOne({ email: resultvalidated.email });
    if (otpexist) {
      throw new Error('you have already genrated the otp, check your email or request it after few minutes ');
    }
    // generate an otp
    const otp = otpGenrator();
    // logger.info(otp);
    // send an email with otp
    const info = await sendAnEmail(userdata.email, otp);
    if (info && otp) {
      const tokendb = await token({
        email: userdata.email,
        otp,
      });
      tokendb.save();
    } else {
      return res.send('something went wrong');
    }
    return res.status(StatusCodes.OK).send('mailed you the otp, valid fot 1 min');
  } catch (error) {
    return res.json(error.message);
  }
};
// API - Allow User to Reset Password Using OTP.
const resetPasswordUser = async (req, res) => {
  try {
    const resultvalidated = await validator.resetPasswordSchema.validateAsync(req.body);
    const tokendb = await token.findOne({ email: resultvalidated.email, otp: resultvalidated.otp });
    if (!tokendb) {
      return res.status(StatusCodes.BAD_REQUEST).send('have you genrated your otp? , check your email');
    }
    // check the previous password
    const userdb = await user.findOne({ email: resultvalidated.email });
    const checkpassword = await bcryptjs.compare(resultvalidated.newpassword, userdb.password);
    if (checkpassword) {
      throw new Error('Password should not be the same as previous one');
    }
    // encrypt the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(resultvalidated.newpassword, salt);

    // update the password
    const userupdated = await user.findOneAndUpdate({ email: resultvalidated.email }, { password: hashedPassword });
    if (!userupdated) {
      throw new Error('User Not Found');
    } else {
      return res.status(StatusCodes.OK).json('password updated successfully');
    }
  } catch (error) {
    return res.send(error.message);
  }
};

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
  forgetPasswordUser,
  resetPasswordUser,
};
