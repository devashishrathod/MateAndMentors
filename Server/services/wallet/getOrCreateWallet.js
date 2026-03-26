const Wallet = require("../../models/Wallet");

exports.getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId, isDeleted: false });
  if (!wallet) wallet = await Wallet.create({ userId, balances: { INR: 100 } });
  return wallet;
};
