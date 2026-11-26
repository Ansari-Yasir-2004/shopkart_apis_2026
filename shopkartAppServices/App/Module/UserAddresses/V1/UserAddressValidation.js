const Joi = require("joi");

///////////////////////
// Add Address
///////////////////////
const addAddressValidation = Joi.object({
  country: Joi.string().default("India"),

  state: Joi.string().required().messages({
    "any.required": "State is required",
  }),

  city: Joi.string().required().messages({
    "any.required": "City is required",
  }),

  building: Joi.string().allow("", null),

  area: Joi.string().allow("", null),

  landmark: Joi.string().allow("", null),

  address: Joi.string().required().messages({
    "any.required": "Address is required",
  }),

  is_default: Joi.boolean().optional(),
});

///////////////////////
// Update Address
///////////////////////
const updateAddressValidation = Joi.object({
  country: Joi.string().default("India"),

  state: Joi.string().required(),

  city: Joi.string().required(),

  building: Joi.string().allow("", null),

  area: Joi.string().allow("", null),

  landmark: Joi.string().allow("", null),

  address: Joi.string().required(),

  is_default: Joi.boolean().optional(),
});

///////////////////////
// Address ID Validate
///////////////////////
const IdValidate = Joi.number().integer().positive().required();

///////////////////////
// Set Default Address
///////////////////////
const setDefaultAddressValidation = Joi.object({
  addressId: Joi.number().integer().positive().required().messages({
    "any.required": "Address ID is required",
  }),
});

module.exports = {
  addAddressValidation,
  updateAddressValidation,
  IdValidate,
  setDefaultAddressValidation,
};