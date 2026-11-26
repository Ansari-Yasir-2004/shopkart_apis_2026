const Joi = require("joi");

///////////////////////
// Add ProductSpecification
///////////////////////
const addProductSpecificationValidation = Joi.object({
  product_id: Joi.number().required(),
  name: Joi.string().required(),
  value: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update ProductSpecification
///////////////////////
const updateProductSpecificationValidation = Joi.object({
  product_id: Joi.number().required(),
  name: Joi.string().required(),
  value: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// ProductSpecification ID Validate
///////////////////////
const productSpecificationIdValidate = Joi.number().integer().positive().required();

///////////////////////
// ProductSpecification Status Validate
///////////////////////
const productSpecificationStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// ProductSpecification Status Boolean Validate
///////////////////////
const productSpecificationStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addProductSpecificationValidation,
  updateProductSpecificationValidation,
  productSpecificationIdValidate,
  productSpecificationStatusValidate,
  productSpecificationStatusBooleanValidate,
};
