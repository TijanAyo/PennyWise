export interface signUpPayload {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex?: string;
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