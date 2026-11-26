const controller = require("./SubCategoryController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");
const multer = require("multer");
const uploadImage = require("../../../Utils/uploadMiddleware");
const upload = multer();

router.get(
  "/getAllSubCategories",
  commonValidator.validateJWTToken,
  controller.getAllSubCategories
);

router.get(
  "/getSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.getSubCategoriesById
);

router.get(
  "/getActiveSubCategoriesByCategoryId/:id",
  commonValidator.validateJWTToken,
  controller.getActiveSubCategoriesByCategoryId
);

router.post(
  "/addSubCategories",
  commonValidator.validateJWTToken,
  controller.addSubCategories
);

router.put(
  "/updateSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.updateSubCategoriesById
);

router.put(
  "/updateSubCategoriesStatusById/:id/:status",
  commonValidator.validateJWTToken,
  controller.updateSubCategoriesStatusById,
);

router.delete(
  "/deleteSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.deleteSubCategoriesById,
);

// Images routes
router.post("/saveSubCategoryImageById/:id",
  uploadImage.single("image"),
  commonValidator.validateJWTToken,
  controller.saveSubCategoryImageById
);

router.get('/getSubCategoryImageById/:id',
  // basicAuth,
  controller.getSubCategoryImageById
);

router.delete(
  "/deleteSubCategoryImageById/:id",
  commonValidator.validateJWTToken,
  controller.deleteSubCategoryImageById
);

module.exports = router;
