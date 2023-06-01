import express, {Request, Response} from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import profileRoute from "./routes/profile.route";
import walletRoute from "./routes/wallet.route";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/dashboard/wallet", walletRoute);

app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json({statusCode: 200, message: "PennyWiseAPI V1.0"});
});

export default app;