const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../controllers/loginControl");
const redisClient = require("../redis");

redisClient
  .connect()
  .then(() => {
    console.log("connected to redisClient");
  })
  .catch((e) => {
    console.error("Error during redisClient connection: ", e);
  });

router.post("/", async (req, res) => {
  try {
    const { email, password } = await req.body;
    const loginCredentials = await authenticateUser(email, password);
    if (!loginCredentials) {
      res.status(200).send(loginCredentials);
    } else if (loginCredentials === "Server Busy") {
      res.status(200).send(loginCredentials);
    } else {
      res.status(200).json({ token: loginCredentials.token });
    }
  } catch (e) {
    console.error("Error during /login post: ", e);
    res.status(500).send("Server Busy");
  }
});

module.exports = router;
