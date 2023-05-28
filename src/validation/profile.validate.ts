import joi from "joi";
import { Gender, FinancialDetails } from "../interfaces";

export const profileInfoSchema = joi.object({
    sex: joi.string().valid(Gender.Male, Gender.Female, Gender.Other),
    address: joi.string(),
    city: joi.string(),
    state: joi.string(),
    financials: joi.string().valid(
        FinancialDetails.NGN_5000_25000,
        FinancialDetails.NGN_50000_100000,
        FinancialDetails.NGN_25000_50000,
        FinancialDetails.NGN_150000_250000,
        FinancialDetails.NGN_250000_upwards,
        FinancialDetails.NGN_150000_250000
    )
});

export const nextOfKinSchema = joi.object({
    firstName: joi.string().max(20).required(),
    lastName: joi.string().max(20).required(),
    sex: joi.string().valid(Gender.Male, Gender.Female, Gender.Other),
    phoneNumber: joi.string().max(11).required(),
    relationship: joi.string().max(20).required(),
    bankName: joi.string().max(20).required(),
    accountNumber: joi.string().max(10).required(),
    accountName: joi.string().max(20).required(),
});

export const updateNextOfKinSchema = joi.object({
    firstName: joi.string().max(20),
    lastName: joi.string().max(20),
    sex: joi.string().valid(Gender.Male, Gender.Female, Gender.Other),
    phoneNumber: joi.string().max(11),
    relationship: joi.string().max(20),
    bankName: joi.string().max(20),
    accountNumber: joi.string().max(10),
    accountName: joi.string().max(20),
});

export const securityInfoSchema = joi.object({
    currentPassword: joi.string().min(6).max(20).required(),
    newPassword: joi.string().min(6).max(20).required(),
    confirmPassword: joi.ref('newPassword')
});