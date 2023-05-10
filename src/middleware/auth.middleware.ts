import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { signUpPayload } from "../interfaces";

const prisma = new PrismaClient();

declare global{
    namespace Express {
        interface Request {
            user: signUpPayload
        }
    }
}