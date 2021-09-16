import Router from "express";
import { verifyToken } from "../auth/auth";
// const {balanceSchema,
//        userSchema,
//        transactionSchema
//     } = require('../util/auth')

const {
  postSignup,
  postLogin,
  postLogout,
  getSignUpUser,
} = require("../controllers/user");

const route = Router();

route.post("/signup", postSignup);
route.post("/login", postLogin);
route.get("/getUser", verifyToken, getSignUpUser);
route.delete("/logout", postLogout);

module.exports = route;
