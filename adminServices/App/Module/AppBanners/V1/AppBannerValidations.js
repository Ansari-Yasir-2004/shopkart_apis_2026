const Joi = require("joi");

///////////////////////
// Add App Banner
///////////////////////
const addAppBannerValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// Update App Banner
///////////////////////
const updateAppBannerValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  position: Joi.number().allow(null),
  status: Joi.number().valid(0, 1).required(),
});

///////////////////////
// App Banner ID Validate
///////////////////////
const appBannerIdValidate = Joi.number().integer().positive().required();

///////////////////////
// App Banner Status Validate
///////////////////////
const appBannerStatusValidate = Joi.number().valid(0, 1).required();

///////////////////////
// App Banner Status Boolean Validate
///////////////////////
const appBannerStatusBooleanValidate = Joi.boolean().required();

module.exports = {
  addAppBannerValidation,
  updateAppBannerValidation,
  appBannerIdValidate,
  appBannerStatusValidate,
  appBannerStatusBooleanValidate,
};