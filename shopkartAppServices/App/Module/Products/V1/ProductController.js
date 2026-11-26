const ProductService = require("./ProductService");
const logger = require("../../../Config/logger.config");
const ProductValidations = require("./ProductValidations");
const {
  ProductsMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get Products By Id Controller
///////////////------------------------------//////////////////////////////
const getProductsById = async (req, res, next) => {
  logger.info("get products by id controller => products by id");

  try {
    const prod_id = req.params.id;

    await ProductValidations.productIdValidate.validateAsync(prod_id);

    const pc = await ProductService.getProductsById({ prod_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Is Featured Products Controller
///////////////------------------------------//////////////////////////////
const getIsFeaturedProducts = async (req, res, next) => {
  logger.info("get is featured products controller => is featured products list");
  try {
    const pc = await ProductService.getIsFeaturedProducts();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Is New Arrival Products Controller
///////////////------------------------------//////////////////////////////
const getIsNewArrivalProducts = async (req, res, next) => {
  logger.info("get is new arrival products controller => is new arrival products list");
  try {
    const pc = await ProductService.getIsNewArrivalProducts();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Products By Category Id Controller
///////////////------------------------------//////////////////////////////
const getProductsByCategoryId = async (req, res, next) => {
  logger.info("get products by id controller => products by id");

  try {
    const cat_id = req.params.id;

    await ProductValidations.productIdValidate.validateAsync(cat_id);

    const pc = await ProductService.getProductsByCategoryId({ cat_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Products By Category & SubCategory Id Controller
///////////////------------------------------//////////////////////////////
const getProductsByCategoryAndSubCategoryId = async (req, res, next) => {
  logger.info("get is new arrival products controller => is new arrival products list");
  try {
    const filters = req.query;

    const hasFilter = Object.values(filters).some(
      (val) => val !== undefined && val !== null && val !== "" && val !== "null"
    );

    if (!hasFilter) {
      return res.status(400).json({
        status: 0,
        message: "Please select a category"
      })
    }

    const pc = await ProductService.getProductsByCategoryAndSubCategoryId({ filters });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Product Images By Id Controller
///////////////------------------------------//////////////////////////////
const getProductImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ProductService.getProductImageById({ id });

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
}

module.exports = {
  getProductsById,
  getIsFeaturedProducts,
  getIsNewArrivalProducts,
  getProductsByCategoryId,
  getProductsByCategoryAndSubCategoryId,
  getProductImageById,
};
