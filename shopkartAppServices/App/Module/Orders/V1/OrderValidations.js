const Joi = require("joi");

///////////////////////
// Create Order From Cart
///////////////////////
const createOrderFromCartValidation = Joi.object({
  user_address_id: Joi.number().integer().required().messages({
    "any.required": "user_address_id is required",
  }),
});

///////////////////////
// Create Order
///////////////////////
const createOrderValidation = Joi.object({
  product_id: Joi.number().integer().required().messages({
    "any.required": "product_id is required",
  }),
  quantity: Joi.number().integer().min(1).required(),
  user_address_id: Joi.number().integer().required(),
});

///////////////////////
// Order ID
///////////////////////
const orderIdValidation = Joi.number().integer().positive().required();

module.exports = {
  createOrderFromCartValidation,
  createOrderValidation,
  orderIdValidation,
};