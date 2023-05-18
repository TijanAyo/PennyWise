export interface signUpPayload {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex?: Gender;
    address?: string;
    city?: string;
    state?: string;
    password: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface signInPayload {
    email: string
    password: string
}

export type IUser = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    password: string;
    isEmailVerified: boolean;
    createdOn: Date;
    updatedOn: Date;
}

enum Gender {
    Male = "Male",
    Female = "Female",
}

export interface resendLinkPayload {
    email: string;
}

export interface resetPasswordPayload {
    email: string;
}

export interface verifyOTPPayload {
    email: string;
    code: string
    new_password: string;
    confirm_password: string;
}

export interface resendOTPPayload {
    email: string;
}