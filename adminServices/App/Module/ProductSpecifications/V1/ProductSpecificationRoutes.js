const ProductSpecificationControler = require("./ProductSpecificationController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllProductSpecifications", 
  commonValidator.validateJWTToken, 
  ProductSpecificationControler.getAllProductSpecifications
);

router.get(
  "/getProductSpecificationsById/:id", 
  commonValidator.validateJWTToken, 
  ProductSpecificationControler.getProductSpecificationsById
);

router.post(
  "/addProductSpecifications", 
  commonValidator.validateJWTToken, 
  ProductSpecificationControler.addProductSpecifications
);

router.put(
  "/updateProductSpecificationsById/:id", 
  commonValidator.validateJWTToken, 
  ProductSpecificationControler.updateProductSpecificationsById
);

router.put(
  "/updateProductSpecificationsStatusById/:id/:status",
  commonValidator.validateJWTToken,
  ProductSpecificationControler.updateProductSpecificationsStatusById,
);

router.delete(
  "/deleteProductSpecificationsById/:id",
  commonValidator.validateJWTToken,
  ProductSpecificationControler.deleteProductSpecificationsById,
);

module.exports = router;
