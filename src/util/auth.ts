import Joi from "joi";
export const balanceSchema = Joi.object({
  accountNumber: Joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
  amount: Joi.number().required(),
});
export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),
  password: Joi.string().required(),
  cPassword: Joi.ref("password"),
  admin: Joi.boolean(),
});
export const transactionSchema = Joi.object({
  senderAccount_nr: Joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
  receiverAccount_nr: Joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
  amount: Joi.number().required(),
  transactionDesc: Joi.string().min(5),
});
