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
            logger.error(err);
            return res.status(500).json({statusCode: 500, message: "Something went wrong somewhere."});
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const response = await authService.login();
            return res.status(200).json(response);
        } catch(err:any) {
            return res.status(500).json({statusCode: 500, message: "Something wrong happened"});
        }

    }

    public async verifyToken(req: Request, res: Response) {
        const token = req.params.token;
        const response = await authService.verifyToken(token);
        return res.status(200).json({message: `Email verification Successful`});
    }

}


export default AuthController;