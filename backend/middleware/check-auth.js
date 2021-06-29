const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const HttpError = require("../utils/http-error");

module.exports = (req, res, next) => {
  if (req.method == "OPTIONS") {
    return next();
  }
  let decodeTokenUser = null

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      error = new HttpError("Invalid Token ", 403);
      return next(error);
    }
    dotenv.config();
    if (token) {
      decodeTokenUser = jwt.verify(token, `${process.env.DB_USERKEY}`);
      req.user = decodeTokenUser;
    next();

  } 
  } catch (err) {
    error = new HttpError("Authentication Failed Please Try Again Later", 403);
    return next(error);
  }
}
