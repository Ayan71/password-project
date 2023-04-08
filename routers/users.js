//require express
const express = require("express");
const router = express.Router();
const passport = require("passport");
const nodemailer = require("nodemailer");

//require userContoller
const UserController = require("../controller/users_controllers");

//create router signIn
router.get("/signIn", UserController.signIn);
//create router signUp
router.get("/signUp", UserController.signUp);
//create router Home
//check user checkAuthenticationthen enter otherwise not
router.get("/home", passport.checkAuthentication, UserController.home);

//post create
router.post("/create", UserController.create);

// use passport as a middleware to authentication
// passport.authenticate is enbuilf function
router.post(
  "/create-session",
  passport.authenticate(
    "local",
    //failure then go signIn Page
    { failureRedirect: "/users/signIn" }
  ),
  UserController.createSession
);

//router signOut ans call destroySession
router.get("/signOut", UserController.destroySession);

// google auth check
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//call back google ayth
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/signIn" }),
  UserController.createSession
);

//forget passport

router.post("/users/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that email does not exist" });
    }

    const token = user.generatePasswordResetToken();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USERNAME,
      subject: "Password Reset",
      text:
        `Hi ${user.name},\n\n` +
        `Please click on the following link to reset your password: \n\n` +
        `http://${req.headers.host}/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await user.save();

    // Set cookie with the reset token
    res.cookie("resetToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Password reset link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//export the routers

module.exports = router;
