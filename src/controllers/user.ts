import express from "express";
require("dotenv").config();
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const User = require("../model/user");

export async function postSignup(req: express.Request, res: express.Response) {
  const email = req.body.email;
  const newUser = await User.findOne({ email: email });
  if (newUser) {
    res.status(409).json({ msg: "Email already exists" });
  } else {
    const existsUser = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      // _id: mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: existsUser,
    });
    await user
      .save()
      .then((result: any) => {
        res.status(201).json({ success: true, Details: { User: result } });
      })
      .catch((err: any) => {
        res.status(500).json({ msg: err });
      });
  }
}

export async function postLogin(req: express.Request, res: express.Response) {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(403).json({ message: "No User found" });
  }
  const matchPassword = await bcrypt.compare(req.body.password, user.password);
  if (matchPassword) {
    const token = jwt.sign({ user }, "SECRET", {
      expiresIn: "1hr",
    });
    return res.status(200).json({
      message: "Auth successful",
      token: token,
    });
  }
  res.status(401).json({
    message: "Authentication failed",
  });
}
export async function getSignUpUser(
  req: express.Request,
  res: express.Response
) {
  const getUsers = await User.find();
  if (!getUsers) {
    res.status(404).json({ message: "No User Found" });
  } else {
    res.status(200).json({ message: getUsers });
  }
}

export async function postLogout(req: express.Request, res: express.Response) {
  User.deleteOne({ id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: `The user with an ${req.params.id} successfully remove`,
      });
    })
    .catch((err: any) => {
      res.status(400).json({ message: err });
    });
}
