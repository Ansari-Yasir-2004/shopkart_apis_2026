const logger = require("../../../Config/logger.config");
const AppBannerService = require("./AppBannerService");
const AppBannerValidations = require("./AppBannerValidations");
const { AppBannersMessages } = require("../../../Utils/ResponseMessagesCollection");

/////////////--------------------------------//////////////////////////////
// Get Active App Banners Controller
///////////////------------------------------//////////////////////////////
const getActiveAppBanners = async (req, res, next) => {
  logger.info("get active app banners controller => list of app banners");
  try {
    const pc = await AppBannerService.getActiveAppBanners();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get App Banners Image By Id Controller
///////////////------------------------------//////////////////////////////
const getAppBannersImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await AppBannerService.getAppBannersImageById({ id });
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
  getActiveAppBanners,
  getAppBannersImageById,
};
