const EnquiryController = require("./EnquiryController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
    "/getAllEnquiries",
    commonValidator.validateJWTToken,
    EnquiryController.getAllEnquiries
);

router.get(
    "/getEnquiriesById/:id",
    commonValidator.validateJWTToken,
    EnquiryController.getEnquiriesById
);

router.post(
    "/addEnquiries",
    commonValidator.validateJWTToken,
    EnquiryController.addEnquiries
);

router.put(
    "/updateEnquiriesById/:id",
    commonValidator.validateJWTToken,
    EnquiryController.updateEnquiriesById
);

router.put(
    "/updateEnquiriesStatusById/:id/:status",
    commonValidator.validateJWTToken,
    EnquiryController.updateEnquiriesStatusById
);

router.delete(
    "/deleteEnquiriesById/:id",
    commonValidator.validateJWTToken,
    EnquiryController.deleteEnquiriesById
);

module.exports = router;
