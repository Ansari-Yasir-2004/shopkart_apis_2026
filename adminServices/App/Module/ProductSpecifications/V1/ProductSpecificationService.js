const pool = require("../../../Config/db.polloingConnection");
const {
  ProductSpecificationsMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All ProductSpecifications Service
///////////////------------------------------//////////////////////////////
const getAllProductSpecifications = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
    SELECT 
      ps.id,
      ps.product_id,
      p.name AS product_name,
      ps.name,
      ps.value,
      ps.position,
      ps.status,
      ps.created_at,
      ps.updated_at
    FROM product_specifications ps
    LEFT JOIN products p
    ON ps.product_id = p.id
    WHERE ps.deleted_at IS NULL
    ORDER BY p.position, ps.position
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((prod_spec) => ({
        ...prod_spec,
        created_at: prod_spec.created_at ?
          utils.commonFormateDate(prod_spec.created_at)
          : null,
        updated_at: prod_spec.updated_at ?
          utils.commonFormateDate(prod_spec.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_NOT_FOUND;
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get ProductSpecifications By Id Service
///////////////------------------------------//////////////////////////////
const getProductSpecificationsById = async ({ prod_spec_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `SELECT 
                  ps.id,
                  ps.product_id,
                  p.name AS product_name,
                  ps.name,
                  ps.value,
                  ps.position,
                  ps.status,
                  ps.created_at,
                  ps.updated_at
                FROM product_specifications ps
                LEFT JOIN products p
                ON ps.product_id = p.id
                WHERE ps.id=? AND ps.deleted_at IS NULL`;
    let [res] = await conn.query(query, [prod_spec_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_FETCH_SUCCESS;
      result.data = res[0];
    } else {
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_NOT_FOUND;
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Check Product By Id Service
///////////////------------------------------//////////////////////////////
const checkProductById = async (prod_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM products WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [prod_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductById query", res);

    if (res.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.log("error occured", error);
  } finally {
    conn.release();
  }
  return exists;
};

/////////////--------------------------------//////////////////////////////
// Check ProductSpecification By Id Service
///////////////------------------------------//////////////////////////////
const checkProductSpecificationById = async (prod_spec_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM product_specifications WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [prod_spec_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductSpecificationById query", res);

    if (res.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.log("error occured", error);
  } finally {
    conn.release();
  }
  return exists;
};

/////////////--------------------------------//////////////////////////////
// Check ProductSpecification By Name Service
///////////////------------------------------//////////////////////////////
const checkProductSpecificationByName = async (prod_id, name, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `
              SELECT id 
              FROM product_specifications 
              WHERE product_id=? 
              AND name=? 
              AND deleted_at IS NULL
            `;
    let queryInjector = [prod_id, name];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductSpecificationByName query", res);

    if (res.length > 0) {
      findCount = res[0].id;
    } else {
      findCount = 0;
    }
  } catch (error) {
    console.log("error occured", error);
  } finally {
    conn.release();
  }
  return findCount;
};

/////////////--------------------------------//////////////////////////////
// Check ProductSpecification By Position Service
///////////////------------------------------//////////////////////////////
const checkProductSpecificationByPosition = async (prod_id, position, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `
              SELECT id 
              FROM product_specifications 
              WHERE product_id=? 
              AND position=? 
              AND deleted_at IS NULL
            `;
    let queryInjector = [prod_id, position];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductSpecificationByPosition query", res);

    if (res.length > 0) {
      findCount = res[0].id;
    } else {
      findCount = 0;
    }
  } catch (error) {
    console.log("error occured", error.message);
  } finally {
    conn.release();
  }
  return findCount;
};

/////////////--------------------------------//////////////////////////////
// Add ProductSpecifications Service
///////////////------------------------------//////////////////////////////
const addProductSpecifications = async ({ product_id, name, value, position, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `INSERT INTO product_specifications 
                  (product_id, name, value, position, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let [res] = await conn.execute(query, [
      product_id,
      name,
      value,
      position,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_ADDED_SUCCESS;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something went wrong";
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Update ProductSpecifications By Id Service
///////////////------------------------------//////////////////////////////
const updateProductSpecificationsById = async ({
  prod_spec_id,
  product_id,
  name,
  value,
  position,
  status,
}) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE product_specifications 
                SET 
                  product_id=?,
                  name=?,
                  value=?,
                  position=?,
                  status=?,
                  updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [
      product_id,
      name,
      value,
      position,
      status,
      currentTime,
      prod_spec_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_UPDATED_SUCCESS;
      result.data = { id: prod_spec_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductSpecificationsMessages.INVALID_PRODUCT_SPEC_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }
  return result;
};

/////////////--------------------------------//////////////////////////////
// Update ProductSpecifications Status By Id Service
///////////////------------------------------//////////////////////////////
const updateProductSpecificationsStatusById = async ({ prod_spec_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE product_specifications 
                SET status=?, updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, prod_spec_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_STATUS_UPDATED_SUCCESS;
      result.data = { id: prod_spec_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductSpecificationsMessages.INVALID_PRODUCT_SPEC_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Delete ProductSpecifications By Id Service
///////////////------------------------------//////////////////////////////
const deleteProductSpecificationsById = async ({ prod_spec_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE product_specifications SET deleted_at=? WHERE id=?`;
    let [res] = await conn.execute(query, [currentTime, prod_spec_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductSpecificationsMessages.PRODUCT_SPEC_DELETE_SUCCESS;
      result.data = { id: prod_spec_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductSpecificationsMessages.INVALID_PRODUCT_SPEC_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

module.exports = {
  getAllProductSpecifications,
  getProductSpecificationsById,
  checkProductById,
  checkProductSpecificationById,
  checkProductSpecificationByName,
  checkProductSpecificationByPosition,
  addProductSpecifications,
  updateProductSpecificationsById,
  updateProductSpecificationsStatusById,
  deleteProductSpecificationsById,
};
