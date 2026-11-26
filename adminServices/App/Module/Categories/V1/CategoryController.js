const CategoryService = require("./CategoryService");
const logger = require("../../../Config/logger.config");
const CategoryValidations = require("./CategoryValidations");
const {
  CategoriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All Categories Controller
///////////////------------------------------//////////////////////////////
const getAllCategories = async (req, res, next) => {
  logger.info("get all categories controller => list of categories");
  try {
    const pc = await CategoryService.getAllCategories();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Categories By Id Controller
///////////////------------------------------//////////////////////////////
const getCategoriesById = async (req, res, next) => {
  logger.info("get categories by id controller => categories by id");

  try {
    const cat_id = req.params.id;

    await CategoryValidations.categoryIdValidate.validateAsync(cat_id);

    const pc = await CategoryService.getCategoriesById({ cat_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Active Categories Controller
///////////////------------------------------//////////////////////////////
const getActiveCategories = async (req, res, next) => {
  logger.info("get active categories controller => active categories list")

  try {
    const pc = await CategoryService.getActiveCategories()
    res.status(200).json(pc)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error)
  }
}

/////////////--------------------------------//////////////////////////////
// Add Categories Controller
///////////////------------------------------//////////////////////////////
const addCategories = async (req, res, next) => {
  logger.info("add categories controller => add categories");
  try {
    const { name, description, position, status } = req.body;

    let validateData = await CategoryValidations.addCategoryValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (name) {
      const nameCountFound = await CategoryService.checkCategoryByName(name);
      if (nameCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: CategoriesMessages.CATEGORY_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await CategoryService.checkCategoryByPosition(position);
      if (positionCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: CategoriesMessages.CATEGORY_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await CategoryService.addCategories({
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
// Update Categories By Id Controller
///////////////------------------------------//////////////////////////////
const updateCategoriesById = async (req, res, next) => {
  logger.info("update categories by id controller => update categories");
  try {
    const cat_id = req.params.id;
    const { name, description, position, status } = req.body;

    await CategoryValidations.categoryIdValidate.validateAsync(cat_id);

    let validateData =
      await CategoryValidations.updateCategoryValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const idExists = await CategoryService.checkCategoryById(cat_id);
    if (!idExists) {
      return res.status(404).json({
        status: 0,
        message: CategoriesMessages.INVALID_CATEGORY_ID,
      });
    }

    const nameCountFound = await CategoryService.checkCategoryByName(
      name,
      cat_id,
    );
    if (nameCountFound != cat_id && nameCountFound > 0) {
      return res.status(409).json({
        status: 0,
        message: CategoriesMessages.CATEGORY_ALREADY_EXISTS,
      });
    }

    const positionCountFound = await CategoryService.checkCategoryByPosition(
      position,
      cat_id,
    );
    if (positionCountFound != cat_id && positionCountFound > 0) {
      return res.status(409).json({
        status: 0,
        message: CategoriesMessages.CATEGORY_POSITION_ALREADY_EXISTS,
      });
    }

    const pc = await CategoryService.updateCategoriesById({
      cat_id,
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
// Update Categories Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateCategoriesStatusById = async (req, res, next) => {
  logger.info(
    "update categories status by id controller => update categories status",
  );
  try {
    const cat_id = req.params.id;
    const categoriesStatus = req.params.status;

    await CategoryValidations.categoryIdValidate.validateAsync(cat_id);
    await CategoryValidations.categoryStatusBooleanValidate.validateAsync(
      categoriesStatus,
    );

    const statusBoolean = categoriesStatus === "true" ? 1 : 0;

    const pc = await CategoryService.updateCategoriesStatusById({
      cat_id,
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
// Delete Categories By Id Controller
///////////////------------------------------//////////////////////////////
const deleteCategoriesById = async (req, res, next) => {
  logger.info("delete categories by id controller => delete categories");
  try {
    const cat_id = req.params.id;

    await CategoryValidations.categoryIdValidate.validateAsync(cat_id);

    const pc = await CategoryService.deleteCategoriesById({ cat_id });
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
const saveCategoryImageById = async (req, res, next) => {
  logger.info("upload controller => uploadCategoryImageToServer");

  try {
    const CId = req.params.id;

    const result = await CategoryService.saveCategoryImageById({
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
const getCategoryImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await CategoryService.getCategoryImageById({ id });

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
const deleteCategoryImageById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    const result = await CategoryService.deleteCategoryImageById({ id });

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
  getAllCategories,
  getCategoriesById,
  getActiveCategories,
  addCategories,
  updateCategoriesById,
  updateCategoriesStatusById,
  deleteCategoriesById,
  saveCategoryImageById,
  getCategoryImageById,
  deleteCategoryImageById
};
