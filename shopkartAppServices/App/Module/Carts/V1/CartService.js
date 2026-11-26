const pool = require("../../../Config/db.polloingConnection");
const { CartsMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get Cart Service
///////////////------------------------------//////////////////////////////
const getCart = async ({ user_id }) => {
	let result = {
		status: 0,
		message: "",
		data: ""
	};
	const conn = await pool.getConnection();

	try {
		let cartQuery = `SELECT id FROM carts WHERE user_id=?`;
		let [cartRes] = await conn.execute(cartQuery, [user_id]);

		if (cartRes.length === 0) {
			result.message = CartsMessages.CART_IS_EMPTY;
			return result;
		}

		let cart_id = cartRes[0].id;

		let cartItemQuery = `
			SELECT 
				ci.id AS cart_item_id,
				ci.product_id,
				ci.quantity,
				p.name,
				p.slug,
				p.discount_price,
				p.out_of_stock
			FROM cart_items ci
			LEFT JOIN products p
				ON ci.product_id = p.id
			WHERE ci.cart_id=? AND p.deleted_at IS NULL
		`;
		let [cartItemRes] = await conn.execute(cartItemQuery, [cart_id]);

		let grand_total = 0;

		let formattedItems = cartItemRes.map((item) => {
			let total = item.quantity * item.discount_price;
			grand_total += total;

			return {
				cart_item_id: item.cart_item_id,
				product_id: item.product_id,
				url: item.url,
				name: item.name,
				slug: item.slug,
				price: item.discount_price,
				quantity: item.quantity,
				total: total,
				out_of_stock: item.out_of_stock,
			}
		});

		result.status = 1;
		result.message = CartsMessages.CART_FETCH_SUCCESS;
		result.data = {
			cart_id: cart_id,
			item: formattedItems,
			grand_total: grand_total,
		}
	} catch (error) {
		result.message = error;
		console.log(error);
	} finally {
		conn.release();
	}
	return result;
}

/////////////--------------------------------//////////////////////////////
// Add To Cart Service
///////////////------------------------------//////////////////////////////
const addToCart = async ({ user_id, product_id, quantity }) => {
	let result = {
		status: 0,
		message: "",
		data: ""
	};
	const conn = await pool.getConnection();

	try {
		await conn.beginTransaction();

		let currentTime = utils.commonFormateDate(new Date());

		// Check Product Exist
		let productQuery = `SELECT * FROM products WHERE id=? AND deleted_at IS NULL`
		let [productRes] = await conn.query(productQuery, [product_id]);
		console.log("inside productRes =>", productRes);

		if (productRes.length === 0) {
			result.message = CartsMessages.PRODUCT_NOT_FOUND;
			return result;
		}

		let product = productRes[0];

		if (product.out_of_stock === 1) {
			result.message = CartsMessages.PRODUCT_OUT_OF_STOCK;
			return result;
		}

		// Check Cart Exist
		let cartQuery = `SELECT * FROM carts WHERE user_id=?`;
		let [cartRes] = await conn.execute(cartQuery, [user_id]);
		console.log("inside cartRes =>", cartRes);

		let cart_id;

		if (cartRes.length > 0) {
			cart_id = cartRes[0].id;
		} else {
			// Create	Cart
			let newCartQuery = `INSERT INTO carts (user_id, created_at, updated_at) VALUES (?, ?, ?)`;
			let [newCartRes] = await conn.execute(newCartQuery, [user_id, currentTime, currentTime]);
			console.log("inside newCartRes =>", newCartRes);

			cart_id = newCartRes.insertId;
		}

		// Check Product Exist Or Not In Cart
		let cartItemQuery = `SELECT * FROM cart_items WHERE cart_id=? AND product_id=?`;
		let [cartItemRes] = await conn.execute(cartItemQuery, [cart_id, product_id]);
		console.log("inside cartItemRes =>", cartItemRes);

		if (cartItemRes.length > 0) {
			// Update Quantity
			let newQty = cartItemRes[0].quantity + quantity;
			console.log(newQty);

			const [newQtyRes] = await conn.execute(
				`
          UPDATE cart_items 
          SET quantity=?, updated_at=? 
          WHERE id=?
        `, [newQty, currentTime, cartItemRes[0].id]
			);
			console.log("inside newQtyRes =>", newQtyRes);

			if (newQtyRes && newQtyRes.affectedRows) {
				await conn.commit();

				result.status = 1;
				result.message = CartsMessages.PRODUCT_QUANTITY_INCREASED;
				result.data = { product_id }
			} else if (newQtyRes.affectedRows === 0) {
				result.message = CartsMessages.CART_ITEM_NOT_FOUND;
			} else {
				result.message = "Something went wrong"
			}

		} else {
			// Insert New Item
			await conn.execute(
				`
					INSERT INTO cart_items
						(
							cart_id, 
							product_id, 
							quantity, 
							created_at, 
							updated_at
						)
					VALUES (?, ?, ?, ?, ?)
				`, [cart_id, product_id, quantity, currentTime, currentTime]
			);

			await conn.commit();

			result.status = 1;
			result.message = CartsMessages.PRODUCT_ADDED_TO_CART;
			result.data = { product_id }
		}

	} catch (error) {
		await conn.rollback();
		result.message = error;
		console.log(error);
	} finally {
		conn.release();
	}
	return result;
}

/////////////--------------------------------//////////////////////////////
// Update Cart Service
///////////////------------------------------//////////////////////////////
const updateCart = async ({ user_id, product_id, quantity }) => {
	let result = {
		status: 0,
		message: "",
		data: ""
	};
	const conn = await pool.getConnection();

	try {
		let currentTime = utils.commonFormateDate(new Date());

		let cartQuery = `SELECT id FROM carts WHERE user_id=?`
		let [cartRes] = await conn.execute(cartQuery, [user_id]);
		console.log("inside cartRes", cartRes);

		if (cartRes.length === 0) {
			result.message = CartsMessages.CART_NOT_FOUND;
			return result;
		}

		let cart_id = cartRes[0].id;

		let cartItemQuery = `SELECT * FROM cart_items WHERE cart_id=? AND product_id=?`;
		let [cartItemRes] = await conn.execute(cartItemQuery, [cart_id, product_id]);
		console.log("inside cartItemRes", cartItemRes);

		if (cartItemRes.length === 0) {
			result.message = CartsMessages.PRODUCT_NOT_FOUND;
			return result;
		}

		await conn.execute(
			`
				UPDATE cart_items
				SET quantity=?, updated_at=?
				WHERE id=?
			`, [quantity, currentTime, cartItemRes[0].id]
		);

		result.status = 1;
		result.message = CartsMessages.CART_UPDATED_SUCCESS;
		result.data = { product_id };
	} catch (error) {
		result.message = error;
		console.log(error);
	} finally {
		conn.release();
	}
	return result;
}

/////////////--------------------------------//////////////////////////////
// Remove Item From Cart Service
///////////////------------------------------//////////////////////////////
const removeItemFromCart = async ({ user_id, product_id }) => {
	let result = {
		status: 0,
		message: "",
		data: ""
	};
	const conn = await pool.getConnection();
	console.log(user_id, product_id);

	try {
		let cartQuery = `SELECT id FROM carts Where user_id=?`;
		let [cartRes] = await conn.execute(cartQuery, [user_id]);

		if (cartRes.length === 0) {
			result.message = CartsMessages.CART_NOT_FOUND;
			return result;
		}

		let cart_id = cartRes[0].id;

		let cartItemQuery = `SELECT * FROM cart_items WHERE cart_id=? AND product_id=?`;
		let [cartItemRes] = await conn.execute(cartItemQuery, [cart_id, product_id]);
		console.log("inside cartItemRes", cartItemRes);

		if (cartItemRes.length === 0) {
			result.message = CartsMessages.PRODUCT_NOT_FOUND;
			return result;
		}

		await conn.execute(`DELETE FROM cart_items WHERE id=?`, [cartItemRes[0].id]);

		result.status = 1;
		result.message = CartsMessages.REMOVE_ITEM_FROM_CART;
		result.data = { product_id }
	} catch (error) {
		result.message = error;
		console.log(error);
	} finally {
		conn.release();
	}
	return result;
}

/////////////--------------------------------//////////////////////////////
// Clear Cart Service
///////////////------------------------------//////////////////////////////
const clearCart = async ({ user_id }) => {
	let result = {
		status: 0,
		message: "",
		data: ""
	};
	const conn = await pool.getConnection();

	try {
		await conn.beginTransaction();

		let cartQuery = `SELECT id FROM carts WHERE user_id=?`;
		let [cartRes] = await conn.execute(cartQuery, [user_id]);
		console.log("inside cartRes", cartRes);

		if (cartRes.length === 0) {
			result.message = CartsMessages.CART_NOT_FOUND;
			return result;
		}

		let cart_id = cartRes[0].id;

		let deleteItemQuery = `DELETE FROM cart_items WHERE cart_id=?`
		let [deleteItemRes] = await conn.execute(deleteItemQuery, [cart_id]);
		console.log("inside deleteItemRes", deleteItemRes);

		if (deleteItemRes && deleteItemRes.affectedRows) {
			result.status = 1;
			result.message = CartsMessages.CLEAR_CART;
			result.data = { cart_id };
		} else if (deleteItemRes.affectedRows === 0) {
			result.message = CartsMessages.CART_ITEM_NOT_FOUND;
		} else {
			result.message = "Something went wrong";
		}

		await conn.commit();

	} catch (error) {
		await conn.rollback();
		result.message = error;
		console.log(error);
	} finally {
		conn.release();
	}
	return result;
}

module.exports = {
	getCart,
	addToCart,
	updateCart,
	removeItemFromCart,
	clearCart,
}