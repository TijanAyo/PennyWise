import express from "express";
import ProfileController from "../controllers/profile.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const profileController = new ProfileController();
const authMiddleware = new AuthMiddleware();

router.get("/personal", authMiddleware.authorize, profileController.getPersonalInfo);
router.patch("/personal", authMiddleware.authorize, profileController.updatePersonalInfo);
router.post("/next-of-kin", authMiddleware.authorize, profileController.nextOfKin);
router.patch("/next-of-kin", authMiddleware.authorize, profileController.updateNextOfKin);
router.patch("/security", authMiddleware.authorize, profileController.changePassword);

export default router;