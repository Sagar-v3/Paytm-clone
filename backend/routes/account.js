const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    return res.json({
      balance: account.balance,
    });
  } catch (error) {
    console.error(error);

    return res.json({
      message: "Something went wrong! Please try again later.",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { to, amount } = req.body;

    const account = await Account.findOne({userId: req.userId}).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({
      userId: to
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid Account",
      });
    }

    await Account.updateOne({ userId: req.userId },{ $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to },{ $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    return res.json({
      message: "Transfer successfull",
    });

  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
