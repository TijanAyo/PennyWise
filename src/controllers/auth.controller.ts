import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { logger } from "../helper/logger";

const authService = new AuthService();
class AuthController {
    public async onboarding(req: Request, res: Response) {
        try {
            const response = await authService.register(req.body);
            return res.status(201).json(response);
        } catch(err:any) {
            logger.error(err.message);
            return res.status(500).json({statusCode: 500, message: "Something went wrong somewhere."});
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const response = await authService.login(req.body);
            return res.status(200).json(response);
        } catch(err:any) {
            logger.error(err.message);
            return res.status(500).json({statusCode: 500, message: "Something wrong happened"});
        }

    }

    public async verifyToken(req: Request, res: Response) {
        try {
            const token = req.params.token;
            const verified = await authService.verifyToken(token);
            if (verified === undefined) {
                return res.status(200).json({ message: `Email verification Successful` });
            } else {
                return res.status(403).json({ message: "Email Verification not successful... Resend Verification Link" });
            }
        } catch(err:any) {
            // logger.error(err.message);
            return res.status(500).json({statusCode: 500, message: "Something went wrong somewhere"});
        }
    }

    public async resendVerificationLink(req: Request, res: Response) {
        try {
            const response = await authService.resendVerficationLink(req.body);
            return res.status(200).json(response);
        } catch(err:any) {
            logger.error(err.message);
            return res.status(500).json({statusCode: 500, message: "Something went wrong somewhere"});
        }
    }

    public async forgotPassword(req: Request, res: Response) {
        try {
            const response = await authService.resetPassword(req.body);
            return res.status(200).json(response);
        } catch(err:any){
            logger.error(err.message);
            return res.status(500).json({statusCode: 500, message: "Something went wrong somewhere"});
        }
    }
}

export default AuthController;