import { PrismaClient } from "@prisma/client";
import { ValidationError } from "joi";
import { signUpPayload } from "../interfaces";
import bcrypt from "bcrypt";
import { signUpSchema } from "../helper/validation/auth.validate";

const prisma = new PrismaClient();
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
                return {message: `Verification link has been sent to ${newUser.email}`};
            }
            return {message: "Someone with the email address exist... Try again with another email."};
        } catch(err:any) {
            console.error(err);
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

    private async hashedPassword(payload: string): Promise<string> {
        const salt = process.env.SALT;
        return await bcrypt.hash(payload, Number(salt));
    }

}

export default AuthService;