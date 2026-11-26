const ProductService = require("./ProductService");
const logger = require("../../../Config/logger.config");
const ProductValidations = require("./ProductValidations");
const {
  ProductsMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All Products Controller
///////////////------------------------------//////////////////////////////
const getAllProducts = async (req, res, next) => {
  logger.info("get all products controller => list of products");
  try {
    const pc = await ProductService.getAllProducts();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

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
// Get Active Products Controller
///////////////------------------------------//////////////////////////////
const getActiveProducts = async (req, res, next) => {
  logger.info("get active products controller => active products list");
  try {
    const pc = await ProductService.getActiveProducts();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add Products Controller
///////////////------------------------------//////////////////////////////
const addProducts = async (req, res, next) => {
  logger.info("add products controller => add products");
  try {
    const {
      brand_id,
      category_id,
      sub_category_id,
      name,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
      status,
    } = req.body;

    let validateData = await ProductValidations.addProductValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (brand_id) {
      const brandExist = await ProductService.checkBrandById(brand_id)
      if (!brandExist) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.BRAND_NOT_FOUND
        })
      }
    }

    if (category_id) {
      const categoryExist = await ProductService.checkCategoryById(category_id)
      if (!categoryExist) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.CATEGORY_NOT_FOUND
        })
      }
    }

    if (sub_category_id) {
      const subCategoryExist = await ProductService.checkSubCategoryById(sub_category_id)
      if (!subCategoryExist) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.SUB_CATEGORY_NOT_FOUND
        })
      }
    }

    if (name) {
      const nameCountFound = await ProductService.checkProductByName(name);
      if (nameCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: ProductsMessages.PRODUCT_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await ProductService.checkProductByPosition(position);
      if (positionCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: ProductsMessages.PRODUCT_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await ProductService.addProducts({
      brand_id,
      category_id,
      sub_category_id,
      name,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
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
// Update Products Controller
///////////////------------------------------//////////////////////////////
const updateProductsById = async (req, res, next) => {
  logger.info("update products by id controller => update products");
  try {
    const prod_id = req.params.id;
    const {
      brand_id,
      category_id,
      sub_category_id,
      name,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
      status,
    } = req.body;

    await ProductValidations.productIdValidate.validateAsync(prod_id);

    let validateData =
      await ProductValidations.updateProductValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (prod_id) {
      const idExists = await ProductService.checkProductById(prod_id);
      if (!idExists) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.INVALID_PRODUCT_ID,
        });
      }
    }

    if (brand_id) {
      const brandExists = await ProductService.checkBrandById(brand_id)
      if (!brandExists) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.BRAND_NOT_FOUND
        })
      }
    }

    const categoryExist = await ProductService.checkCategoryById(category_id)
    if (!categoryExist) {
      return res.status(404).json({
        status: 0,
        message: ProductsMessages.CATEGORY_NOT_FOUND
      })
    }

    if (sub_category_id) {
      const subCategoryExist = await ProductService.checkSubCategoryById(sub_category_id)
      if (!subCategoryExist) {
        return res.status(404).json({
          status: 0,
          message: ProductsMessages.SUB_CATEGORY_NOT_FOUND
        })
      }
    }

    if (name) {
      const nameCountFound = await ProductService.checkProductByName(
        name,
        prod_id,
      );
      if (nameCountFound != prod_id && nameCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: ProductsMessages.PRODUCT_ALREADY_EXISTS,
        });
      }
    }

    if (position) {
      const positionCountFound = await ProductService.checkProductByPosition(
        position,
        prod_id,
      );
      if (positionCountFound != prod_id && positionCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: ProductsMessages.PRODUCT_POSITION_ALREADY_EXISTS,
        });
      }
    }

    const pc = await ProductService.updateProductsById({
      prod_id,
      brand_id,
      category_id,
      sub_category_id,
      name,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
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
// Update Products Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateProductsStatusById = async (req, res, next) => {
  logger.info(
    "update products status by id controller => update products status",
  );
  try {
    const prod_id = req.params.id;
    const productsStatus = req.params.status;

    await ProductValidations.productIdValidate.validateAsync(prod_id);
    await ProductValidations.productStatusBooleanValidate.validateAsync(
      productsStatus,
    );

    const statusBoolean = productsStatus === "true" ? 1 : 0;

    const pc = await ProductService.updateProductsStatusById({
      prod_id,
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
// Update Products OutOfStock Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateProductsOutOfStockStatusById = async (req, res, next) => {
  logger.info(
    "update products outOfStock status by id controller => update products outOfStock Status"
  )
  try {
    const prod_id = req.params.id
    const productOutOfStockStatus = req.params.status

    await ProductValidations.productIdValidate.validateAsync(prod_id)
    await ProductValidations.productStatusBooleanValidate.validateAsync(productOutOfStockStatus)

    const statusBoolean = productOutOfStockStatus === "true" ? 1 : 0

    const pc = await ProductService.updateProductsOutOfStockStatusById({
      prod_id,
      statusBoolean
    })
    res.status(200).json(pc)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Invalid Url Parameter" })
    next(error)
  }
}

/////////////--------------------------------//////////////////////////////
// Delete Products By Id Controller
///////////////------------------------------//////////////////////////////
const deleteProductsById = async (req, res, next) => {
  logger.info("delete product by id controller => delete product");
  try {
    const prod_id = req.params.id;

    await ProductValidations.productIdValidate.validateAsync(prod_id);

    const pc = await ProductService.deleteProductsById({ prod_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

//Images

///////////--------------------------------//////////////////////////////
// Save Product Image ById Controller
/////////////------------------------------//////////////////////////////
const saveProductImageById = async (req, res, next) => {
  logger.info("upload controller => uploadProductImageToServer");

  try {
    const productId = req.params.id;

    const result = await ProductService.saveProductImageById({
      files: req.files,
      product_id: productId,
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

/////////////--------------------------------//////////////////////////////
// Get All Product Images Controller
///////////////------------------------------//////////////////////////////
const getAllProductImages = async (req, res, next) => {
  try {
    const result = await ProductService.getAllProductImages();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
    next(error);
  }
};

///////////--------------------------------//////////////////////////////
// Get Product Image ById Controller
/////////////------------------------------//////////////////////////////
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
};

///////////--------------------------------//////////////////////////////
// Delete Product Image ById Controller
/////////////------------------------------//////////////////////////////
const deleteProductImageById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    const result = await ProductService.deleteProductImageById({ id });

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
  getAllProducts,
  getProductsById,
  getActiveProducts,
  addProducts,
  updateProductsById,
  updateProductsStatusById,
  updateProductsOutOfStockStatusById,
  deleteProductsById,
  saveProductImageById,
  getAllProductImages,
  getProductImageById,
  deleteProductImageById,
};
