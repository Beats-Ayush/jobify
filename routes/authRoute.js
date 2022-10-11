import express from "express";
import { login, register, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import rateLimiter from "express-rate-limit";

const router = express.Router();
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    "Too many requests from this IP address, please try again after some time",
});

// ! public routes. Anyone should be able to access
// ! and login/register
router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);

// ! private routes
router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
