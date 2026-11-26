const Joi = require("joi");

///////////////////////
// Add Brand
///////////////////////
const addBrandValidation = Joi.object({
  name: Joi.string().required(),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update Brand
///////////////////////
const updateBrandValidation = Joi.object({
  name: Joi.string().required(),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Brand ID Validate
///////////////////////
const brandIdValidate = Joi.number().integer().positive().required();

///////////////////////
// Brand Status Validate
///////////////////////
const brandStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// Brand Status Boolean Validate
///////////////////////
const brandStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addBrandValidation,
  updateBrandValidation,
  brandIdValidate,
  brandStatusValidate,
  brandStatusBooleanValidate,
};
