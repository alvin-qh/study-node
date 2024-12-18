import Joi from '@hapi/joi';

export interface F {
  account: string;
  password: string;
  remember?: boolean;
}

export const V = {
  body: {
    account: Joi.string().min(1).max(20).required(),
    password: Joi.string().min(6).max(25).required(),
    remember: Joi.bool(),
  },
};
