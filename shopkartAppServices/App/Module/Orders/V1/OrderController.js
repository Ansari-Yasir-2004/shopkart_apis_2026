const OrderService = require("./OrderService")
const logger = require("../../../Config/logger.config");
const OrderValidations = require("./OrderValidations")

/////////////--------------------------------//////////////////////////////
// Get Orders Controller
///////////////------------------------------//////////////////////////////
const getOrders = async (req, res, next) => {
  logger.info("get orders => list of user orders");
  try {
    const user_id = req.user.id;

    await OrderValidations.orderIdValidation.validateAsync(user_id);

    const pc = await OrderService.getOrders({ user_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Get Orders By Id Controller
///////////////------------------------------//////////////////////////////
const getOrdersById = async (req, res, next) => {
  logger.info("get order by id => list of order details");
  try {
    const user_id = req.user.id;
    const order_id = req.params.id;

    await OrderValidations.orderIdValidation.validateAsync(user_id);
    await OrderValidations.orderIdValidation.validateAsync(order_id);

    const pc = await OrderService.getOrdersById({ user_id, order_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Create Order From Cart Controller
///////////////------------------------------//////////////////////////////
const createOrderFromCart = async (req, res, next) => {
  logger.info("create order from cart => place order from cart")
  try {
    const user_id = req.user.id;
    const {user_address_id} = req.body;

    await OrderValidations.orderIdValidation.validateAsync(user_id);

    let validateData = await OrderValidations.createOrderFromCartValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const pc = await OrderService.createOrderFromCart({ user_id, user_address_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Create Order Controller
///////////////------------------------------//////////////////////////////
const createOrder = async (req, res, next) => {
  logger.info("create order => place order");
  try {
    const user_id = req.user.id;
    const { product_id, quantity, user_address_id } = req.body;

    await OrderValidations.orderIdValidation.validateAsync(user_id);

    let validateData = await OrderValidations.createOrderValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const pc = await OrderService.createOrder({ user_id, product_id, quantity, user_address_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Cancel Order By Id Controller
///////////////------------------------------//////////////////////////////
const cancelOrderById = async (req, res, next) => {
  logger.info("cancel order by id => cancel order");
  try {
    const user_id = req.user.id;
    const order_id = req.params.id;

    await OrderValidations.orderIdValidation.validateAsync(user_id);
    await OrderValidations.orderIdValidation.validateAsync(order_id);

    const pc = await OrderService.cancelOrderById({ user_id, order_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

module.exports = {
  getOrders,
  getOrdersById,
  createOrderFromCart,
  createOrder,
  cancelOrderById,
}