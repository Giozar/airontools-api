import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  SERVER_PORT: Joi.number().default(4000),
  DATABASE_HOST: Joi.required(),
  DATABASE_NAME: Joi.required(),
});
