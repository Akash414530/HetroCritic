const express = require("express");
const router = express.Router();

const { checkUser } = require("../controllers/loginControl");
const {
  insertVerifyUser,
  insertSignupUser,
} = require("../controllers/signupControl");

router.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    const userExist = await checkUser(email);

    if (!userExist) {
      const verifyUserExist = await insertVerifyUser(name, email, password);

      if (!verifyUserExist) {
        res.status(200).send("verifyUserAdded");
      } else if (verifyUserExist === "Server Busy") {
        res.status(500).send("Server Busy");
      } else if (verifyUserExist) {
        res.status(200).send("verifyUserExist");
      }
    } else if (userExist === "Server Busy") {
      res.status(500).send("Server Busy");
    } else if (userExist) {
      res.status(200).send("userExist");
    }
  } catch (e) {
    console.error("Error during post /verify: ", e);
    res.status(500).send("Server Busy");
  }
});

router.get("/:token", async (req, res) => {
  try {
    const response = await insertSignupUser(req.params.token);
    res.status(200).send(response);
  } catch (e) {
    console.error("Error during get /:token: ", e);
    res.status(500).send(`
      <h3>Activation failed</h3>
      <p>Try to sigingin up again</p>
      <br><br>
      <p>Regards</p>
      <p>HetroCritic</p> `);
  }
});

module.exports = router;
