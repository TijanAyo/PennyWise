export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export enum FinancialDetails {
    NGN_5000_25000 = 'NGN_5000_25000',
    NGN_25000_50000 = 'NGN_25000_50000',
    NGN_50000_100000 = 'NGN_50000_100000',
    NGN_100000_150000 = 'NGN_100000_150000',
    NGN_150000_250000 = 'NGN_150000_250000',
    NGN_250000_upwards = 'NGN_250000_upwards'
}

export interface profileInfoPayload {
    sex?: Gender,
    address?: string,
    city?: string,
    state?: string,
    financials?: FinancialDetails
}

export interface nextOfKinPayload {
    firstName: string,
    lastName: string,
    sex?: Gender,
    phoneNumber: string,
    relationship: string,
    bankName: string,
    accountNumber: string,
    accountName: string
}

export interface securityInfoPayload {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}