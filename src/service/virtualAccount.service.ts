import { logger } from "../helper/logger";
import { VirtualAccountResponse, createVirtualAccountPayload
} from "../interfaces/wallet.interface";
const Flutterwave = require('flutterwave-node-v3');

class VirtualAccountService{
    /**
     * @param payload
     * Description: Using flutterwave SDK, create a virtual account
     */
    public async createVirtualAccount(payload:createVirtualAccountPayload):Promise<VirtualAccountResponse> {
        try {
            const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
            const response = await flw.VirtualAcct.create(payload);
            console.log(response);
            return response;
        } catch(err:any) {
            logger.error(err.message);
            throw err;
        }
    }
}

export default VirtualAccountService;