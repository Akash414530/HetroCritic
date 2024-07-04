const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const connectDb = require("./database/index");
const signupRouter = require("./routes/signupRoute");
const loginRouter = require("./routes/loginRoute");
const homeRouter = require("./routes/homeRoute");

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDb();

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

app.get("/", (req, res) => {
  res.send("API Alive");
});

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  try {
    console.log(`App listening on port ${PORT}`);
  } catch (e) {
    console.error("Error during all listen: ", e);
  }
});
