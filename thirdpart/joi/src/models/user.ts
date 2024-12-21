import Joi from 'joi';

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
}

export const validation = Joi.object({
  id: Joi.number().required().min(1000).max(10000000),
  name: Joi.string().required().min(1).max(20),
  password: Joi.string().required().min(8).max(20),
  email: Joi.string().email().required(),
});
