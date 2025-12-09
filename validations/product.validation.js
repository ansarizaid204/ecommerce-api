const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string().required().label("Title"),
  description: Joi.string().required().label("Description"),
  price: Joi.number().min(0).required().label("Price"),
  category: Joi.string().required().label("Category"),
});

module.exports = { createProductSchema };