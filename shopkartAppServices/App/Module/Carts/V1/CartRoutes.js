const CartController = require("./CartController");
const express = require('express');
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator")

router.get(
    "/getCart",
    commonValidator.validateJWTToken,
    CartController.getCart
)

router.post(
    "/addToCart",
    commonValidator.validateJWTToken,
    CartController.addToCart
);

router.put(
    "/updateCart",
    commonValidator.validateJWTToken,
    CartController.updateCart
);

router.delete(
    "/removeItemFromCart/:product_id",
    commonValidator.validateJWTToken,
    CartController.removeItemFromCart
);

router.delete(
    "/clearCart",
    commonValidator.validateJWTToken,
    CartController.clearCart
);

module.exports = router;