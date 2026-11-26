const Joi = require("joi");

///////////////////////
// Add Contact Us
///////////////////////
const addContactUsValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  number: Joi.string()
    .pattern(/^\d{10}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
    }),
  message: Joi.string().required(),
  status: Joi.string().valid("UNSEEN", "SEEN").allow("", "UNSEEN")
});

///////////////////////
// Update Contact Us
///////////////////////
const updateContactUsValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  number: Joi.string()
    .pattern(/^\d{10}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits",
    }),
  message: Joi.string().required(),
  status: Joi.string().valid("UNSEEN", "SEEN").allow("", "UNSEEN")
});

///////////////////////
// Contact Us ID Validate
///////////////////////
const contactUsIdValidate = Joi.number().integer().positive().required();

///////////////////////
// Contact Us Status Validate
///////////////////////
const contactUsStatusValidate = Joi.number().valid("UNSEEN", "SEEN").required();

///////////////////////
// Contact Us Status Validate
///////////////////////
const contactUsStatusBooleanValidate = Joi.boolean().required()

module.exports = {
  addContactUsValidation,
  updateContactUsValidation,
  contactUsIdValidate,
  contactUsStatusValidate,
  contactUsStatusBooleanValidate,
};