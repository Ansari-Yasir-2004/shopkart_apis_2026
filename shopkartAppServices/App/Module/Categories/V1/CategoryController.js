const CategoryService = require("./CategoryService");
const logger = require("../../../Config/logger.config");
const CategoryValidations = require("./CategoryValidations");
const {
  CategoriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All Active Categories Controller
///////////////------------------------------//////////////////////////////
const getAllActiveCategories = async (req, res, next) => {
  logger.info("get all active categories controller => list of active categories");
  try {
    const pc = await CategoryService.getAllActiveCategories();
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
// Get Categories Image By Id Controller
///////////////------------------------------//////////////////////////////
const getCategoriesImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await CategoryService.getCategoriesImageById({ id });
    console.log(result);

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.setHeader("Content-Type", result.contentType);
    result.stream.pipe(res);
  } catch (error) {
    console.log("Controller Error:", error.message);
    res.status(500).json({ success: false, error: "Something went wrong" });
    next(error);
  }
};

module.exports = {
  getAllActiveCategories,
  getCategoriesById,
  getActiveCategories,
  getCategoriesImageById,
};
