import Joi from 'joi';

export const fundUserWalletSchema = Joi.object({
  amount: Joi.number().min(100).required(),
});
