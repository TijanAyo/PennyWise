import joi from "joi";

enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other'
}

export const profileInfoSchema = joi.object({
    sex: joi.string().valid(Gender.Male, Gender.Female, Gender.Other),
    address: joi.string(),
    city: joi.string(),
    state: joi.string()
});