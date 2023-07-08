export interface createVirtualAccountPayload {
    email: string,
    is_permanent: boolean,
    bvn: string
}

export interface VirtualAccountResponse {
    status: string;
    message: string;
    data: {
      response_code: string;
      response_message: string;
      flw_ref: string;
      order_ref: string;
      account_number: string;
      account_status: string;
      frequency: number;
      bank_name: string;
      created_at: Date;
      expiry_date: Date;
      note: string;
      amount: string;
    };
}