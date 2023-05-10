import jwt, { TokenExpiredError } from "jsonwebtoken";
import { logger } from "./logger";

class TokenService {

    public async verificationToken(email: string): Promise<string> {
        try {
            const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '5m'});
            if (!token) return 'Failed to generate token'
            return token;
        } catch(err:any){
            return `Something went wrong somewhere: ${err.message}`
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
        }
    }
}

export default TokenService;