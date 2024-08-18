const express = require("express");
const app = express();
const db = require("./config/db");
const bodyParser = require("body-parser");
const fs = require("fs");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//logs recording middleware
app.use((req, res, next) => {
  const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}`;
  fs.appendFile("log.txt", log, err => {
    if (err) {
      console.log(err);
    }
  });
  next();
});
//To register and authenticate an User
app.use("/api/auth", authRoutes);
app.use("/api/quiz", authMiddleware, quizRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
  db()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));
});
