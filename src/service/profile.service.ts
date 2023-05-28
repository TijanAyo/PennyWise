import { PrismaClient } from "@prisma/client";
import { logger } from "../helper/logger";
import { ValidationError, string } from "joi";
import { BadRequestError } from "../helper/errorHandling";
import { HttpCode } from "../helper/errorHandling";
import { Gender, profileInfoPayload } from "../interfaces/profile.interface";
import { profileInfoSchema } from "../validation";

const prisma = new PrismaClient();

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
                data: {sex, address, city, state},
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
            return { message: 'Personal information updated successfully', profile: updatedProfile };
        } catch(err: any) {
            logger.error(err.message);
            if (err instanceof ValidationError) {
                return {message: err.details[0].message};
            }
            throw err;
        }  
    }

    public async nextOfKin() {
        // Check if the current user is authenticated properly

        // Check if the authenticated user can make this update

        // Validate the clients body

        // Update Next of Kin information

        // Success message
    }

    public async changePassword() {
        // Check if the current user is authenticated properly

        // Check is the authenticated user can make this update

        // Validate client body (current password, new password, confirm password)

        // Update security information (new password)

        // Success message
    }

}

export default ProfileService;