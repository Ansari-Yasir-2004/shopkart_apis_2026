const Joi = require("joi");

///////////////////////
// Add Enquiries
///////////////////////
const addEnquiriesValidation = Joi.object({
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
  description: Joi.string().allow(""),
  status: Joi.string().valid("PENDING", "RESOLVED").allow("", "PENDING")
});

///////////////////////
// Update Enquiries
///////////////////////
const updateEnquiriesValidation = Joi.object({
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
  description: Joi.string().allow(""),
  status: Joi.string().valid("PENDING", "RESOLVED").allow("", "PENDING")
});

///////////////////////
// Enquiries ID Validate
///////////////////////
const EnquiriesIdValidate = Joi.number().integer().positive().required();

///////////////////////
// Enquiries  Status Validate
///////////////////////
const EnquiriesStatusValidate = Joi.string().valid("PENDING", "RESOLVE").required();

///////////////////////
// Enquiries  Status Boolean Validate
///////////////////////
const EnquiriesStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addEnquiriesValidation,
  updateEnquiriesValidation,
  EnquiriesIdValidate,
  EnquiriesStatusValidate,
  EnquiriesStatusBooleanValidate,
};
