const { register } = require("./register");
const { login } = require("./login");
const { loginOrSignInWithEmail } = require("./loginOrSignInWithEmail");
const { verifyOtpWithEmail } = require("./verifyOtpWithEmail");
const { loginOrSignInWithMobile } = require("./loginOrSignInWithMobile");
const { verifyOtpWithMobile } = require("./verifyOtpWithMobile");
const { forgotPassword } = require("./forgotPassword");
const { resetPassword } = require("./resetPassword");

module.exports = {
  register,
  login,
  loginOrSignInWithEmail,
  verifyOtpWithEmail,
  loginOrSignInWithMobile,
  verifyOtpWithMobile,
  forgotPassword,
  resetPassword,
};
