const express = require("express");
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require("../controllers/user");
const { isValidPassResetToken } = require("../utils/user");
const { userValidator, validate, validatePassword, signInValidator, isAuth } = require("../utils/auth");
const { sendError } = require("../utils/helper");

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post('/forget-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, sendResetPasswordTokenStatus)
router.post('/reset-password', validatePassword, validate, isValidPassResetToken, resetPassword)
router.post("/sign-in", signInValidator, validate, signIn);

router.get('/is-auth', isAuth, (req, res) => {
  const {user} = req;
  res.json({user: {id: user._id, email: user.email, name: user.name, isVerified: user.isVerified, role: user.role}})
})

module.exports = router;