const express = require("express");
const router = express.Router();

const {
  register,
  login,
  loginOrSignInWithEmail,
  verifyOtpWithEmail,
  loginOrSignInWithMobile,
  verifyOtpWithMobile,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/loginOrSignin-with-email", loginOrSignInWithEmail);
router.put("/verify-otp-email", verifyOtpWithEmail);
router.post("/loginOrSignin-with-mobile", loginOrSignInWithMobile);
router.put("/verify-otp-mobile", verifyOtpWithMobile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
