const logger = require("../../../Config/logger.config");
const OrderService = require("./OrderService");
const OrderValidations = require("./OrderValidations");

/////////////--------------------------------//////////////////////////////
// Get All Orders Controller
///////////////------------------------------//////////////////////////////
getAllOrders = async (req, res, next) => {
  logger.info("get orders => all orders list");
  try {
    const filters = req.query;

    // const hasFilter = Object.values(filters).some(
    //   (val) => val !== undefined && val !== null && val !== "" && val !== "null"
    // );

    // if (!hasFilter) {
    //   return res.status(400).json({
    //     status: 0,
    //     message: "Please select a status"
    //   });
    // }

    const result = await OrderService.getAllOrders({ filters });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get All Orders Controller
///////////////------------------------------//////////////////////////////
getOrderDetailsById = async (req, res, next) => {
  logger.info("Get Orders Detail By Id");
  try {
    const order_id = req.params.id;

    await OrderValidations.idValidate.validateAsync(order_id);

    const pc = await OrderService.getOrderDetailsById({ order_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Order Status By Id Controller
///////////////------------------------------//////////////////////////////


getOrderStatusById = async (req, res, next) => {
  try {
    const order_id = req.params.id;

    await OrderValidations.idValidate.validateAsync(order_id);

    const result = await OrderService.getOrderStatusById({ order_id });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Order Status Controller
///////////////------------------------------//////////////////////////////
updateOrderStatusById = async (req, res, next) => {
  logger.info("Update Order Status");
  try {
    const order_id = req.params.id;
    const { status } = req.body;

    await OrderValidations.idValidate.validateAsync(order_id);

    const validateData = await OrderValidations.statusValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const result = await OrderService.updateOrderStatusById({
      order_id,
      status,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Order Cancel Controller
///////////////------------------------------//////////////////////////////

cancelOrder = async (req, res, next) => {
  try {
    const order_id = req.params.id;

    await OrderValidations.idValidate.validateAsync(order_id);

    const result = await OrderService.cancelOrder({ order_id });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderDetailsById,
  getOrderStatusById,
  updateOrderStatusById,
  cancelOrder,
};
