const express = require("express");
const router = express.Router();
const {authorizeUser} = require("../controllers/loginControl")

router.get("/", async (req, res) => {
  try {
    const authToken = await req.headers.authorization;
    const loginCredentials = await authorizeUser(authToken);
    if (!loginCredentials) {
      res.status(200).send("Invalid Token");
    } else {
      res.json(loginCredentials);
    }
  } catch (e) {
    console.error("Error during home get: ", e);
    res.status(200).send("Server Busy");
  }
});

module.exports = router;
