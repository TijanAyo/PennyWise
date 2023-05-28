import { Request, Response } from "express";
import { HttpCode, BadRequestError, InternalServerError, AuthenticationError, ForbiddenError, NotFoundError } from "../helper/errorHandling";
import { logger } from "../helper/logger";
import ProfileService from "../service/profile.service";

const profileService = new ProfileService();

class ProfileController {

    public async getPersonalInfo(req: Request, res: Response) {
        try {
            const response = await profileService.getPersonalInfo(req.user.id);
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

    public async updatePersonalInfo(req: Request, res: Response) {
        try {
            const response = await profileService.updatePersonalInfo(req.user.id, req.body);
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

    public async nextOfKin(req: Request, res: Response) {
        try {
            const response = await profileService.nextOfKin(req.user.id, req.body);
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

    public async updateNextOfKin(req: Request, res: Response) {
        try {
            const response = await profileService.updateNextOfKinInfo(req.user.id, req.body);
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

    public async changePassword(req: Request, res: Response) {
        try {
            const response = await profileService.changePassword(req.user.id, req.body);
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

}

export default ProfileController;