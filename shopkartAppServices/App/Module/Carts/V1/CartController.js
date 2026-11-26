const CartService = require("./CartService");
const logger = require("../../../Config/logger.config");
const CartValidations = require("./CartValidations");

/////////////--------------------------------//////////////////////////////
// Get Cart Controller
///////////////------------------------------//////////////////////////////
const getCart = async (req, res, next) => {
	logger.info("get cart => cart details")
	try {
		const user_id = req.user.id;

		await CartValidations.idValidate.validateAsync(user_id);

		const pc = await CartService.getCart({ user_id });
		res.status(200).json(pc);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Invalid Url Parameter" });
		next(error);
	}
}

/////////////--------------------------------//////////////////////////////
// Add To Cart Controller
///////////////------------------------------//////////////////////////////
const addToCart = async (req, res, next) => {
	logger.info("add to cart controller, product added to cart")
	try {
		const user_id = req.user.id;
		const { product_id, quantity } = req.body;

		await CartValidations.idValidate.validateAsync(user_id);
		const validateData = await CartValidations.addToCartValidation.validate(req.body);
		if (validateData && validateData.error) {
			return res.status(422).json({ error: validateData.error.message });
		}

		const pc = await CartService.addToCart({ user_id, product_id, quantity });
		res.status(200).json(pc);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Invalid Url Parameter" });
		next(error);
	}
}

/////////////--------------------------------//////////////////////////////
// Update Cart Controller
///////////////------------------------------//////////////////////////////
const updateCart = async (req, res, next) => {
	logger.info("update cart by user id => updart cart")
	try {
		const user_id = req.user.id;
		const { product_id, quantity } = req.body;

		await CartValidations.idValidate.validateAsync(user_id);
		const validateData = await CartValidations.updateCartValidation.validate(req.body);
		if (validateData && validateData.error) {
			return res.status(422).json({ error: validateData.error.message });
		}

		const pc = await CartService.updateCart({ user_id, product_id, quantity });
		res.status(200).json(pc)
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Invalid Url Parameter" });
		next(error);
	}
}

/////////////--------------------------------//////////////////////////////
// Remove Item From Cart Controller
///////////////------------------------------//////////////////////////////
const removeItemFromCart = async (req, res, next) => {
	logger.info("remove item from cart => item removed")
	try {
		const user_id = req.user.id;
		const product_id = req.params.product_id;

		await CartValidations.idValidate.validateAsync(user_id);
		await CartValidations.idValidate.validateAsync(product_id);

		const pc = await CartService.removeItemFromCart({ user_id, product_id });
		res.status(200).json(pc);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Invalid Url Parameter" });
		next(error);
	}
}

/////////////--------------------------------//////////////////////////////
// Clear Cart Controller
///////////////------------------------------//////////////////////////////
const clearCart = async (req, res, next) => {
	logger.info("clear cart => clear cart")
	try {
		const user_id = req.user.id;

		await CartValidations.idValidate.validateAsync(user_id);

		const pc = await CartService.clearCart({ user_id });
		res.status(200).json(pc);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Invalid Url Parameter" });
		next(error);
	}
}

module.exports = {
	getCart,
	addToCart,
	updateCart,
	removeItemFromCart,
	clearCart,
}