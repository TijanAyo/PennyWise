import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces";

const prisma = new PrismaClient();

declare global{
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

class AuthMiddleware {
    public async authorize(req: Request, res: Response, next: NextFunction) {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            try {
                token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
                const user = await prisma.user.findUnique({ where: { id: decoded.id }});
                if (!user) {
                    return res.status(404).json({error: "Not Found", message: "Not Authorized, User does not exist."});
                }
                req.user = user;
                next();
            } catch(err:any) {
                return res.status(401).json({error: "Not Authorized", message: "Token expired"});
            }
        } else {
            return res.status(403).json({error: "Forbidden", message: "Token not found"});
        }
    }
}

export default AuthMiddleware;