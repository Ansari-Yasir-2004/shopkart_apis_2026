const AdminController = require("./AdminController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator")

router.get(
    "/getAllAdmins", 
    commonValidator.validateJWTToken, 
    AdminController.getAllAdmins
);

router.get(
    "/getAdminsById/:id", 
    commonValidator.validateJWTToken, 
    AdminController.getAdminsById
);

router.post(
    "/addAdmins", 
    commonValidator.validateJWTToken, 
    AdminController.addAdmins
);

router.put(
    "/updateAdminsById/:id", 
    commonValidator.validateJWTToken, 
    AdminController.updateAdminsById
);

router.put(
    "/updateAdminsBlockStatusById/:id/:status", 
    commonValidator.validateJWTToken, 
    AdminController.updateAdminsBlockStatusById
);

router.delete(
    "/deleteAdmins/:id", 
    commonValidator.validateJWTToken, 
    AdminController.deleteAdmins
);

router.post(
    "/loginAdmins", 
    AdminController.loginAdmins
);

module.exports = router;
