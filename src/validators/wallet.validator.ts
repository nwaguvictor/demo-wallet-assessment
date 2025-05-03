import Joi, { string } from 'joi';

export const fundOrWithdrawUserWalletSchema = Joi.object({
  amount: Joi.number().min(100).required(),
});

export const transferFundSchema = Joi.object({
  amount: Joi.number().min(100).required(),
  receiverId: Joi.string().required(),
});
