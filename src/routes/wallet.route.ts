import express from "express";
import WalletController from "../controllers/wallet.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const walletController = new WalletController();
const authMiddleware = new AuthMiddleware();

router.get("/balance", authMiddleware.authorize, walletController.walletBalance);

export default router;