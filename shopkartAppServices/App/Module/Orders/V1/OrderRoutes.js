const OrderController = require("./OrderController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getOrders",
  commonValidator.validateJWTToken,
  OrderController.getOrders
);

router.get(
  "/getOrdersById/:id",
  commonValidator.validateJWTToken,
  OrderController.getOrdersById
);

router.post(
  "/createOrderFromCart",
  commonValidator.validateJWTToken,
  OrderController.createOrderFromCart
);

router.post(
  "/createOrder",
  commonValidator.validateJWTToken,
  OrderController.createOrder
);
router.put(
  "/cancelOrderById/:id",
  commonValidator.validateJWTToken,
  OrderController.cancelOrderById
);

module.exports = router;