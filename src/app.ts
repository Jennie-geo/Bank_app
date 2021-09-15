import createError from "http-errors";
import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import joi from "joi";
import jsonwebtoken from "jsonwebtoken";
// import  {createValidator,
//   validatedRequestSchema}  from 'express-joi-validation';
//const mongoose = require('mongoose');
require("dotenv").config();
//const DATABASE_URL = 'mongodb://localhost:27017/transactionApp';
const route = require("./routes/user");
const errorPage = require("./controllers/404");
const acctRoute = require("./routes/index");
//const User = require('./src/model/user');
//const validator = createValidator()
const app = express();

// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true

// }).then(() => {
//    console.log('connected to db')
// }).catch((err: any) => {
//   console.log(err)
// });
// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", route);
app.use("/", acctRoute);

app.use(errorPage);
// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: express.NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response
  //_next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
