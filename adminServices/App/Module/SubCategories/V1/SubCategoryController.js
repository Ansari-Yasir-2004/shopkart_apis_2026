const SubCategoryService = require("./SubCategoryService");
const logger = require("../../../Config/logger.config");
const SubCategoryValidations = require("./SubCategoryValidations");
const {
  SubCategoriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All SubCategories Controller
///////////////------------------------------//////////////////////////////
const getAllSubCategories = async (req, res, next) => {
  logger.info("get all sub categories controller => list of sub categories");

  try {
    const pc = await SubCategoryService.getAllSubCategories();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get SubCategories By Id Controller
///////////////------------------------------//////////////////////////////
const getSubCategoriesById = async (req, res, next) => {
  logger.info("get sub categories by id controller => sub categories by id");

  try {
    const sub_cat_id = req.params.id;

    await SubCategoryValidations.SubCategoryIdValidate.validateAsync(sub_cat_id);

    const pc = await SubCategoryService.getSubCategoriesById({ sub_cat_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Active SubCategories By Category Id Controller
///////////////------------------------------//////////////////////////////
const getActiveSubCategoriesByCategoryId = async (req, res, next) => {
  logger.info("get active sub categories by category id controller => active sub categories list")
  try {
    const cat_id = req.params.id;

    await SubCategoryValidations.SubCategoryIdValidate.validateAsync(cat_id);

    const pc = await SubCategoryService.getActiveSubCategoriesByCategoryId({ cat_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add SubCategories Controller
///////////////------------------------------//////////////////////////////
const addSubCategories = async (req, res, next) => {
  logger.info("add sub categories controller => add sub categories");
  try {
    const { category_id, name, description, position, status } = req.body;

    let validateData = await SubCategoryValidations.addSubCategoryValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (category_id) {
      const categoryExist = await SubCategoryService.checkCategoryById(category_id)
      if (!categoryExist) {
        return res.status(404).json({
          status: 0,
          message: SubCategoriesMessages.CATEGORY_NOT_FOUND
        })
      }
    }

    if (name) {
      const nameCountFound = await SubCategoryService.checkSubCategoryByName(category_id, name);
      if (nameCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: SubCategoriesMessages.SUB_CATEGORY_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await SubCategoryService.checkSubCategoryByPosition(category_id, position);
      if (positionCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: SubCategoriesMessages.SUB_CATEGORY_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await SubCategoryService.addSubCategories({
      category_id,
      name,
      description,
      position,
      status,
    });

    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update SubCategories Controller
///////////////------------------------------//////////////////////////////
const updateSubCategoriesById = async (req, res, next) => {
  logger.info("update sub categories by id controller => update sub categories");
  try {
    const sub_cat_id = req.params.id;
    const { category_id, name, description, position, status } = req.body;

    await SubCategoryValidations.SubCategoryIdValidate.validateAsync(sub_cat_id);

    let validateData =
      await SubCategoryValidations.updateSubCategoryValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (category_id) {
      const categoryExist = await SubCategoryService.checkCategoryById(category_id)
      if (!categoryExist) {
        return res.status(404).json({
          status: 0,
          message: SubCategoriesMessages.CATEGORY_NOT_FOUND
        })
      }
    }

    if (sub_cat_id) {
      const idExists = await SubCategoryService.checkSubCategoryById(sub_cat_id);
      if (!idExists) {
        return res.status(404).json({
          status: 0,
          message: SubCategoriesMessages.INVALID_SUB_CATEGORY_ID,
        });
      }
    }

    if (name) {
      const nameCountFound = await SubCategoryService.checkSubCategoryByName(
        category_id,
        name,
        sub_cat_id,
      );
      if (nameCountFound != sub_cat_id && nameCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: SubCategoriesMessages.SUB_CATEGORY_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await SubCategoryService.checkSubCategoryByPosition(
        category_id,
        position,
        sub_cat_id,
      );
      if (positionCountFound != sub_cat_id && positionCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: SubCategoriesMessages.SUB_CATEGORY_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await SubCategoryService.updateSubCategoriesById({
      sub_cat_id,
      category_id,
      name,
      description,
      position,
      status,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update SubCategories Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateSubCategoriesStatusById = async (req, res, next) => {
  logger.info(
    "update sub categories status by id controller => update sub categories status",
  );
  try {
    const sub_cat_id = req.params.id;
    const subCategoriesStatus = req.params.status;

    await SubCategoryValidations.SubCategoryIdValidate.validateAsync(sub_cat_id);
    await SubCategoryValidations.SubCategoryStatusBooleanValidate.validateAsync(
      subCategoriesStatus,
    );

    const statusBoolean = subCategoriesStatus === "true" ? 1 : 0;

    const pc = await SubCategoryService.updateSubCategoriesStatusById({
      sub_cat_id,
      statusBoolean,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Delete SubCategories By Id Controller
///////////////------------------------------//////////////////////////////
const deleteSubCategoriesById = async (req, res, next) => {
  logger.info("delete sub categories by id controller => delete sub categories");
  try {
    const sub_cat_id = req.params.id;

    await SubCategoryValidations.SubCategoryIdValidate.validateAsync(sub_cat_id);

    const pc = await SubCategoryService.deleteSubCategoriesById({ sub_cat_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

///////////////////////////// Images Controller //////////////////////////

///////////--------------------------------//////////////////////////////
// Save App Banner Image ById Controller [AWS]
/////////////------------------------------//////////////////////////////
const saveSubCategoryImageById = async (req, res, next) => {
  logger.info("upload controller => uploadCategoryImageToServer");

  try {
    const CId = req.params.id;

    const result = await SubCategoryService.saveSubCategoryImageById({
      file: req.file,
      CId,
    });

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, error: "Image upload failed" });
    next(error);
  }
};


///////////--------------------------------//////////////////////////////
// Get App Banner Image ById Controller [AWS]
/////////////------------------------------//////////////////////////////
const getSubCategoryImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await SubCategoryService.getSubCategoryImageById({ id });

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.setHeader("Content-Type", result.contentType);
    result.stream.pipe(res);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ success: false, error: "Something went wrong" });
    next(error);
  }
};


///////////--------------------------------//////////////////////////////
// Delete App Banner Image ById Controller [AWS]
/////////////------------------------------//////////////////////////////
const deleteSubCategoryImageById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    const result = await SubCategoryService.deleteSubCategoryImageById({ id });

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllSubCategories,
  getSubCategoriesById,
  getActiveSubCategoriesByCategoryId,
  addSubCategories,
  updateSubCategoriesById,
  updateSubCategoriesStatusById,
  deleteSubCategoriesById,
  saveSubCategoryImageById,
  getSubCategoryImageById,
  deleteSubCategoryImageById
};
