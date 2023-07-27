const express = require("express");
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn, userInfo, updateUser } = require("../controllers/user");
const { isValidPassResetToken } = require("../utils/user");
const { userValidator, validate, validatePassword, signInValidator, isAuth } = require("../utils/auth");
const { uploadImage } = require("../utils/multer");


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
  res.json({user: {id: user._id, email: user.email, name: user.name, isVerified: user.isVerified, role: user.role, following: user.following, followers: user.followers, schoolsFollowing: user.schoolsFollowing, teachersFollowing: user.teachersFollowing}})
})

router.get("/profile/:userId", isAuth, userInfo)
router.put("/update/:userId", isAuth, uploadImage.single("avatar"), updateUser)

module.exports = router;