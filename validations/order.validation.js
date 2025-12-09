const Joi = require("joi");

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().label("Product ID"),
        quantity: Joi.number().integer().min(1).required().label("Quantity"),
      })
    )
    .min(1)
    .required(),
});

module.exports = { createOrderSchema };
