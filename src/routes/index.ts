import Router from "express";
import { verifyToken } from "../auth/auth";

const {
  getAllAccounts,
  createAcctBeneficiary,
  getBalOfSingleAcct,
  transferMoney,
  deleteAccount,
  getBalance,
  getSingleBalance,
} = require("../controllers/index");

const route = Router();

route.get("/getTransaction", verifyToken, getAllAccounts);
route.get("/getTransaction/:_id", verifyToken, getBalOfSingleAcct);
route.post("/createAcct", verifyToken, createAcctBeneficiary);
route.post("/transfer", verifyToken, transferMoney);
route.get("/transferBalance", verifyToken, getBalance);
route.get("/transferBalance/:_id", verifyToken, getSingleBalance);
route.delete("/account/:_id", verifyToken, deleteAccount);

module.exports = route;
