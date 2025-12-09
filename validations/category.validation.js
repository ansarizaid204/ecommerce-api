const Joi = require("joi");

const createCategorySchema = Joi.object({
  title: Joi.string().required().label("Title"),
});

module.exports = { createCategorySchema };
