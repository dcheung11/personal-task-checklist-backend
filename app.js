const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const app = express();

const taskRoutes = require("./routes/task-routes.js");
const usersRoutes = require("./routes/user-routes.js");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "*"
  //   // "Origin,Accept,Authorization, X-Requested-With, Content-Type, Access-Control-Request-Headers"
  // );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization "
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/tasks", taskRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://damien:task123@task-db.tgamxoj.mongodb.net/tasksys?retryWrites=true&w=majority"
  )
  .then(() => app.listen(8000))
  .catch((err) => {
    console.log(err);
  });
