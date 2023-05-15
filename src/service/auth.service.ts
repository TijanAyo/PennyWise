import { PrismaClient } from "@prisma/client";
import { ValidationError } from "joi";
import { resendLinkPayload, resetPasswordPayload, signInPayload, signUpPayload } from "../interfaces";
import bcrypt from "bcrypt";
import { resendVerificationLinkSchema, resetPasswordSchema, signInSchema, signUpSchema } from "../validation";
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
            // Check if client email exist in database
            const emailExist = await prisma.user.findUnique({ where: { email: payload.email}});
            if (!emailExist) {
                // validate client payload
                await signUpSchema.validateAsync(payload);
                // hash client password
                const hashedPassword = await this.hashedPassword(payload.password);
                // create new client
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
            return {error: "Email Address in-use", message: "Someone with the email address exist... Try again with another email."};
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) return {message: err.details[0].message};
            return {error: "Internal Server Error", message: err.message};
        }
    }

    public async login(payload: signInPayload) {
        try {
            // Validate client information
            await signInSchema.validateAsync(payload);
            // Check if client exist in the database
            const user = await prisma.user.findUnique({ where: { email: payload.email }});
            if (!user) return {error: "Email not found", message: "Check email address and try again."};
            // Compare password
            const isPasswordValid = await this.decodeHashedPassword(payload.password, user.password);
            if (!isPasswordValid) return{error: "Incorrect Password", message: "Check password and try again."};
            if (user.isEmailVerified === true) {
                // Generate access-token
                const tokenArgs = {id: user.id, email: user.email};
                const accessToken = await tokenService.generateAccessToken(tokenArgs);
                return {message: "Success", AccessToken: accessToken};
            } 
            return {error: "Account Not Verified", message:"Check your mailbox and activate your account"};
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) return {message: err.details[0].message};
            return {error: "Internal Server Error", message: err.message};
        }
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

    public async resendVerficationLink(payload: resendLinkPayload) {
        try {
            await resendVerificationLinkSchema.validateAsync({email: payload.email});
            const user = await prisma.user.findUnique({ where: {email: payload.email}});
            if (user && user.isEmailVerified==false){
                await this.sendVerificationLink(payload.email);
                return {message: "Verification link has been sent to provided email account"};
            }
            return {error:"Activation Error", message: `${user?.firstName} account has been activated previously... SignIn to continue`};
        } catch(err:any) {
            logger.error(err.message);
            return { error: "Internal Server Error", message: err.message};
        }
    }


    public async resetPassword(payload: resetPasswordPayload) {
        try {
            // Validate client input (email)
            await resetPasswordSchema.validateAsync({email: payload.email});
            // check if client exist in database
            const user = await prisma.user.findUnique({ where: {email: payload.email}});
            if (user && user.isEmailVerified==true){
                // generate OTP code
                const otp = await tokenService.generateOtp();
                // Check if the user already has an OTP record
                const existingOtp = await prisma.otp.findUnique({ where: { userId: user.id }});
                const updatedOtp = existingOtp
                ? await prisma.otp.update({
                    where: { id: existingOtp.id },
                    data: {
                        otpCode: otp,
                        otpCodeExpires: new Date(Date.now() + 300000) // expires in 5 minutes
                    }
                })
                : await prisma.otp.create({
                    data: {
                        otpCode: otp,
                        otpCodeExpires: new Date(Date.now() + 300000), // expires in 5 minutes
                        user: { connect: { id: user.id }}
                    }
                });
                // Update the user with the OTP relation
                await prisma.user.update({
                    where: { email: payload.email },
                    data: { otp: { connect: { id: updatedOtp.id }}}
                });
                // Send OTP code to client provided input (email)
                await mailerService.sendEmail(payload.email, "Password Reset OTP", `Your OTP code is: ${otp}`);
                return {message: "OTP code has been sent to your email address."};
            }
            return {error: "User not found", message: "Invalid email address"};

        } catch(err:any){
            logger.error(err.message);
            return { error: "Internal Server Error", message: err.message};
        }
    }

    public async verifyResetYourPassword() {
        // Taking 4 parameters "code", "email", "new_password", "confirm-password"

        // Validate clients input

        // validate client provided code with code stored with client

        // Hash client password

        // update client password
    }

    private async resendToken() {}



    private async hashedPassword(payload: string): Promise<string> {
        const salt = Number(process.env.SALT);
        return await bcrypt.hash(payload, salt);
    }

    private async decodeHashedPassword(payload:string, payloadHash:string): Promise<boolean> {
        return await bcrypt.compare(payload, payloadHash);
    }

    private async sendVerificationLink(email:string) {
        const token = await tokenService.verificationToken(email);
        const verificationLink = `${process.env.BASE_URL}/auth/verify-email/${token}`;
        await mailerService.sendEmail(email, `Activate Your Account`, `If the link does not work, copy this URL into your browser: ${verificationLink}`);
    }
}

export default AuthService;