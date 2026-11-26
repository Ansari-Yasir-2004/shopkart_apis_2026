const Joi = require("joi");

const statusValidation = Joi.object({
  status: Joi.string()
    .valid("PENDING", "ORDERED", "ACCEPT", "PROGRESS", "COMPLETED", "CANCELLED")
    .required(),
});

const idValidate = Joi.number().integer().positive().required();

module.exports = {
  statusValidation,
  idValidate,
};