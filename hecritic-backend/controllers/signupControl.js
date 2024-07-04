const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VerifyUser = require("../models/VerifyUser");
const User = require("../models/User");
const { sendMail } = require("./sendMail");

require("dotenv").config();

// Function to insert a user into the VerifyUser collection
async function insertVerifyUser(name, email, password) {
  try {
    // Delete expired verification records
    await VerifyUser.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 3600000) },
    });

    // Check if the user already exists in the VerifyUser collection
    const verifyUserExist = await VerifyUser.findOne({ email: email });
    if (verifyUserExist) {
      return true;
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a token for the user
    const token = generateToken(email);

    // Create a new VerifyUser instance
    const newUser = new VerifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    // Generate the activation link and email content
    const activationLink = `${process.env.API_URL}/signup/${token}`;
    const content = `<h4>Hi, there</h4>
        <h5>Welcome to the HetroCritic App</h5>
        <p>Thank you for signing up. <a href="${activationLink}"><b>Click here</b></a> to activate your account</p>
        <p>This link is valid for the next 1 hour. If you don’t activate your account within this time frame, you will need to request a new activation link.</p>
        <br><br>
        <p>Regards</p>
        <p>HetroCritic</p>`;

    // Save the new VerifyUser instance and send the email
    await newUser.save();
    sendMail(email, "Activate Your Account", content);

    return false;
  } catch (e) {
    console.error("Error during insertVerifyUser: ", e);
    return "Server Busy";
  }
}

// Function to generate a JWT token
function generateToken(email) {
  const token = jwt.sign({ email }, process.env.SIGNUP_SECRET_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

// Function to insert a verified user into the User collection
async function insertSignupUser(token) {
  try {
    // Verify the token
    jwt.verify(token, process.env.SIGNUP_SECRET_TOKEN);
    const userVerify = await VerifyUser.findOne({ token: token });

    if (userVerify) {
      // Create a new user instance
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        token: token,
      });

      // Save the new user and delete the VerifyUser instance
      await newUser.save();
      await VerifyUser.deleteOne({ token: token });

      // Generate the email content for successful registration
      const content = `<h3>Activation Successful!</h3>
            <h4>Welcome to the HetroCritic Family</h4>
            <p>You are successfully registered</p>
            <p>Go back to site and <a href="${process.env.APP_LOGIN_URL}">login</a> to continue</p>
            <br><br>
            <p>Regards</p>
            <p>HetroCritic</p>`;

      sendMail(newUser.email, "Activation Successful!", content);

      return `<h3>Activation Successful!</h3>
            <h4>Welcome to the HetroCritic Family</h4>
            <p>You are successfully registered</p>
            <p>Go back to site and <a href="${process.env.APP_LOGIN_URL}">login</a> to continue</p>
            <br><br>
            <p>Regards</p>
            <p>HetroCritic</p>`;
    }

    return `<h3>Activation failed</h3>
            <p>This link has been already used</p>
            <p>Try to sign up again</p>
            <br><br>
            <p>Regards</p>
            <p>HetroCritic</p>`;
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.error("Token expired: ", e);
      return `<h3>Activation failed</h3>
            <p>Link expired........</p>
            <p>Try to sign up again</p>
            <br><br>
            <p>Regards</p>
            <p>HetroCritic</p>`;
    }

    console.error("Error during insertSignupUser: ", e);
    return `<h3>Activation failed</h3>
            <p>Unexpected error happened...</p>
            <br><br>
            <p>Regards</p>
            <p>HetroCritic</p>`;
  }
}

module.exports = { insertVerifyUser, insertSignupUser };
