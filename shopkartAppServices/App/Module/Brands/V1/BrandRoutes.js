const BrandControler = require("./BrandController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllBrands", 
  commonValidator.validateJWTToken, 
  BrandControler.getAllBrands
);

router.get(
  "/getBrandsById/:id", 
  commonValidator.validateJWTToken, 
  BrandControler.getBrandsById
);

router.get(
  "/getActiveBrands", 
  commonValidator.validateJWTToken, 
  BrandControler.getActiveBrands
);

router.post(
  "/addBrands", 
  commonValidator.validateJWTToken, 
  BrandControler.addBrands
);

router.put(
  "/updateBrandsById/:id", 
  commonValidator.validateJWTToken, 
  BrandControler.updateBrandsById
);

router.put(
  "/updateBrandsStatusById/:id/:status",
  commonValidator.validateJWTToken,
  BrandControler.updateBrandsStatusById,
);

router.delete(
  "/deleteBrandsById/:id",
  commonValidator.validateJWTToken,
  BrandControler.deleteBrandsById,
);

module.exports = router;
