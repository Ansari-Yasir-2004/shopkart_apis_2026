const pool = require("../../../Config/db.polloingConnection");
const { OrdersMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All Orders Service
///////////////------------------------------//////////////////////////////
const getAllOrders = async ({ filters = {} }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  const isValid = (val) => {
    return val !== undefined && val !== null && val !== "null" && val !== "";
  }

  try {
    let ordersQuery = `
      SELECT 
        o.id,
        u.name AS customer_name,
        u.number AS mobile,
        ua.address AS address,
        oi.total_amount,
        oi.payment_status,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users u 
        ON o.user_id = u.id
      LEFT JOIN user_addresses ua 
        ON o.user_address_id = ua.id
      LEFT JOIN order_invoices oi 
        ON oi.order_id = o.id
      WHERE o.deleted_at IS NULL
    `
    let values = [];

    if (isValid(filters.status)) {
      ordersQuery += ` AND o.status=?`;
      values.push(filters.status);
    }

    if (isValid(filters.payment_status)) {
      ordersQuery += ` AND oi.payment_status=?`;
      values.push(filters.payment_status);
    }

    ordersQuery += ` ORDER BY o.id DESC`;

    let [ordersRes] = await conn.execute(ordersQuery, values);
    console.log('inside ordersRes', ordersRes);

    const formattedOrdersRes = ordersRes.map((order) => ({
      ...order,
      created_at: order.created_at
        ? utils.commonFormateDate(order.created_at)
        : null,
      updated_at: order.updated_at
        ? utils.commonFormateDate(order.updated_at)
        : null,
    }));

    result.status = 1;
    result.message = OrdersMessages.ORDER_FETCH_SUCCESS;
    result.data = formattedOrdersRes;
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }
  return result;
};

/////////////--------------------------------//////////////////////////////
// Get OrdersDetail By Id Service
///////////////------------------------------//////////////////////////////

// const getOrderDetailsById = async ({ order_id }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();
//   try {
//     let [order] = await conn.execute(`SELECT * FROM orders WHERE id=?`, [
//       order_id,
//     ]);
//     if (order.length === 0) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }
//     let [items] = await conn.execute(
//       `SELECT * FROM order_items WHERE order_id=?`,
//       [order_id],
//     );
//     result.status = 1;
//     result.message = OrdersMessages.ORDER_DETAIL_SUCCESS;
//     result.data = {
//       order: order[0],
//       items,
//     };
//   } catch (error) {
//     result.message = error;
//   } finally {
//     conn.release();
//   }
//   return result;
// };

const getOrderDetailsById = async ({ order_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    /////////////////////
    // ORDER + USER + ADDRESS 🔥
    /////////////////////
    let [orderRes] = await conn.execute(
      `SELECT 
        o.*,
        u.name as user_name,
        u.email,
        u.number,
        ua.address,
        ua.city,
        ua.state,
        ua.country
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN user_addresses ua ON ua.id = o.user_address_id
      WHERE o.id = ?`,
      [order_id],
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
    // 🔥 FORMAT SECTION (same tera)
    /////////////////////

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
      id: formattedOrder.id,
      status: formattedOrder.status,
      reason: formattedOrder.reason,
      delivery_date: formattedOrder.delivery_date,
      created_at: formattedOrder.created_at,
      updated_at: formattedOrder.updated_at,

      customer: {
        name: formattedOrder.user_name,
        email: formattedOrder.email,
        mobile: formattedOrder.number,
      },

      address: formattedOrder.address,

      items: formattedItems.map((item) => ({
        id: item.id,
        name: item.name,
        discount_price: item.discount_price,
        original_price: item.original_price,
        quantity: item.quantity,
        total: item.total_price,
      })),

      invoice: formattedInvoice
        ? {
          sub_total: formattedInvoice.sub_total,
          discount: formattedInvoice.discount_amount,
          tax: formattedInvoice.tax_amount,
          delivery: formattedInvoice.delivery_charge,
          total: formattedInvoice.total_amount,
          payment_method: formattedInvoice.payment_method,
          payment_status: formattedInvoice.payment_status,
        }
        : null,

      timeline: formattedTimeline.map((t) => ({
        status: t.status,
        created_at: t.created_at,
      })),
    };;
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};


/////////////--------------------------------//////////////////////////////
// Get Order Status By Id Service
///////////////------------------------------//////////////////////////////


const getOrderStatusById = async ({ order_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    /////////////////////
    // CHECK ORDER + CURRENT STATUS
    /////////////////////
    let [orderRes] = await conn.execute(
      `SELECT id, status FROM orders WHERE id=?`,
      [order_id]
    );

    if (!orderRes.length) {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
      return result;
    }

    /////////////////////
    // TIMELINE
    /////////////////////
    let [timelineRes] = await conn.execute(
      `SELECT status, created_at 
       FROM order_timings 
       WHERE order_id=? 
       ORDER BY id ASC`,
      [order_id]
    );

    /////////////////////
    // FORMAT TIMELINE
    /////////////////////
    const formattedTimeline = timelineRes.map((item) => ({
      ...item,
      created_at: item.created_at
        ? utils.commonFormateDate(item.created_at)
        : null,
    }));

    /////////////////////
    // FINAL RESPONSE
    /////////////////////
    result.status = 1;
    result.message = OrdersMessages.ORDER_STATUS_SUCCESS;
    result.data = {
      order_id: order_id,
      current_status: orderRes[0].status,
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
// Update Order Status Service
///////////////------------------------------//////////////////////////////
// const updateOrderStatusById = async ({ order_id, status }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();
//   try {
//     let [updateRes] = await conn.execute(
//       `UPDATE orders SET status=?, updated_at=NOW() WHERE id=?`,
//       [status, order_id],
//     );
//     if (updateRes.affectedRows === 0) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }
//     result.status = 1;
//     result.message = OrdersMessages.ORDER_STATUS_SUCCESS;
//     result.data = { order_id };
//   } catch (error) {
//     result.message = error;
//   } finally {
//     conn.release();
//   }
//   return result;
// };


const updateOrderStatusById = async ({ order_id, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    /////////////////////
    // 1. CHECK ORDER
    /////////////////////
    let [orderRes] = await conn.execute(
      `SELECT status FROM orders WHERE id=?`,
      [order_id]
    );

    if (!orderRes.length) {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
      return result;
    }

    const currentStatus = orderRes[0].status;

    /////////////////////
    // 2. SAME STATUS CHECK
    /////////////////////
    if (currentStatus === status) {
      result.message = `Order already in ${status}`;
      return result;
    }

    /////////////////////
    // 3. STATUS FLOW VALIDATION 
    /////////////////////
    const statusFlow = {
      PENDING: ["ORDERED", "CANCELLED"],
      ORDERED: ["ACCEPT", "CANCELLED"],
      ACCEPT: ["PROGRESS", "CANCELLED"],
      PROGRESS: ["COMPLETED"],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!statusFlow[currentStatus]?.includes(status)) {
      result.message = `Invalid status transition ${currentStatus} → ${status}`;
      return result;
    }

    /////////////////////
    // 4. UPDATE ORDER
    /////////////////////
    await conn.execute(
      `UPDATE orders 
       SET status=?, updated_at=NOW() 
       WHERE id=?`,
      [status, order_id]
    );

    /////////////////////
    // 5. INSERT TIMELINE 
    /////////////////////
    await conn.execute(
      `INSERT INTO order_timings (order_id, status, created_at) 
       VALUES (?, ?, NOW())`,
      [order_id, status]
    );

    /////////////////////
    // 6. OPTIONAL DELIVERY DATE
    /////////////////////
    if (status === "COMPLETED") {
      await conn.execute(
        `UPDATE orders SET delivery_date=NOW() WHERE id=?`,
        [order_id]
      );
    }

    /////////////////////
    // FINAL RESPONSE
    /////////////////////
    result.status = 1;
    result.message = OrdersMessages.ORDER_STATUS_SUCCESS;
    result.data = {
      order_id,
      previous_status: currentStatus,
      current_status: status,
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
// Update Order Cancel Service
///////////////------------------------------//////////////////////////////

// const cancelOrder = async ({ order_id }) => {
//   let result = { status: 0, message: "", data: "" };
//   const conn = await pool.getConnection();

//   try {
//     let [order] = await conn.execute(`SELECT status FROM orders WHERE id=?`, [
//       order_id,
//     ]);

//     if (order.length === 0) {
//       result.message = OrdersMessages.ORDER_NOT_FOUND;
//       return result;
//     }

//     //  Already cancelled check
//     if (order[0].status === "CANCELLED") {
//       result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
//       return result;
//     }

//     //  Only allow cancel if PENDING or CONFIRMED
//     if (!["PENDING", "CONFIRMED"].includes(order[0].status)) {
//       result.message = OrdersMessages.ORDER_CANNOT_BE_CANCEL;
//       return result;
//     }

//     await conn.execute(
//       `UPDATE orders SET status='CANCELLED', updated_at=NOW() WHERE id=?`,
//       [order_id],
//     );

//     result.status = 1;
//     result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
//     result.data = { order_id };
//   } catch (error) {
//     result.message = error;
//   } finally {
//     conn.release();
//   }

//   return result;
// };


const cancelOrder = async ({ order_id }) => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    /////////////////////
    // CHECK ORDER
    /////////////////////
    let [order] = await conn.execute(
      `SELECT status FROM orders WHERE id=?`,
      [order_id]
    );

    if (order.length === 0) {
      result.message = OrdersMessages.ORDER_NOT_FOUND;
      return result;
    }

    const currentStatus = order[0].status;

    /////////////////////
    // ALREADY CANCELLED
    /////////////////////
    if (currentStatus === "CANCELLED") {
      result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
      return result;
    }

    /////////////////////
    // BLOCK COMPLETED 
    /////////////////////
    if (currentStatus === "COMPLETED") {
      result.message = OrdersMessages.ORDER_CANNOT_BE_CANCEL;
      return result;
    }

    /////////////////////
    // UPDATE ORDER
    /////////////////////
    await conn.execute(
      `UPDATE orders 
       SET status='CANCELLED', updated_at=NOW() 
       WHERE id=?`,
      [order_id]
    );

    /////////////////////
    // INSERT TIMELINE 🔥
    /////////////////////
    await conn.execute(
      `INSERT INTO order_timings (order_id, status, created_at) 
       VALUES (?, 'CANCELLED', NOW())`,
      [order_id]
    );

    /////////////////////
    // FINAL RESPONSE
    /////////////////////
    result.status = 1;
    result.message = OrdersMessages.ORDER_CANCEL_SUCCESS;
    result.data = { order_id };

  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};
module.exports = {
  getAllOrders,
  getOrderDetailsById,
  getOrderStatusById,
  updateOrderStatusById,
  cancelOrder,
};
