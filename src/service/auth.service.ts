import { PrismaClient } from "@prisma/client";
import { ValidationError } from "joi";
import { resendLinkPayload,resendOTPPayload,
        resetPasswordPayload, signInPayload,
        signUpPayload, verifyOTPPayload
} from "../interfaces";
import bcrypt from "bcrypt";
import { resendOTPSchema, resendVerificationLinkSchema,
        resetPasswordSchema, signInSchema,
        signUpSchema, verifyOTPSchema 
} from "../validation";
import TokenService from "../helper/generateToken";
import MailerService from "../helper/mailer";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../helper/logger";
import { AuthenticationError,BadRequestError,
        ForbiddenError, HttpCode,
        NotFoundError
} from "../helper/errorHandling";
import VirtualAccountService from "./virtualAccount.service";
import { createVirtualAccountPayload } from "../interfaces/wallet.interface";

const prisma = new PrismaClient();
const tokenService = new TokenService();
const mailerService = new MailerService();
const virtualAccountService = new VirtualAccountService();
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
                        bvn: payload.bvn,
                        phoneNumber: payload.phoneNumber,
                    }
                });
                await this.sendVerificationLink(newUser.email);
                // Virtual account payload
                const virtualAccountPayload: createVirtualAccountPayload = {
                    email: payload.email,
                    is_permanent: true,
                    bvn: payload.bvn
                }
                const virtualAccountResponse = await virtualAccountService.createVirtualAccount(virtualAccountPayload);
                // Create wallet for registered user with virtual account info
                await prisma.wallet.create({
                    data: {
                        accountNumber: virtualAccountResponse.data.account_number,
                        bankName: virtualAccountResponse.data.bank_name,
                        balance: virtualAccountResponse.data.amount,
                        user: { connect: { id: newUser.id }}
                    },
                });
                return {message: `Verification link has been sent to ${newUser.email}`};
            }
            throw new BadRequestError({
                httpCode: HttpCode.BAD_REQUEST,
                description: "Someone with the email address already exists." 
            });
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err; // Rethrow the error to be caught in the controller  
        }
    }

    public async login(payload: signInPayload) {
        try {
            // Validate client information
            await signInSchema.validateAsync(payload);
            // Check if client exist in the database
            const user = await prisma.user.findUnique({ where: { email: payload.email }});
            if (!user) {
                throw new NotFoundError({
                    name: "Email not found",
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Check email address and try again."
                });
            }
            // Compare password
            const isPasswordValid = await this.decodeHashedPassword(payload.password, user.password);
            // if (!isPasswordValid) return{error: "Incorrect Password", message: "Check password and try again."};
            if (!isPasswordValid) {
                throw new AuthenticationError({
                    name: "Incorrect Password",
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Check password and try again."
                });
            }
            if (user.isEmailVerified === true) {
                // Generate access-token
                const tokenArgs = {id: user.id, email: user.email};
                const accessToken = await tokenService.generateAccessToken(tokenArgs);
                return {message: "Success", AccessToken: accessToken};
            } 
            throw new ForbiddenError({
                name: "Account Not Verified",
                httpCode: HttpCode.FORBIDDEN,
                description: "Check your mailbox and activate your account" 
            });
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err; // Rethrow the error to be caught in the controller
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
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
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
            throw new BadRequestError({
                name: "User not found",
                httpCode: HttpCode.NOT_FOUND,
                description: "Invalid Email Address."
            });
        } catch(err:any){
            logger.error(err.message);
            throw err;
        }
    }

    public async verifyOTP(payload: verifyOTPPayload) {
        try {
            // Validate clients input
            await verifyOTPSchema.validateAsync(payload);
            // Check client via email
            const user = await prisma.user.findUnique({where: {email: payload.email}});
            if (!user) return {error: "User not found", message: "Invalid email address"};
            // Find the OTP record associated with the user
            const otp = await prisma.otp.findUnique({where: {userId: user.id}});
            if (!otp) return {error: "Invalid OTP", message: "OTP not associated with any user"};
            // Validate clients OTP with stored user OTP
            if (otp.otpCode !== payload.code) return {error: "Invalid OTP", message: "Incorrect OTP"}
            // Check if OTP has not expired
            if (otp.otpCodeExpires < new Date()) return { error: "Expired OTP", message: "OTP code has expired" };
            // Hash client provided password
            const hashedPassword = await this.hashedPassword(payload.new_password);
            // Update client information
            await prisma.user.update({
                where: { email: payload.email },
                data: { password: hashedPassword }
            });
            // Delete OTP record, no longer needed
            await prisma.otp.delete({where: {id: otp.id}});
            return { message: "Password has been successfully reset" };
        } catch(err:any) {
            logger.error(err.message);
            return { error: "Internal Server Error", message: err.message};
        }
    }

    public async resendOTP(payload: resendOTPPayload) {
        try {
            // Validate client input
            await resendOTPSchema.validateAsync({email: payload.email});
            // Find user
            const user = await prisma.user.findUnique({where: { email: payload.email }});
            if (!user) return { error: "User not found", message: "User does not exist"};
            // Find OTP associated with user
            const existingOTP = await prisma.otp.findUnique({
                where: { userId: user.id, }
            });
            // Check is otp is still valid
            const otpValid =  existingOTP?.otpCodeExpires && existingOTP.otpCodeExpires > new Date();
            // if otp is no longer valid
            if (!otpValid) {
                const newOTP = await tokenService.generateOtp();
                await prisma.otp.update({
                    where: {userId: user.id},
                    data: {
                        otpCode: newOTP,
                        otpCodeExpires: new Date(Date.now() + 300000) // Expires in 5 minutes
                    }
                });
                // Send OTP code to client provided input (email)
                await mailerService.sendEmail(payload.email, "Password Reset OTP", `Your OTP code is: ${newOTP}`);
                return { message: "OTP code has been sent to your email address." };
            }
            await mailerService.sendEmail(payload.email, "Password Reset OTP", `Your OTP is still valid: ${existingOTP.otpCode}. Please do not share it with anyone.`);
            return { message: "OTP code has been sent to your email address." };
        } catch(err:any) {
            logger.error(err.message);
            return { error: "Internal Server Error", message: err.message};
        }
    }

    public async hashedPassword(payload: string): Promise<string> {
        const salt = Number(process.env.SALT);
        return await bcrypt.hash(payload, salt);
    }

    public async decodeHashedPassword(payload:string, payloadHash:string): Promise<boolean> {
        return await bcrypt.compare(payload, payloadHash);
    }

    private async sendVerificationLink(email:string) {
        const token = await tokenService.verificationToken(email);
        const verificationLink = `${process.env.BASE_URL}/auth/verify-email/${token}`;
        await mailerService.sendEmail(email, `Activate Your Account`, `If the link does not work, copy this URL into your browser: ${verificationLink}`);
    }
}

export default AuthService;