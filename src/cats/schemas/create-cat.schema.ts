import * as Joi from 'joi';

const createCatSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().positive(),
  breed: Joi.string().required(),
});

export { createCatSchema };
