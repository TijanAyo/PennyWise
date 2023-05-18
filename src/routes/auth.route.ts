import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();
const authController = new AuthController();

router.post("/onboarding", authController.onboarding);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyToken);
router.post("/resend-verification-link", authController.resendVerificationLink);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);

export default router;