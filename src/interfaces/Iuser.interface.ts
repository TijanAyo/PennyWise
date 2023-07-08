export type IUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bvn: string;
    bankName?: string | null;
    accountNumber?: string | null;
    sex: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    password: string;
    isEmailVerified: boolean;
    createdOn: Date;
    updatedOn: Date;
}