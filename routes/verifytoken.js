const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authToken = (req, res, next) => {
  try {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send('access denied');
    }
    const verifiedtoken = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.info(verifiedtoken._id);
    req.user = verifiedtoken;
    return next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send('invalid token');
  }
};

module.exports = authToken;
