const ProductSpecificationService = require("./ProductSpecificationService");
const logger = require("../../../Config/logger.config");
const ProductSpecificationValidations = require("./ProductSpecificationValidations");
const {
  ProductSpecificationsMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All ProductSpecifications Controller
///////////////------------------------------//////////////////////////////
const getAllProductSpecifications = async (req, res, next) => {
  logger.info("get all product specifications controller => list of product specifications");

  try {
    const pc = await ProductSpecificationService.getAllProductSpecifications();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get ProductSpecifications By Id Controller
///////////////------------------------------//////////////////////////////
const getProductSpecificationsById = async (req, res, next) => {
  logger.info("get product specifications by id controller => product specifications by id");

  try {
    const prod_spec_id = req.params.id;

    await ProductSpecificationValidations.productSpecificationIdValidate.validateAsync(prod_spec_id);

    const pc = await ProductSpecificationService.getProductSpecificationsById({ prod_spec_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add ProductSpecifications Controller
///////////////------------------------------//////////////////////////////
const addProductSpecifications = async (req, res, next) => {
  logger.info("add product specifications controller => add product specifications");
  try {
    const { product_id, name, value, position, status } = req.body;

    let validateData = await ProductSpecificationValidations.addProductSpecificationValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (product_id) {
      const productExist = await ProductSpecificationService.checkProductById(product_id)
      if (!productExist) {
        return res.status(404).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_NOT_FOUND
        })
      }
    }

    if (name) {
      const nameCountFound = await ProductSpecificationService.checkProductSpecificationByName(product_id, name);
      if (nameCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_SPEC_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await ProductSpecificationService.checkProductSpecificationByPosition(product_id, position);
      if (positionCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_SPEC_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await ProductSpecificationService.addProductSpecifications({
      product_id,
      name,
      value,
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
// Update ProductSpecifications Controller
///////////////------------------------------//////////////////////////////
const updateProductSpecificationsById = async (req, res, next) => {
  logger.info("update product specifications by id controller => update product specifications");
  try {
    const prod_spec_id = req.params.id;
    const { product_id, name, value, position, status } = req.body;

    await ProductSpecificationValidations.productSpecificationIdValidate.validateAsync(prod_spec_id);

    let validateData =
      await ProductSpecificationValidations.updateProductSpecificationValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (prod_spec_id) {
      const idExists = await ProductSpecificationService.checkProductSpecificationById(prod_spec_id);
      if (!idExists) {
        return res.status(404).json({
          status: 0,
          message: ProductSpecificationsMessages.INVALID_PRODUCT_SPEC_ID,
        });
      }
    }

    if (product_id) {
      const productExist = await ProductSpecificationService.checkProductById(product_id)
      if (!productExist) {
        return res.status(404).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_NOT_FOUND
        })
      }
    }

    if (name) {
      const nameCountFound = await ProductSpecificationService.checkProductSpecificationByName(
        product_id,
        name,
        prod_spec_id,
      );
      if (nameCountFound != prod_spec_id && nameCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_SPEC_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await ProductSpecificationService.checkProductSpecificationByPosition(
        product_id,
        position,
        prod_spec_id,
      );
      if (positionCountFound != prod_spec_id && positionCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: ProductSpecificationsMessages.PRODUCT_SPEC_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await ProductSpecificationService.updateProductSpecificationsById({
      prod_spec_id,
      product_id,
      name,
      value,
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
// Update ProductSpecifications Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateProductSpecificationsStatusById = async (req, res, next) => {
  logger.info(
    "update product specifications status by id controller => update product specifications status",
  );
  try {
    const prod_spec_id = req.params.id;
    const productSpecificationsStatus = req.params.status;

    await ProductSpecificationValidations.productSpecificationIdValidate.validateAsync(prod_spec_id);
    await ProductSpecificationValidations.productSpecificationStatusBooleanValidate.validateAsync(
      productSpecificationsStatus,
    );

    const statusBoolean = productSpecificationsStatus === "true" ? 1 : 0;

    const pc = await ProductSpecificationService.updateProductSpecificationsStatusById({
      prod_spec_id,
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
// Delete ProductSpecifications By Id Controller
///////////////------------------------------//////////////////////////////
const deleteProductSpecificationsById = async (req, res, next) => {
  logger.info("delete product specifications by id controller => delete product specifications");
  try {
    const prod_spec_id = req.params.id;

    await ProductSpecificationValidations.productSpecificationIdValidate.validateAsync(prod_spec_id);

    const pc = await ProductSpecificationService.deleteProductSpecificationsById({ prod_spec_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

module.exports = {
  getAllProductSpecifications,
  getProductSpecificationsById,
  addProductSpecifications,
  updateProductSpecificationsById,
  updateProductSpecificationsStatusById,
  deleteProductSpecificationsById,
};
