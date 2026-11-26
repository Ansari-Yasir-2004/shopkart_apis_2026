const SubCategoryControler = require("./SubCategoryController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllSubCategories",
  commonValidator.validateJWTToken,
  SubCategoryControler.getAllSubCategories
);

router.get(
  "/getSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  SubCategoryControler.getSubCategoriesById
);

router.get(
  "/getSubCategoriesByCategoryId/:id",
  // commonValidator.validateJWTToken,
  SubCategoryControler.getSubCategoriesByCategoryId
);

router.post(
  "/addSubCategories",
  commonValidator.validateJWTToken,
  SubCategoryControler.addSubCategories
);

router.put(
  "/updateSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  SubCategoryControler.updateSubCategoriesById
);

router.put(
  "/updateSubCategoriesStatusById/:id/:status",
  commonValidator.validateJWTToken,
  SubCategoryControler.updateSubCategoriesStatusById,
);

router.delete(
  "/deleteSubCategoriesById/:id",
  commonValidator.validateJWTToken,
  SubCategoryControler.deleteSubCategoriesById,
);

module.exports = router;
