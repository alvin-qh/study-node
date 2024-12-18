import joi from '@hapi/joi';
import validator from 'koa2-validation';

export interface F {
  account: string;
  password: string;
  remember: boolean;
}

export const V = validator({
  body: {
    account: joi.string().required().min(1).max(20),
    password: joi.string().required().min(6).max(25),
    remember: joi.bool(),
  },
});
