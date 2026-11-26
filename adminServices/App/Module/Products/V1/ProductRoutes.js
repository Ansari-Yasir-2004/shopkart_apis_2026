const controller = require("./ProductController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");
const multer = require("multer");
const uploadImage = require("../../../Utils/uploadMiddleware");
const upload = multer();

router.get(
  "/getAllProducts",
  commonValidator.validateJWTToken,
  controller.getAllProducts
);

router.get(
  "/getProductsById/:id",
  commonValidator.validateJWTToken,
  controller.getProductsById
);

router.get(
  "/getActiveProducts",
  commonValidator.validateJWTToken,
  controller.getActiveProducts
);

router.post(
  "/addProducts",
  commonValidator.validateJWTToken,
  controller.addProducts
);

router.put(
  "/updateProductsById/:id",
  commonValidator.validateJWTToken,
  controller.updateProductsById
);

router.put(
  "/updateProductsStatusById/:id/:status",
  commonValidator.validateJWTToken,
  controller.updateProductsStatusById,
);

router.put(
  "/updateProductsOutOfStockById/:id/:status",
  commonValidator.validateJWTToken,
  controller.updateProductsOutOfStockStatusById,
);

router.delete(
  "/deleteProductsById/:id",
  commonValidator.validateJWTToken,
  controller.deleteProductsById,
);

//Images
router.post("/saveProductImageById/:id",
  uploadImage.array("images", 10),
  commonValidator.validateJWTToken,
  controller.saveProductImageById
);

router.get(
  "/getAllProductImages",
  commonValidator.validateJWTToken,
  controller.getAllProductImages
);

router.get('/getProductImageById/:id',
  // basicAuth,
  controller.getProductImageById
);

router.delete(
  "/deleteProductImageById/:id",
  commonValidator.validateJWTToken,
  controller.deleteProductImageById
);

module.exports = router;
