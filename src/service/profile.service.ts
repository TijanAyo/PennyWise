import { PrismaClient } from "@prisma/client";
import { logger } from "../helper/logger";
import { ValidationError } from "joi";
import { AuthenticationError, BadRequestError, NotFoundError } from "../helper/errorHandling";
import { HttpCode } from "../helper/errorHandling";
import { nextOfKinPayload, profileInfoPayload, securityInfoPayload } from "../interfaces/profile.interface";
import { nextOfKinSchema, profileInfoSchema, securityInfoSchema, updateNextOfKinSchema } from "../validation";
import AuthService from "./auth.service";
import MailerService from "../helper/mailer";

const prisma = new PrismaClient();
const authService = new AuthService();
const mailerService = new MailerService();

class ProfileService {

    public async getPersonalInfo(userId: string) {
        try {
            const profile = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    bankName: true,
                    accountNumber: true,
                    sex: true,
                    address: true,
                    city: true,
                    state: true,
                    financials: true,
                    nextOfKin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            sex: true,
                            phoneNumber: true,
                            relationship: true,
                            bankName: true,
                            accountName: true,
                            accountNumber: true
                        }
                    }
                }
            });
            if (!profile) {
                throw new BadRequestError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Something went wrong somewhere"
                });
            }
            return {data: profile};
        } catch(err:any) {
            logger.error(err.message);
            throw err;
        }
    }

    public async updatePersonalInfo(userId: string, payload: profileInfoPayload) {
        try {
            // Validate client's information
            const validatedPayload = await profileInfoSchema.validateAsync(payload);
            // Extract validated values
            const { sex, address, city, state } = validatedPayload;
            // Update personal information 
            const updatedProfile = await prisma.user.update({
                where: {id: userId},
                data: {...validatedPayload},
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    sex: true,
                    address: true,
                    city: true,
                    state: true,
                    financials: true,
                }
            });
            if (!updatedProfile) {
                throw new BadRequestError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Something unexpected happen... Try again in abit"
                });
            }
            return { message: 'Personal information updated successfully', data: updatedProfile };
        } catch(err: any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
        }  
    }

    public async nextOfKin(userId: string, payload:nextOfKinPayload) {
        try {
            const user = await prisma.user.findUnique({ where: {id: userId }});
            if (!user) {
                throw new NotFoundError({
                  httpCode: HttpCode.NOT_FOUND,
                  description: "User not found",
                });
            }
            // Validate client's information
            const validatedPayload = await nextOfKinSchema.validateAsync(payload);
            const newKin = await prisma.nextOfKin.create({
                data: {
                    ...validatedPayload,
                    user: { connect: { id: user.id}}
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    sex: true,
                    bankName: true,
                    accountName: true,
                    accountNumber: true
                }
            });
            if (!newKin) {
                throw new BadRequestError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Something unexpected happen... Try again in abit"
                });
            }
            return { message: 'Next of Kin information added successfully', data: newKin };
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
        }
    }

    public async updateNextOfKinInfo(userId: string, payload: nextOfKinPayload) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId }});
            if (!user) {
                throw new NotFoundError({
                    httpCode: HttpCode.NOT_FOUND,
                    description: "User not found",
                });
            }
            // Validate client's information
            const validatedPayload = await updateNextOfKinSchema.validateAsync(payload);
            const updatedInfo = await prisma.nextOfKin.update({
                where: { userId: user.id},
                data: { ...validatedPayload},
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    sex: true,
                    bankName: true,
                    accountName: true,
                    accountNumber: true
                }
            });
            return { message: 'Next of Kin information updated successfully', data: updatedInfo };
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
        }

    }

    public async changePassword(userId: string, payload: securityInfoPayload) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId }});
            if (!user) {
                throw new NotFoundError({
                    name: "Email not found",
                    httpCode: HttpCode.NOT_FOUND,
                    description: "Check email address and try again."
                });
            }
            // Validate client't information
            await securityInfoSchema.validateAsync(payload);
            const isPasswordValid = await authService.decodeHashedPassword(payload.currentPassword, user.password);
            if (!isPasswordValid) {
                throw new AuthenticationError({
                    name: "Incorrect Password",
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Check password and try again."
                });
            }
            // Update clients new information
            const hashedPassword = await authService.hashedPassword(payload.newPassword);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword}
            });
            // Send a mail to the user to notify them about this change
            await mailerService.sendEmail(user.email, "👀 You changed your password", `Hello ${user.firstName} \n We would like to inform you that a password change has been successfully implemented on your account.`);
            return { message: "Password has been updated successfully" };
        } catch(err:any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
        }
    }
}

export default ProfileService;