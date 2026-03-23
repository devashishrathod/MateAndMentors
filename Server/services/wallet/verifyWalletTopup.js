const crypto = require("crypto");
const Razorpay = require("../../configs/razorpay");
const Wallet = require("../../models/Wallet");
const WalletTransaction = require("../../models/WalletTransaction");
const RazorpayTransaction = require("../../models/RazorpayTransaction");
const { getOrCreateWallet } = require("./getOrCreateWallet");
const { throwError } = require("../../utils");

exports.verifyWalletTopup = async (userId, payload) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throwError(400, "Invalid signature");
  }

  const existingTxn = await WalletTransaction.findOne({
    "reference.razorpayPaymentId": razorpayPaymentId,
  });
  if (existingTxn) {
    throwError(400, "Payment already processed");
  }

  const payment = await Razorpay.payments.fetch(razorpayPaymentId);
  if (!payment || payment.status !== "captured") {
    throwError(400, "Payment not captured");
  }

  const currency = payment.currency.toUpperCase();
  const amount = Number(payment.amount) / (currency === "INR" ? 100 : 100);

  const wallet = await getOrCreateWallet(userId);
  const openingBalance = wallet.balances[currency] || 0;
  const closingBalance = openingBalance + amount;

  const walletTxn = await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: "CREDIT",
    amount,
    currency,
    status: "SUCCESS",
    source: "RAZORPAY",
    openingBalance,
    closingBalance,
    reference: {
      razorpayOrderId,
      razorpayPaymentId,
    },
  });

  await RazorpayTransaction.create({
    userId,
    walletId: wallet._id,
    walletTransactionId: walletTxn._id,
    amount,
    amountInSmallestUnit: Number(payment.amount),
    currency,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: "PAID",
    raw: payment,
  });

  wallet.balances[currency] = closingBalance;
  await wallet.save();

  return {
    walletTransactionId: walletTxn._id,
    amount,
    currency,
    closingBalance,
  };
};
