import jwt, { TokenExpiredError } from "jsonwebtoken";
import { logger } from "./logger";

class TokenService {

    public async verificationToken(email: string): Promise<string> {
        try {
            const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '10m'});
            if (!token) return 'Failed to generate token'
            return token;
        } catch(err:any){
            throw new Error(`Something went wrong somewhere: ${err.message}`);
        }
    }

    public async verifyVerificationToken(token:string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (!decoded) return "Invalid Token";
            return decoded;
        } catch(err:any) {
            if (err instanceof TokenExpiredError) return "Token has expired";
            logger.error(`Failed to verify verification token: ${err.message}`);
            throw new Error(`Something went wrong somewhere: ${err.message}`); 
        }
    }

    public async generateAccessToken(tokenArgs: {id: string, email:string}) {
        try {
            const token = jwt.sign(tokenArgs, process.env.JWT_SECRET as string, { expiresIn: '30m'});
            if (!token) return {message: "Failed to generate token"};
            return token;
        } catch(err:any) {
            logger.error(err.message);
            throw new Error("Something went wrong... Try again in few minutes time");
        }
    }

    public async generateOtp(): Promise<string> {
        try {
            const randomDecimalNum = Math.random();
            const randomNumber = Math.floor(randomDecimalNum * 10000);
            const otp = randomNumber.toString().padStart(4, '0');
            return otp;
        } catch(err:any) {
            logger.error(err.message);
            throw new Error("Something went wrong... Try again in a few minutes"); 
        }
    }
}

export default TokenService;