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

export enum Relationship {
    Brother = 'Brother',
    Sister = 'Sister',
    Mother = 'Mother',
    Father = 'Father',
    Son = 'Son',
    Daughter = 'Daughter',
    Wife = 'Wife',
    Husband = 'Husband'
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
    phoneNumber: Relationship,
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