import express from "express";
import db from "@repo/db/client";

const app = express();

app.post("/bankwebhook", async (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          onRampStatus: "Success",
        },
      }),
    ]);

    res.json({
      message: "Transaction was successful",
    });
  } catch (err) {
    await db.onRampTransaction.update({
      where: {
        token: paymentInformation.token,
      },
      data: {
        onRampStatus: "Failure",
      },
    });

    console.error("Error occured: ", err);
    res.status(411).json({
      error: "Some error occured",
    });
  }
});

app.listen(8080);
