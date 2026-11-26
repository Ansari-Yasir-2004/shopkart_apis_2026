const controller = require("./AppBannerController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
    "/getActiveAppBanners",
    // commonValidator.validateJWTToken,
    controller.getActiveAppBanners
);

router.get(
    "/getAppBannersImageById/:id",
    // commonValidator.validateJWTToken,
    controller.getAppBannersImageById
);

module.exports = router;
