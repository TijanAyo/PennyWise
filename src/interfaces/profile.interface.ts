export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export interface profileInfoPayload {
    sex?: Gender,
    address?: string,
    city?: string,
    state?: string
}