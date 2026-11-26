const pool = require("../../../Config/db.polloingConnection");
const { OrdersMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get Orders Service
///////////////------------------------------//////////////////////////////
// const getOrders = async ({ user_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     let query = `
//       SELECT 
//         o.id,
//         o.status,
//         o.delivery_date,
//         o.created_at,
//         oi.total_amount
//       FROM orders o
//       LEFT JOIN order_invoices oi ON oi.order_id = o.id
//       WHERE o.user_id = ?
//       ORDER BY o.id DESC
//     `;

//     let [res] = await conn.query(query, [user_id]);

//     if (res.length) {
//       result.status = 1;
//       result.message = OrdersMessages.ORDER_FETCH_SUCCESS;
//       result.data = res;
//     } else {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//     }
//   } catch (error) {
//     result.message = error;
//   } finally {
//     conn.release();
//   }

//   return result;
// };


const getOrders = async ({ user_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        o.id,
        o.status,
        o.delivery_date,
        o.created_at,
        oi.total_amount
      FROM orders o
      LEFT JOIN order_invoices oi ON oi.order_id = o.id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
    `;

    let [res] = await conn.query(query, [user_id]);

    if (res.length) {

      /////////////////////
      // 🔥 FORMAT DATA
      /////////////////////
      const formattedData = res.map((order) => ({
        ...order,
        total_amount: order.total_amount
          ? Number(order.total_amount)
          : 0,
        created_at: order.created_at
          ? utils.commonFormateDate(order.created_at)
          : null,
        delivery_date: order.delivery_date
          ? utils.commonFormateDate(order.delivery_date)
          : null,
      }));

      result.status = 1;
      result.message = OrdersMessages.ORDER_FETCH_SUCCESS;
      result.data = formattedData;

    } else {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
    }

  } catch (error) {
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Orders By Id Service
///////////////------------------------------//////////////////////////////
// const getOrdersById = async ({ user_id, order_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     let orderQuery = `
//       SELECT
//         o.*,
//         ua.address,
//         ua.city,
//         ua.state,
//         ua.country
//       FROM orders o
//       LEFT JOIN user_addresses ua ON ua.id = o.user_address_id
//       WHERE o.id = ? AND o.user_id = ?
//     `;
//     let [orderRes] = await conn.execute(orderQuery, [order_id, user_id]);
//     console.log("inside orderQuery", orderQuery);

//     if (orderRes.length === 0) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }

//     let orderItemQuery = `SELECT * FROM order_items WHERE order_id=?`;
//     let [orderItemRes] = await conn.execute(orderItemQuery, [order_id]);
//     console.log("inside orderItemQuery", orderItemQuery);

//     if (orderItemRes && orderItemRes.length > 0) {
//       const formattedOrderItem = orderItemRes.map((item) => ({
//         ...item,
//         created_at: item.created_at
//           ? utils.commonFormateDate(item.created_at)
//           : null,
//         updated_at: item.updated_at
//           ? utils.commonFormateDate(item.updated_at)
//           : null,
//       }));
//       /////////////////////
//       // 3. INVOICE
//       /////////////////////
//       let [invoiceRes] = await conn.execute(
//         `SELECT * FROM order_invoices WHERE order_id=?`,
//         [order_id],
//       );

//       /////////////////////
//       // 4. TIMELINE
//       /////////////////////
//       let [timingRes] = await conn.execute(
//         `SELECT status, created_at FROM order_timings WHERE order_id=? ORDER BY id ASC`,
//         [order_id],
//       );

//       result.status = 1;
//       result.message = OrdersMessages.ORDER_DETAIL_SUCCESS;
//       result.data = {
//         order: orderData,
//         items: formattedOrderItem,
//         invoice: invoiceRes[0] || null,
//         timeline: timingRes,
//       };
//     }
//   } catch (error) {
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }
//   return result;
// };

// const getOrdersById = async ({ user_id, order_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };

//   const conn = await pool.getConnection();

//   try {
//     /////////////////////
//     // ORDER
//     /////////////////////
//     let [orderRes] = await conn.execute(
//       `SELECT
//         o.*,
//         ua.address,
//         ua.city,
//         ua.state,
//         ua.country
//       FROM orders o
//       LEFT JOIN user_addresses ua ON ua.id = o.user_address_id
//       WHERE o.id = ? AND o.user_id = ?`,
//       [order_id, user_id],
//     );

//     if (!orderRes.length) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }

//     let orderData = orderRes[0];

//     /////////////////////
//     // ITEMS
//     /////////////////////
//     let [orderItemRes] = await conn.execute(
//       `SELECT * FROM order_items WHERE order_id=?`,
//       [order_id],
//     );

//     /////////////////////
//     // INVOICE
//     /////////////////////
//     let [invoiceRes] = await conn.execute(
//       `SELECT * FROM order_invoices WHERE order_id=?`,
//       [order_id],
//     );

//     /////////////////////
//     // TIMELINE
//     /////////////////////
//     let [timingRes] = await conn.execute(
//       `SELECT status, created_at FROM order_timings WHERE order_id=? ORDER BY id ASC`,
//       [order_id],
//     );

//     /////////////////////
//     // FINAL RESPONSE
//     /////////////////////
//     result.status = 1;
//     result.message = OrdersMessages.ORDER_DETAIL_SUCCESS;
//     result.data = {
//       order: orderData,
//       items: orderItemRes,
//       invoice: invoiceRes[0] || null,
//       timeline: timingRes,
//     };
//   } catch (error) {
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }

//   return result;
// };


const getOrdersById = async ({ user_id, order_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    /////////////////////
    // ORDER
    /////////////////////
    let [orderRes] = await conn.execute(
      `SELECT 
        o.*,
        ua.address,
        ua.city,
        ua.state,
        ua.country
      FROM orders o
      LEFT JOIN user_addresses ua ON ua.id = o.user_address_id
      WHERE o.id = ? AND o.user_id = ?`,
      [order_id, user_id],
    );

    if (!orderRes.length) {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
      return result;
    }

    let orderData = orderRes[0];

    /////////////////////
    // ITEMS
    /////////////////////
    let [orderItemRes] = await conn.execute(
      `SELECT * FROM order_items WHERE order_id=?`,
      [order_id],
    );

    // orderData.items = orderItemRes;

    /////////////////////
    // INVOICE
    /////////////////////
    let [invoiceRes] = await conn.execute(
      `SELECT * FROM order_invoices WHERE order_id=?`,
      [order_id],
    );

    /////////////////////
    // TIMELINE
    /////////////////////
    let [timingRes] = await conn.execute(
      `SELECT status, created_at FROM order_timings WHERE order_id=? ORDER BY id ASC`,
      [order_id],
    );

    /////////////////////
    // 🔥 FORMAT SECTION
    /////////////////////

    // ORDER FORMAT
    const formattedOrder = {
      ...orderData,
      created_at: orderData.created_at
        ? utils.commonFormateDate(orderData.created_at)
        : null,
      updated_at: orderData.updated_at
        ? utils.commonFormateDate(orderData.updated_at)
        : null,
      delivery_date: orderData.delivery_date
        ? utils.commonFormateDate(orderData.delivery_date)
        : null,
    };

    // ITEMS FORMAT
    const formattedItems = orderItemRes.map((item) => ({
      ...item,
      discount_price: Number(item.discount_price),
      original_price: Number(item.original_price),
      total_price: Number(item.total_price),
      created_at: item.created_at
        ? utils.commonFormateDate(item.created_at)
        : null,
      updated_at: item.updated_at
        ? utils.commonFormateDate(item.updated_at)
        : null,
    }));

    // INVOICE FORMAT
    const formattedInvoice = invoiceRes[0]
      ? {
          ...invoiceRes[0],
          sub_total: Number(invoiceRes[0].sub_total),
          discount_amount: Number(invoiceRes[0].discount_amount),
          tax_amount: Number(invoiceRes[0].tax_amount),
          delivery_charge: Number(invoiceRes[0].delivery_charge),
          total_amount: Number(invoiceRes[0].total_amount),
          created_at: invoiceRes[0].created_at
            ? utils.commonFormateDate(invoiceRes[0].created_at)
            : null,
          updated_at: invoiceRes[0].updated_at
            ? utils.commonFormateDate(invoiceRes[0].updated_at)
            : null,
        }
      : null;

    // TIMELINE FORMAT
    const formattedTimeline = timingRes.map((item) => ({
      ...item,
      created_at: item.created_at
        ? utils.commonFormateDate(item.created_at)
        : null,
    }));

    /////////////////////
    // FINAL RESPONSE
    /////////////////////
    result.status = 1;
    result.message = OrdersMessages.ORDER_DETAIL_SUCCESS;
    result.data = {
      ...formattedOrder,
      items: formattedItems,
      invoice: formattedInvoice,
      timeline: formattedTimeline,
    };
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Create Order From Cart Service
///////////////------------------------------//////////////////////////////
// const createOrderFromCart = async ({ user_id, address }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     let currentTime = utils.commonFormateDate(new Date());

//     // Find Cart
//     let cartQuery = `SELECT * FROM carts where user_id=?`;
//     let [cartRes] = await conn.execute(cartQuery, [user_id]);
//     console.log("inside cartQuery", cartRes);

//     if (cartRes.length === 0) {
//       result.message = OrdersMessages.CART_EMPTY;
//       return result;
//     }

//     let cart_id = cartRes[0].id;

//     // Find cart items
//     let cartItemsQuery = `
//       SELECT
//         ci.*,
//         p.name,
//         p.original_price,
//         p.discount_price,
//         p.out_of_stock
//       FROM cart_items ci
//       JOIN products p
//         ON ci.product_id = p.id
//       WHERE ci.cart_id=? AND p.deleted_at IS NULL
//     `;
//     let [cartItemsRes] = await conn.execute(cartItemsQuery, [cart_id]);
//     console.log("inside cartItemsQuery", cartItemsRes);

//     if (cartItemsRes.length === 0) {
//       result.message = OrdersMessages.CART_EMPTY;
//       return result;
//     }

//     let total = 0;

//     // Check product stock & calculate total
//     for (let cartItem of cartItemsRes) {
//       if (cartItem.out_of_stock === 1) {
//         result.message = OrdersMessages.PRODUCT_OUT_OF_STOCK;
//         return result;
//       }

//       total += cartItem.quantity * cartItem.discount_price;
//     }

//     // Create Order
//     let orderQuery = `
//       INSERT INTO orders
//         (
//           user_id,
//           user_address_id,
//           status,
//           created_at,
//           updated_at
//         )
//       VALUES (?, ?, 'PENDING', ?, ?, ?)
//     `;
//     let [orderRes] = await conn.execute(orderQuery, [
//       user_id,
//       user_address_id,
//       currentTime,
//       currentTime,
//     ]);
//     console.log("inside orderQuery", orderRes);

//     let order_id = orderRes.insertId;

//     // Insert order items
//     for (let cartItem of cartItemsRes) {
//       let orderItemsQuery = `
//       INSERT INTO order_items
//         (
//           order_id,
//           product_id,
//           name,
//           original_price,
//           discount_price,
//           quantity,
//           created_at
//         )
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//       let [orderItemsRes] = await conn.execute(orderItemsQuery, [
//         order_id,
//         cartItem.product_id,
//         cartItem.name,
//         cartItem.original_price,
//         cartItem.discount_price,
//         cartItem.quantity,
//         currentTime,
//       ]);
//       console.log("inside orderItemsQuery", orderItemsRes);
//     }

//     // Clear cart
//     await conn.execute(`DELETE FROM cart_items WHERE cart_id=?`, [cart_id]);

//     await conn.commit();

//     result.status = 1;
//     result.message = OrdersMessages.ORDER_CREATED_SUCCESS;
//     result.data = { order_id };
//   } catch (error) {
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }
//   return result;
// };

const createOrderFromCart = async ({ user_id, user_address_id }) => {
  let result = { status: 0, message: "", data: "" };

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const currentTime = new Date();

    /////////////////////
    // CART
    /////////////////////
    let [cartRes] = await conn.execute(
      `SELECT id FROM carts WHERE user_id=?`,
      [user_id]
    );

    if (!cartRes.length) {
      result.message = OrdersMessages.CART_EMPTY;
      return result;
    }

    let cart_id = cartRes[0].id;

    /////////////////////
    // CART ITEMS
    /////////////////////
    let [cartItemsRes] = await conn.execute(
      `SELECT 
        ci.*,
        p.name,
        p.discount_price,
        p.original_price,
        p.url,
        p.out_of_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id=?`,
      [cart_id]
    );

    if (!cartItemsRes.length) {
      result.message = OrdersMessages.CART_EMPTY;
      return result;
    }

    let subTotal = 0;
    let discount = 0;

    for (let item of cartItemsRes) {
      if (item.out_of_stock === 1) {
        result.message = OrdersMessages.PRODUCT_OUT_OF_STOCK;
        return result;
      }

      subTotal += item.quantity * item.discount_price;

      discount +=
        item.quantity * (item.original_price - item.discount_price);
    }

    let tax = 0;
    let delivery = 50;
    let total = subTotal + tax + delivery;

    /////////////////////
    // ORDER
    /////////////////////
    let [orderRes] = await conn.execute(
      `INSERT INTO orders 
      (user_id, user_address_id, status, created_at, updated_at)
      VALUES (?, ?, 'ORDERED', ?, ?)`,
      [user_id, user_address_id, currentTime, currentTime]
    );

    let order_id = orderRes.insertId;

    /////////////////////
    // ORDER ITEMS
    /////////////////////
    for (let item of cartItemsRes) {
      await conn.execute(
        `INSERT INTO order_items
        (order_id, product_id, name, url, discount_price, original_price, quantity, total_price, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order_id,
          item.product_id,
          item.name,
          item.url,
          item.discount_price,
          item.original_price,
          item.quantity,
          item.quantity * item.discount_price,
          currentTime,
          currentTime,
        ]
      );
    }

    /////////////////////
    // INVOICE
    /////////////////////
    await conn.execute(
      `INSERT INTO order_invoices
      (order_id, sub_total, discount_amount, tax_amount, delivery_charge, total_amount, payment_method, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        subTotal,
        discount,
        tax,
        delivery,
        total,
        "COD",
        "PENDING",
        currentTime,
        currentTime,
      ]
    );

    /////////////////////
    // TIMELINE
    /////////////////////
    await conn.execute(
      `INSERT INTO order_timings
      (order_id, status, created_at, updated_at)
      VALUES (?, 'ORDERED', ?, ?)`,
      [order_id, currentTime, currentTime]
    );

    /////////////////////
    // CLEAR CART
    /////////////////////
    await conn.execute(`DELETE FROM cart_items WHERE cart_id=?`, [cart_id]);

    await conn.commit();

    result.status = 1;
    result.message = OrdersMessages.ORDER_CREATED_SUCCESS;
    result.data = { order_id };

  } catch (error) {
    await conn.rollback();
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Create Order Service
///////////////------------------------------//////////////////////////////
// const createOrder = async ({ user_id, product_id, quantity, user_address_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     let currentTime = utils.commonFormateDate(new Date());

//     // Find & check product
//     let productQuery = `SELECT * FROM products WHERE id=? AND deleted_at IS NULL`;
//     let [productRes] = await conn.execute(productQuery, [product_id]);
//     console.log("inside productQuery", productRes);

//     if (productRes.length === 0) {
//       result.message = OrdersMessages.PRODUCT_NOT_FOUND;
//       return result;
//     }

//     let product = productRes[0];

//     if (product.out_of_stock === 1) {
//       result.message = OrdersMessages.PRODUCT_OUT_OF_STOCK;
//       return result;
//     }

//     // Calculate total
//     let total = quantity * product.discount_price;

//     // Create order
//     let orderQuery = `
//       INSERT INTO orders
//         (
//           user_id,
//           status,
//           user_address_id,
//           created_at,
//           updated_at
//         )
//       VALUES (?, 'PENDING, ?, ?, ?)
//     `;
//     let [orderRes] = await conn.execute(orderQuery, [
//       user_id,
//       total,
//       user_address_id,
//       currentTime,
//       currentTime,
//     ]);
//     console.log("inside orderQuery", orderRes);

//     let order_id = orderRes.insertId;

//     // Insert order items
//     let orderItemQuery = `
//       INSERT INTO order_items
//         (
//           order_id,
//           product_id,
//           name,
//           original_price,
//           discount_price,
//           quantity,
//           created_at
//         )
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//     let [orderItemRes] = await conn.execute(orderItemQuery, [
//       order_id,
//       product.id,
//       product.name,
//       product.original_price,
//       product.discount_price,
//       quantity,
//       currentTime,
//     ]);
//     console.log("inside orderItemQuery", orderItemRes);

//     await conn.commit();

//     result.status = 1;
//     result.message = OrdersMessages.ORDER_CREATED_SUCCESS;
//     result.data = { order_id };
//   } catch (error) {
//     await conn.rollback();
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }
//   return result;
// };

const createOrder = async ({
  user_id,
  product_id,
  quantity,
  user_address_id,
}) => {
  let result = { status: 0, message: "", data: "" };

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const currentTime = new Date();

    /////////////////////
    // PRODUCT
    /////////////////////
    let [productRes] = await conn.execute(
      `SELECT * FROM products WHERE id=? AND deleted_at IS NULL`,
      [product_id]
    );

    if (!productRes.length) {
      result.message = OrdersMessages.PRODUCT_NOT_FOUND;
      return result;
    }

    let product = productRes[0];

    if (product.out_of_stock === 1) {
      result.message = OrdersMessages.PRODUCT_OUT_OF_STOCK;
      return result;
    }

    /////////////////////
    // CALCULATION
    /////////////////////
    let subTotal = quantity * product.discount_price;

    let discount =
      quantity * (product.original_price - product.discount_price);

    let tax = 0;
    let delivery = 50;

    let total = subTotal + tax + delivery;

    /////////////////////
    // ORDER
    /////////////////////
    let [orderRes] = await conn.execute(
      `INSERT INTO orders
      (user_id, user_address_id, status, created_at, updated_at)
      VALUES (?, ?, 'ORDERED', ?, ?)`,
      [user_id, user_address_id, currentTime, currentTime]
    );

    let order_id = orderRes.insertId;

    /////////////////////
    // ORDER ITEM
    /////////////////////
    await conn.execute(
      `INSERT INTO order_items
      (order_id, product_id, name, url, original_price, discount_price, quantity, total_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        product.id,
        product.name,
        product.url,
        product.original_price,
        product.discount_price,
        quantity,
        subTotal,
        currentTime,
        currentTime,
      ]
    );

    /////////////////////
    // INVOICE
    /////////////////////
    await conn.execute(
      `INSERT INTO order_invoices
      (order_id, sub_total, discount_amount, tax_amount, delivery_charge, total_amount, payment_method, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        subTotal,
        discount,
        tax,
        delivery,
        total,
        "COD",
        "PENDING",
        currentTime,
        currentTime,
      ]
    );

    /////////////////////
    // TIMELINE
    /////////////////////
    await conn.execute(
      `INSERT INTO order_timings
      (order_id, status, created_at, updated_at)
      VALUES (?, 'ORDERED', ?, ?)`,
      [order_id, currentTime, currentTime]
    );

    await conn.commit();

    result.status = 1;
    result.message = OrdersMessages.ORDER_CREATED_SUCCESS;
    result.data = { order_id };

  } catch (error) {
    await conn.rollback();
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Cancel Order By Id Service
///////////////------------------------------//////////////////////////////
// const cancelOrderById = async ({ user_id, order_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     let currentTime = utils.commonFormateDate(new Date());

//     let orderQuery = `SELECT * FROM orders WHERE id=? AND user_id=?`;
//     let [orderRes] = await conn.execute(orderQuery, [order_id, user_id]);
//     console.log("inside orderQuery", orderRes);

//     if (orderRes.length === 0) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }

//     if (orderRes[0].status === "CANCELLED") {
//       result.message = OrdersMessages.ORDER_ALREADY_CANCELLED;
//       return result;
//     }

//     await pool.query(`UPDATE orders SET status='CANCELLED' WHERE id=?`, [
//       order_id,
//     ]);

//     result.status = 1;
//     result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
//     result.data = { order_id };
//   } catch (error) {
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }
//   return result;
// };

const cancelOrderById = async ({ user_id, order_id }) => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    let currentTime = utils.commonFormateDate(new Date());

    let [orderRes] = await conn.execute(
      `SELECT * FROM orders WHERE id=? AND user_id=?`,
      [order_id, user_id],
    );

    if (!orderRes.length) {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
      return result;
    }

    if (orderRes[0].status === "CANCELLED") {
      result.message = OrdersMessages.ORDER_ALREADY_CANCELLED;
      return result;
    }

    await conn.execute(
      `UPDATE orders SET status='CANCELLED', updated_at=? WHERE id=?`,
      [currentTime, order_id],
    );

    // 🔥 add timing
    await conn.execute(
      `INSERT INTO order_timings (order_id, status, created_at, updated_at)
       VALUES (?, 'CANCELLED', ?, ?)`,
      [order_id, currentTime, currentTime],
    );

    await conn.commit();

    result.status = 1;
    result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
    result.data = { order_id };
  } catch (error) {
    await conn.rollback();
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

module.exports = {
  getOrders,
  getOrdersById,
  createOrderFromCart,
  createOrder,
  cancelOrderById,
};
