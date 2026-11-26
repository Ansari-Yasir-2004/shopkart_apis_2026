const OrderController = require("./OrderController");
const express = require("express");
const router = express.Router();
const commonValidator = require("../../../Validator/commonValidator");

router.get(
  "/getAllOrders",
  commonValidator.validateJWTToken,
  OrderController.getAllOrders,
);

router.get(
  "/getOrderDetailById/:id",
  commonValidator.validateJWTToken,
  OrderController.getOrderDetailsById,
);

router.get(
  "/getOrderStatus/:id",
  commonValidator.validateJWTToken,
  OrderController.getOrderStatusById
);

router.put(
  "/updateOrderStatusById/:id",
  commonValidator.validateJWTToken,
  OrderController.updateOrderStatusById,
);

router.put(
  "/cancelOrder/:id",
  commonValidator.validateJWTToken,
  OrderController.cancelOrder,
);

module.exports = router;
