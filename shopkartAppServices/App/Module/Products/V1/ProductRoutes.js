const ProductControler = require("./ProductController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getProductsById/:id",
  // commonValidator.validateJWTToken,
  ProductControler.getProductsById
);

router.get(
  "/getIsFeaturedProducts",
  // commonValidator.validateJWTToken,
  ProductControler.getIsFeaturedProducts
);

router.get(
  "/getIsNewArrivalProducts",
  // commonValidator.validateJWTToken,
  ProductControler.getIsNewArrivalProducts
);

router.get(
  "/getProductsByCategoryId/:id",
  // commonValidator.validateJWTToken,
  ProductControler.getProductsByCategoryId
);

router.get(
  "/getProductsByCategoryAndSubCategoryId",
  // commonValidator.validateJWTToken,
  ProductControler.getProductsByCategoryAndSubCategoryId
);

router.get(
  "/getProductImageById/:id",
  // commonValidator.validateJWTToken,
  ProductControler.getProductImageById
);

module.exports = router;
