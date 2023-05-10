import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().email().required(),
  firstName: joi.string().max(20).required(),
  lastName: joi.string().max(20).required(),
  phoneNumber: joi.string().min(11).max(11).required(),
  password:joi.string().min(6).max(20).required()
});