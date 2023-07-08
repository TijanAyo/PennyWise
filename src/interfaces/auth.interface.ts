export interface signUpPayload {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bvn: string;
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