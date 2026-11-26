const Joi = require("joi");

///////////////////////
// Add To Cart  
///////////////////////
const addToCartValidation = Joi.object({
	product_id: Joi.number().integer().positive().required(),
	quantity: Joi.number().integer().min(1).required(),
});

///////////////////////
// Update Cart  
///////////////////////
const updateCartValidation = Joi.object({
	product_id: Joi.number().integer().positive().required(),
	quantity: Joi.number().integer().min(1).required()
});

///////////////////////
// ID Validate
///////////////////////
const idValidate = Joi.number().integer().positive().required();

module.exports = {
	addToCartValidation,
	updateCartValidation,
	idValidate,
}