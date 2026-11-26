const controller = require("./AppBannerController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");
const multer = require("multer");
const uploadImage = require("../../../Utils/uploadMiddleware");
const upload = multer();

router.get(
    "/getAllAppBanners",
    commonValidator.validateJWTToken,
    controller.getAllAppBanners
);

router.get(
    "/getAppBannersById/:id",
    commonValidator.validateJWTToken,
    controller.getAppBannersById
);

router.post(
    "/addAppBanners",
    commonValidator.validateJWTToken,
    controller.addAppBanners
);

router.put(
    "/updateAppBannersById/:id",
    commonValidator.validateJWTToken,
    controller.updateAppBannersById
);

router.put(
    "/updateAppBannersStatusById/:id/:status",
    commonValidator.validateJWTToken,
    controller.updateAppBannersStatusById
);

router.delete(
    "/deleteAppBannersById/:id",
    commonValidator.validateJWTToken,
    controller.deleteAppBannersById
);


// Images routes
router.post("/saveAppBannerImageById/:id",
  uploadImage.single("image"),
  commonValidator.validateJWTToken,
  controller.saveAppBannerImageById
);

router.get('/getAppBannerImageById/:id',
  // basicAuth,
  controller.getAppBannerImageById
);

router.delete(
  "/deleteAppBannerImageById/:id",
  commonValidator.validateJWTToken,
  controller.deleteAppBannerImageById
);

module.exports = router;
