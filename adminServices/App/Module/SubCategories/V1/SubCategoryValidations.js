const Joi = require("joi");

///////////////////////
// Add SubCategory
///////////////////////
const addSubCategoryValidation = Joi.object({
  category_id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update SubCategory
///////////////////////
const updateSubCategoryValidation = Joi.object({
  category_id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// SubCategory ID Validate
///////////////////////
const SubCategoryIdValidate = Joi.number().integer().positive().required();

///////////////////////
// SubCategory Status Validate
///////////////////////
const SubCategoryStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// SubCategory Status Boolean Validate
///////////////////////
const SubCategoryStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addSubCategoryValidation,
  updateSubCategoryValidation,
  SubCategoryIdValidate,
  SubCategoryStatusValidate,
  SubCategoryStatusBooleanValidate,
};
