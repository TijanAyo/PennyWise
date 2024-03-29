import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().email().required(),
  firstName: joi.string().max(20).required(),
  lastName: joi.string().max(20).required(),
  phoneNumber: joi.string().min(11).max(11).required(),
  bvn: joi.string().max(11).required(),
  password:joi.string().min(6).max(20).required()
});

export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password:joi.string().min(6).max(20).required()
});

export const resendVerificationLinkSchema = joi.object({
  email: joi.string().email().required()
});

export const resetPasswordSchema = joi.object({
  email: joi.string().email().required()
});

export const verifyOTPSchema = joi.object({
  email: joi.string().email().required(),
  code: joi.string().max(4).required(),
  new_password: joi.string().min(6).max(20).required(),
  confirm_password: joi.ref('new_password')
});

export const resendOTPSchema = joi.object({
  email: joi.string().email().required()
});