const controller = require("./CategoryController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllActiveCategories",
  // commonValidator.validateJWTToken, 
  controller.getAllActiveCategories
);

router.get(
  "/getCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.getCategoriesById
);

router.get(
  "/getActiveCategories",
  // commonValidator.validateJWTToken, 
  controller.getActiveCategories
);

router.get(
  "/getCategoriesImageById/:id",
  // commonValidator.validateJWTToken,
  controller.getCategoriesImageById
);

module.exports = router;
