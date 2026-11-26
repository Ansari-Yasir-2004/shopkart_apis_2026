const Joi = require("joi");

///////////////////////
// Add / Register User
///////////////////////
const addUserValidation = Joi.object({
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
});

///////////////////////
// Update User
///////////////////////
const updateUserValidation = Joi.object({
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
});

///////////////////////
// Update User Block Status
///////////////////////
const updateUserBlockStatusValidation = Joi.object({
  block_reason: Joi.string().required(),
})

///////////////////////
// Login User
///////////////////////
const loginUserValidation = Joi.object({
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
// User ID Validate
///////////////////////
const userIdValidate = Joi.number().integer().positive().required();

///////////////////////
// User Status Validate 
///////////////////////
const userStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// User Status Boolean Validate
///////////////////////
const userStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addUserValidation,
  updateUserValidation,
  updateUserBlockStatusValidation,
  userIdValidate,
  userStatusValidate,
  userStatusBooleanValidate,
  loginUserValidation,
};