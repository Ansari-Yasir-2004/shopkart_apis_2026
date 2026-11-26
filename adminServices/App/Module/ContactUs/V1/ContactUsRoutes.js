const ContactUsController = require("./ContactUsController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
    "/getAllContactUs",
    commonValidator.validateJWTToken,
    ContactUsController.getAllContactUs
);

router.get(
    "/getContactUsById/:id",
    commonValidator.validateJWTToken,
    ContactUsController.getContactUsById
);

router.post(
    "/addContactUs",
    commonValidator.validateJWTToken,
    ContactUsController.addContactUs
);

router.put(
    "/updateContactUsById/:id",
    commonValidator.validateJWTToken,
    ContactUsController.updateContactUsById
);

router.put(
    "/updateContactUsStatusById/:id/:status",
    commonValidator.validateJWTToken,
    ContactUsController.updateContactUsStatusById
);

router.delete(
    "/deleteContactUsById/:id",
    commonValidator.validateJWTToken,
    ContactUsController.deleteContactUsById
);

module.exports = router;
