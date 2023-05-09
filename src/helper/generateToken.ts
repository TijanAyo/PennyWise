import jwt from "jsonwebtoken";

class TokenService {

    public async verificationToken(email: string): Promise<string> {
        const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '5m'});
        return token;
    }
}

export default TokenService;