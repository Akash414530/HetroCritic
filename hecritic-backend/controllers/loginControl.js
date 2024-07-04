const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../redis");
require("dotenv").config();

async function checkUser(email) {
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return true;
    }
    return false;
  } catch (e) {
    console.error("Error during CheckUser: ", e);
    return "Server Busy";
  }
}

async function authenticateUser(email, password) {
  try {
    const userCheck = await User.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, userCheck.password);
    if (validPassword) {
      const newToken = jwt.sign({ email }, process.env.LOGIN_SECRET_TOKEN);
      const response = {
        id: userCheck._id,
        name: userCheck.name,
        email: userCheck.email,
        token: newToken,
        status: true,
      };

      await User.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: newToken } },
        { new: true }
      );
      await redisClient.set(`key-${email}`, JSON.stringify(response));

      return response;
    }
    return false;
  } catch (e) {
    console.error("Error during authenticateUser: ", e);
    return "Server Busy";
  }
}

async function authorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.LOGIN_SECRET_TOKEN);
    if (decodedToken) {
      const email = decodedToken.email;
      const auth = await redisClient.get(`key-${email}`);
      if (auth) {
        const data = JSON.parse(auth);
        return data;
      } else {
        const data = await User.findOne({ email: email });
        return data;
      }
    }
  } catch (e) {
    console.error("Error during authorizeUser: ", e);
  }
}

module.exports = { checkUser, authenticateUser, authorizeUser };
