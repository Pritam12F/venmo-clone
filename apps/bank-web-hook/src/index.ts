import express from "express";

const app = express();

app.get("/", (req, res) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };
});

app.listen(8080);
