const express = require("express");
const router = express.Router();
const UserAddressController = require("./UserAdressController");
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllUserAddresses",
  commonValidator.validateJWTToken,
  UserAddressController.getAllUserAddresses
);

router.post(
  "/addUserAddress",
  commonValidator.validateJWTToken,
  UserAddressController.addUserAddress
);

router.put(
  "/setDefaultUserAddress/:id",
  commonValidator.validateJWTToken,
  UserAddressController.setDefaultUserAddress
);

router.delete(
  "/deleteUserAddress/:id",
  commonValidator.validateJWTToken,
  UserAddressController.deleteUserAddress
);

module.exports = router;