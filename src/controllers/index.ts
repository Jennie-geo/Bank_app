import express from "express";
//const balanceSchema = require('../util/auth')
import { v4 as uuidv4 } from "uuid";
import createError, { HttpError } from "http-errors";

const Balance_Detail = require("../model/balance");
const Transaction = require("../model/transaction");

const {
  balanceSchema,
  userSchema,
  transactionSchema,
} = require("../util/auth");

export async function getAllAccounts(
  req: express.Request,
  res: express.Response
) {
  try {
    //pagination
    let page = 1;
    let size = 5;
    if (req.query.page && req.query.size) {
      page = +(req.query.page as string);
      size = +(req.query.size as string);
    }
    const limit = size;
    const skip = (page - 1) * size;

    // if()
    const getTransaction = await Transaction.find({}).limit(limit).skip(skip);
    if (!getTransaction) {
      return res.status(400).json({ message: "No Transaction Found" });
    } else {
      res.status(200).json({ page, size, data: getTransaction });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
}
export async function getBalOfSingleAcct(
  req: express.Request,
  res: express.Response
) {
  try {
    const _id = req.params._id;
    console.log(_id, "id");
    const getSingleId = await Transaction.findOne({ _id: _id });
    console.log(getSingleId);
    if (!getSingleId) {
      return res
        .status(400)
        .json({ success: false, msg: `Id ${_id} doesn't exists` });
    }
    res.status(200).json({ success: true, msg: getSingleId });
  } catch (err) {
    console.log("errored");
    res.status(500).json({ msg: err });
  }
}
export async function createAcctBeneficiary(
  req: express.Request,
  res: express.Response
) {
  interface Obj {
    accountNumber: Number;
    account: Number;
  }
  try {
    const id = uuidv4();
    const validation = balanceSchema.validate(req.body);
    console.log(validation.error);
    if (validation.error) {
      res.status(400).send(validation.error.details[0].message);
      // return;
    } else {
      const { accountNumber, amount } = req.body;

      const ifAcctExists = await Transaction.findOne({
        accountNumber: accountNumber,
      });
      //console.log(ifAcctExists)
      if (ifAcctExists) {
        res.status(400).json({
          message: `Account with the account number ${accountNumber} already exists.`,
        });
      } else {
        const accountDetails = { accountNumber, amount };
        const newAcc = new Transaction(accountDetails);
        newAcc
          .save()
          .then((data: any) => {
            res.status(201).json({
              Account: {
                details: data,
                msg: "Account created successfully.",
              },
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
export async function transferMoney(
  req: express.Request,
  res: express.Response
) {
  try {
    const validation = transactionSchema.validate(req.body);
    if (validation.error) {
      res.send(validation.error.details[0].message);
    } else {
      const { senderAccount_nr, amount, receiverAccount_nr, transactionDesc } =
        req.body;

      const sender = await Transaction.findOne({
        accountNumber: senderAccount_nr,
      });
      const reciever = await Transaction.findOne({
        accountNumber: receiverAccount_nr,
      });
      console.log(sender);
      console.log(reciever);

      if (!sender) {
        res.status(400).json({
          success: false,
          msg: "Please input the sender account Number.",
        });
      } else if (!reciever) {
        res.status(400).json({
          success: false,
          msg: "Please input the Receiver account Number.",
        });
      } else if (sender && reciever.accountNumber === senderAccount_nr) {
        res.status(400).json({
          success: false,
          msg: "Please, put in a different Account Number.",
        });
      } else if (sender && reciever && sender.amount >= amount) {
        const newSenderBal = sender.amount - amount;
        const newRecieverBal = reciever.amount + amount;

        const updateTransDetails = {
          senderAccount_nr,
          amount,
          receiverAccount_nr,
          transactionDesc,
        };
        sender.amount = newSenderBal;
        reciever.amount = newRecieverBal;

        await sender.save();
        await reciever.save();

        const newAccountUpdate = new Balance_Detail(updateTransDetails);
        newAccountUpdate
          .save()
          .then(() => {
            res.status(200).json({ newAccountUpdate });
          })
          .catch((err: any) => {
            res.status(400).json({ msg: err });
          });
      } else {
        res.status(400).json({ success: false, msg: "Insufficient Amount." });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
}

export async function getBalance(req: express.Request, res: express.Response) {
  try {
    const getTransferBal = await Balance_Detail.find({});
    if (!getTransferBal) {
      return res.status(400).json({ msg: "No balance exists" });
    }
    res.status(200).json({ data: getTransferBal });
  } catch (error: any) {
    res.status(500).json({ err: error.message });
  }
}
export async function getSingleBalance(
  req: express.Request,
  res: express.Response
) {
  try {
    const _id = req.params._id;
    const getBalId = await Balance_Detail.findById({ _id: _id });
    if (!getBalId) {
      return res.status(400).json({ msg: "No such id exists" });
    }
    res.status(200).json({ data: getBalId });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteAccount(
  req: express.Request,
  res: express.Response
) {
  try {
    const getAccountId = await Transaction.findOne({ _id: req.params._id });
    if (!getAccountId) {
      return res.status(400).json({ msg: "No such Id exists." });
    }
    getAccountId
      .remove()
      .then(() => {
        res.status(200).json({
          success: true,
          msg: "An account has being deleted successfully.",
        });
      })
      .catch((err: any) => {
        res.status(403).json({ msg: err });
      });
  } catch (err) {
    res.status(500).json({ err });
  }
}
