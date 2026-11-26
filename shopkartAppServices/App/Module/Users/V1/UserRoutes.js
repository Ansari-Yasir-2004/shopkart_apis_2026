const UserController = require("./UserController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator")

router.get(
    "/getAllUsers",
    commonValidator.validateJWTToken,
    UserController.getAllUsers
);

router.get(
    "/getUsersById/:id",
    commonValidator.validateJWTToken,
    UserController.getUsersById
);

router.post(
    "/addUsers",
    commonValidator.validateJWTToken,
    UserController.addUsers
);

router.put(
    "/updateUsersById/:id",
    commonValidator.validateJWTToken,
    UserController.updateUsersById
);

router.put(
    "/updateUsersBlockStatusById/:id/:status",
    commonValidator.validateJWTToken,
    UserController.updateUsersBlockStatusById
);

router.delete(
    "/deleteUsers/:id",
    commonValidator.validateJWTToken,
    UserController.deleteUsers
);

router.post(
    "/registerUsers",
    UserController.registerUsers
)

router.post(
    "/loginUsers", 
    UserController.loginUsers
);

module.exports = router;
