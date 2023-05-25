import { Request, Response } from "express";
import AuthService from "../service/auth.service";
import { logger } from "../helper/logger";
import { NotFoundError, BadRequestError, InternalServerError, AuthenticationError,  ForbiddenError, HttpCode } from "../helper/errorHandling";

const authService = new AuthService();
class AuthController {

    public async onboarding(req: Request, res: Response) {
        try {
            const response = await authService.register(req.body);
            return res.json(response);
        } catch(err:any) {
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const response = await authService.login(req.body);
            return res.json(response);
        } catch(err:any) {
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
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
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }

    public async resendVerificationLink(req: Request, res: Response) {
        try {
            const response = await authService.resendVerficationLink(req.body);
            return res.status(200).json(response);
        } catch(err:any) {
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }

    public async forgotPassword(req: Request, res: Response) {
        try {
            const response = await authService.resetPassword(req.body);
            return res.status(200).json(response);
        } catch(err:any){
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }

    public async verifyOTP(req: Request, res: Response) {
        try {
            const response = await authService.verifyOTP(req.body);
            return res.status(200).json(response);
        } catch(err:any){
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }

    public async resendOTP(req: Request, res: Response) {
        try {
            const response = await authService.resendOTP(req.body);
            return res.status(200).json(response);
        } catch(err:any){
            if (err instanceof NotFoundError) {
                return res.status(HttpCode.NOT_FOUND).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof BadRequestError) {
                return res.status(err.statusCode).json({
                    StatusCode: err.statusCode, 
                    Message: err.message 
                });
            }
            if (err instanceof InternalServerError) {
                return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof AuthenticationError) {
                return res.status(HttpCode.UNAUTHORIZED).json({
                    StatusCode: err.statusCode,
                    Message: err.message 
                });
            }
            if (err instanceof ForbiddenError) {
                return res.status(HttpCode.FORBIDDEN).json({
                    statusCode: err.statusCode,
                    Message: err.message 
                });
            }
          
            // If the error is not one of the custom error classes, handle it as a generic internal server error
            logger.error(err.message);
            return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Something went wrong somewhere.",
            });
        }
    }
}

export default AuthController;