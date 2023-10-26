const Joi = require('joi');

const MangaPayloadSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  studios: Joi.string().required(),
  premiered: Joi.string().required(),
  license: Joi.string().required(),
});

module.exports = { MangaPayloadSchema };
