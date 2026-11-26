const BrandService = require("./BrandService");
const logger = require("../../../Config/logger.config");
const BrandValidations = require("./BrandValidations");
const {
  BrandsMessages,
} = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All Brands Controller
///////////////------------------------------//////////////////////////////
const getAllBrands = async (req, res, next) => {
  logger.info("get all brands controller => list of brands");
  try {
    const pc = await BrandService.getAllBrands();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Brands By Id Controller
///////////////------------------------------//////////////////////////////
const getBrandsById = async (req, res, next) => {
  logger.info("get brands by id controller => brands by id");

  try {
    const brnd_id = req.params.id;

    await BrandValidations.brandIdValidate.validateAsync(brnd_id);

    const pc = await BrandService.getBrandsById({ brnd_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Active Brands Controller
///////////////------------------------------//////////////////////////////
const getActiveBrands = async (req, res, next) => {
  logger.info("get active brands controller => active brands list")

  try {
    const pc = await BrandService.getActiveBrands()
    res.status(200).json(pc)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error)
  }
}

/////////////--------------------------------//////////////////////////////
// Add Brands Controller
///////////////------------------------------//////////////////////////////
const addBrands = async (req, res, next) => {
  logger.info("add brands controller => add brands");
  try {
    const { name, status } = req.body;

    let validateData = await BrandValidations.addBrandValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (name) {
      const nameCountFound = await BrandService.checkBrandByName(name);
      if (nameCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: BrandsMessages.BRAND_ALREADY_EXISTS,
        });
      }
    }

    const pc = await BrandService.addBrands({
      name,
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
// Update Brands Controller
///////////////------------------------------//////////////////////////////
const updateBrandsById = async (req, res, next) => {
  logger.info("update brands by id controller => update brands");
  try {
    const brnd_id = req.params.id;
    const { name, status } = req.body;

    await BrandValidations.brandIdValidate.validateAsync(brnd_id);

    let validateData =
      await BrandValidations.updateBrandValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const idExists = await BrandService.checkBrandById(brnd_id);
    if (!idExists) {
      return res.status(404).json({
        status: 0,
        message: BrandsMessages.INVALID_BRAND_ID,
      });
    }

    if (name) {
      const nameCountFound = await BrandService.checkBrandByName(
        name,
        brnd_id,
      );
      if (nameCountFound != brnd_id && nameCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: BrandsMessages.BRAND_ALREADY_EXISTS,
        });
      }
    }

    const pc = await BrandService.updateBrandsById({
      brnd_id,
      name,
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
// Update Brands Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateBrandsStatusById = async (req, res, next) => {
  logger.info(
    "update brands status by id controller => update brands status",
  );
  try {
    const brnd_id = req.params.id;
    const brandsStatus = req.params.status;

    await BrandValidations.brandIdValidate.validateAsync(brnd_id);
    await BrandValidations.brandStatusBooleanValidate.validateAsync(brandsStatus);

    const statusBoolean = brandsStatus === "true" ? 1 : 0;

    const pc = await BrandService.updateBrandsStatusById({
      brnd_id,
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
// Delete Brands By Id Controller
///////////////------------------------------//////////////////////////////
const deleteBrandsById = async (req, res, next) => {
  logger.info("delete brands by id controller => delete brands");
  try {
    const brnd_id = req.params.id;

    await BrandValidations.brandIdValidate.validateAsync(brnd_id);

    const pc = await BrandService.deleteBrandsById({ brnd_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

module.exports = {
  getAllBrands,
  getBrandsById,
  getActiveBrands,
  addBrands,
  updateBrandsById,
  updateBrandsStatusById,
  deleteBrandsById,
};
