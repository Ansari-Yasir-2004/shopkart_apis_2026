const controller = require("./CategoryController");
const express = require("express");
const router = express.Router();
// const commonValidator = require("../../../Validator/commonValidator");
const commonValidator = require("../../../Validator/commonValidator")
const multer = require("multer");
const uploadImage = require("../../../Utils/uploadMiddleware");
const upload = multer();

router.get(
  "/getAllCategories",
  commonValidator.validateJWTToken,
  controller.getAllCategories
);

router.get(
  "/getCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.getCategoriesById
);

router.get(
  "/getActiveCategories",
  commonValidator.validateJWTToken,
  controller.getActiveCategories
);

router.post(
  "/addCategories",
  commonValidator.validateJWTToken,
  controller.addCategories
);

router.put(
  "/updateCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.updateCategoriesById
);

router.put(
  "/updateCategoriesStatusById/:id/:status",
  commonValidator.validateJWTToken,
  controller.updateCategoriesStatusById,
);

router.delete(
  "/deleteCategoriesById/:id",
  commonValidator.validateJWTToken,
  controller.deleteCategoriesById,
);

// Images routes
router.post("/saveCategoryImageById/:id",
  uploadImage.single("image"),
  commonValidator.validateJWTToken,
  controller.saveCategoryImageById
);

router.get('/getCategoryImageById/:id',
  // basicAuth,
  controller.getCategoryImageById
);

router.delete(
  "/deleteCategoryImageById/:id",
  commonValidator.validateJWTToken,
  controller.deleteCategoryImageById
);


module.exports = router;
