const logger = require("../../../Config/logger.config");
const AppBannerService = require("./AppBannerService");
const AppBannerValidations = require("./AppBannerValidations");
const { AppBannersMessages } = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get All App Banners Controller
///////////////------------------------------//////////////////////////////
const getAllAppBanners = async (req, res, next) => {
  logger.info("get all app banners controller => list of app banners");
  try {
    const pc = await AppBannerService.getAllAppBanners();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get App Banners By Id Controller
///////////////------------------------------//////////////////////////////
const getAppBannersById = async (req, res, next) => {
  logger.info("get app banners by id controller => app banners by id");
  try {
    const ap_bnr_id = req.params.id;

    await AppBannerValidations.appBannerIdValidate.validateAsync(ap_bnr_id);

    const pc = await AppBannerService.getAppBannersById({ ap_bnr_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add AppBanners Controller
///////////////------------------------------//////////////////////////////
const addAppBanners = async (req, res, next) => {
  logger.info("add app banners controller => add app banners");
  try {
    let { title, description, position, status } = req.body;

    let validateData = await AppBannerValidations.addAppBannerValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (position) {
      const positionCountFound = await AppBannerService.checkAppBannersByPosition(position)
      if (positionCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: AppBannersMessages.APP_BANNER_POSITION_ALREADY_EXISTS
        })
      }
    }

    const pc = await AppBannerService.addAppBanners({
      title,
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
// Update App Banners By Id Controller
///////////////------------------------------//////////////////////////////
const updateAppBannersById = async (req, res, next) => {
  logger.info("update app banners By id controller => update app banners");
  try {
    const ap_bnr_id = req.params.id;
    const { title, description, position, status } = req.body;

    await AppBannerValidations.appBannerIdValidate.validateAsync(ap_bnr_id);

    let validateData = await AppBannerValidations.updateAppBannerValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (ap_bnr_id) {
      const idExists = await AppBannerService.checkAppBannersById(ap_bnr_id)
      if (!idExists) {
        return res.status(404).json({
          status: 0,
          message: AppBannersMessages.INVALID_APP_BANNER_ID
        })
      }
    }

    if (position) {
      const positionCountFound = await AppBannerService.checkAppBannersByPosition(position, ap_bnr_id)
      if (positionCountFound != ap_bnr_id && positionCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: AppBannersMessages.APP_BANNER_POSITION_ALREADY_EXISTS
        })
      }
    }

    const pc = await AppBannerService.updateAppBannersById({
      ap_bnr_id,
      title,
      description,
      position,
      status,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error)
  }
};

/////////////--------------------------------//////////////////////////////
// Update App Banners Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateAppBannersStatusById = async (req, res, next) => {
  logger.info("update app banners status by id controller => update app banners status");
  try {
    const ap_bnr_id = req.params.id;
    const appBannerStatus = req.params.status;

    await AppBannerValidations.appBannerIdValidate.validateAsync(ap_bnr_id);
    await AppBannerValidations.appBannerStatusBooleanValidate.validateAsync(appBannerStatus);

    const statusBoolean = appBannerStatus === "true" ? 1 : 0;

    const pc = await AppBannerService.updateAppBannersStatusById({
      ap_bnr_id,
      statusBoolean,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    // res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Delete App Banners By Id Controller
///////////////------------------------------//////////////////////////////
const deleteAppBannersById = async (req, res, next) => {
  logger.info("delete app banners by id controller => delete app banners");
  try {
    const ap_bnr_id = req.params.id;

    await AppBannerValidations.appBannerIdValidate.validateAsync(ap_bnr_id);

    const pc = await AppBannerService.deleteAppBannersById({ ap_bnr_id });
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
const saveAppBannerImageById = async (req, res, next) => {
  logger.info("upload controller => uploadAppBannerImageToServer");

  try {
    const CId = req.params.id;

    const result = await AppBannerService.saveAppBannerImageById({
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
const getAppBannerImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await AppBannerService.getAppBannerImageById({ id });

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
const deleteAppBannerImageById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    const result = await AppBannerService.deleteAppBannerImageById({ id });

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
  getAllAppBanners,
  getAppBannersById,
  addAppBanners,
  updateAppBannersById,
  updateAppBannersStatusById,
  deleteAppBannersById,
  saveAppBannerImageById,
  getAppBannerImageById,
  deleteAppBannerImageById
};
