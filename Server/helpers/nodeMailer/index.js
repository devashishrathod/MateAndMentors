const { sendLoginOtpMail } = require("./sendLoginOtpMail");
const {
  sendOtpVerificationSuccessMail,
} = require("./sendOtpVerificationSuccessMail");
const { sendResetPasswordMail } = require("./sendResetPasswordMail");

module.exports = {
  sendLoginOtpMail,
  sendOtpVerificationSuccessMail,
  sendResetPasswordMail,
};
