import { PrismaClient } from "@prisma/client";
import { ValidationError } from "joi";
import { signUpPayload } from "../interfaces";
import bcrypt from "bcrypt";
import { signUpSchema } from "../validation/auth.validate";
import TokenService from "../helper/generateToken";
import MailerService from "../helper/mailer";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../helper/logger";

const prisma = new PrismaClient();
const tokenService = new TokenService();
const mailerService = new MailerService();
class AuthService {
    public async register(payload: signUpPayload) {
        try {
            // Check if user email exist in database
            const emailExist = await prisma.user.findUnique({ where: { email: payload.email}});
            if (!emailExist) {
                // validate user payload
                await signUpSchema.validateAsync(payload);
                // hash user password
                const hashedPassword = await this.hashedPassword(payload.password);
                // create new user
                const newUser = await prisma.user.create({
                    data: {
                        email: payload.email,
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        password: hashedPassword,
                        phoneNumber: payload.phoneNumber,
                    }
                });
                await this.sendVerificationLink(newUser.email);
                return {message: `Verification link has been sent to ${newUser.email}`};
            }
            return {message: "Someone with the email address exist... Try again with another email."};
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) return {message: err.details[0].message};
            return {error: "Internal Server Error", message: err.message};
        }
    }

    public async login() {
        // Collect user information

        // validate user information

        // Check user exist in database

        // Validate user provided information with stored information

        // return accessToken
        return 'Login Service'
    }

    public async verifyToken(token: string) {
        try {
            const userToken = await tokenService.verifyVerificationToken(token) as JwtPayload;
            if (Date.now() > userToken.exp! * 1000) {
                return { error: "Invalid Token", message: "Verification token has expired."};
            }
            const user = await prisma.user.findUnique({ where: {email: userToken.email }});
            if (!user) return { error: "Invalid Token", message: "Verification token is invalid."};
            await prisma.user.update({
                where: { email: userToken.email },
                data: { isEmailVerified: true },
            });
        } catch(err:any) {
            logger.error(err.message);
            return { error: "Internal Server Error", message: err.message};
        }
    }

    private async hashedPassword(payload: string): Promise<string> {
        const salt = Number(process.env.SALT);
        return await bcrypt.hash(payload, salt);
    }

    private async sendVerificationLink(email:string) {
        const token = await tokenService.verificationToken(email);
        const verificationLink = `${process.env.BASE_URL}/auth/verify-email/${token}`;
        await mailerService.sendEmail(email, `Activate Your Account`, `If the link does not work, copy this URL into your browser: ${verificationLink}`);
    }
}

export default AuthService;