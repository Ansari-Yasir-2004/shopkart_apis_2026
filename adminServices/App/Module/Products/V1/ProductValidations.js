const Joi = require("joi");

///////////////////////
// Add Product
///////////////////////
const addProductValidation = Joi.object({
  brand_id: Joi.number().required(),
  category_id: Joi.number().required(),
  sub_category_id: Joi.number().allow(null),
  name: Joi.string().required(),
  original_price: Joi.number().required(),
  discount_price: Joi.number().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  out_of_stock: Joi.number().valid(0, 1).required(),
  is_featured: Joi.number().valid(0, 1).required(),
  is_new_arrival: Joi.number().valid(0, 1).required(),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update Product
///////////////////////
const updateProductValidation = Joi.object({
  brand_id: Joi.number().required(),
  category_id: Joi.number().required(),
  sub_category_id: Joi.number().allow(null),
  name: Joi.string().required(),
  original_price: Joi.number().required(),
  discount_price: Joi.number().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  out_of_stock: Joi.number().valid(0, 1).required(),
  is_featured: Joi.number().valid(0, 1).required(),
  is_new_arrival: Joi.number().valid(0, 1).required(),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Product ID Validate
///////////////////////
const productIdValidate = Joi.number().integer().positive().required();

///////////////////////
// Product Status Validate
///////////////////////
const productStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// Product Status Boolean Validate
///////////////////////
const productStatusBooleanValidate = Joi.boolean().required();

///////////////////////
// Out Of Stock Boolean Validate
///////////////////////
const productStockBooleanValidate = Joi.boolean().required();

module.exports = {
  addProductValidation,
  updateProductValidation,
  productIdValidate,
  productStatusValidate,
  productStatusBooleanValidate,
  productStockBooleanValidate,
};