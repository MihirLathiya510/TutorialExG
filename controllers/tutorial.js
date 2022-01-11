const { StatusCodes } = require('http-status-codes');
const tutorial = require('../models/tutorial');
const validator = require('../helpers/validator');
const logger = require('../loggers/prodlogger');

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
};
