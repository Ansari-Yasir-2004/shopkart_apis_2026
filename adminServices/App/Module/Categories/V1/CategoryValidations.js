const Joi = require("joi");

///////////////////////
// Add Category
///////////////////////
const addCategoryValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update Category
///////////////////////
const updateCategoryValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Category ID Validate
///////////////////////
const categoryIdValidate = Joi.number().integer().positive().required();

///////////////////////
// Category Status Validate
///////////////////////
const categoryStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// Category Status Boolean Validate
///////////////////////
const categoryStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addCategoryValidation,
  updateCategoryValidation,
  categoryIdValidate,
  categoryStatusValidate,
  categoryStatusBooleanValidate,
};
