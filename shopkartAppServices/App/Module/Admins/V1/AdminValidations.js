const Joi = require("joi");

///////////////////////
// Add Admin
///////////////////////
const addAdminValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long and include at least one letter and one number",
    }),
  address: Joi.string().allow(""),
  block: Joi.number().valid(0, 1).required(),
  block_reason: Joi.string().allow(""),
});

///////////////////////
// Update Admin
///////////////////////
const updateAdminValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Password must be at least 6 characters long and include at least one letter and one number",
    }),
  address: Joi.string().allow(""),
  block: Joi.number().valid(0, 1).required(),
  block_reason: Joi.string().allow(""),
});

///////////////////////
// Login Admin
///////////////////////
const loginAdminValidation = Joi.object({
  number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
      "any.required": "Mobile number is required",
    }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

///////////////////////
//admin ID Validate
///////////////////////
const adminIdValidate = Joi.number().integer().positive().required();

///////////////////////
//admin Status Validate
///////////////////////
const adminStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
//admin Status Boolean Validate
///////////////////////
const adminStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addAdminValidation,
  updateAdminValidation,
  loginAdminValidation,
  adminIdValidate,
  adminStatusValidate,
  adminStatusBooleanValidate,
};
