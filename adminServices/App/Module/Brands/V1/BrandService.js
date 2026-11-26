const pool = require("../../../Config/db.polloingConnection");
const {
  BrandsMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All Brands Service
///////////////------------------------------//////////////////////////////
const getAllBrands = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        id,
        url,
        name,
        status,
        created_at,
        updated_at
      FROM brands
      WHERE deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((brand) => ({
        ...brand,
        created_at: brand.created_at ?
          utils.commonFormateDate(brand.created_at)
          : null,
        updated_at: brand.updated_at ?
          utils.commonFormateDate(brand.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = BrandsMessages.BRAND_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = BrandsMessages.BRAND_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Brands By Id Service
///////////////------------------------------//////////////////////////////
const getBrandsById = async ({ brnd_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `SELECT 
                  id,
                  url,
                  name,
                  status,
                  created_at,
                  updated_at
                FROM brands
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.query(query, [brnd_id]);
    console.log("inside query", res);

    let brandRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...brandRes,
        created_at: brandRes.created_at ?
          utils.commonFormateDate(brandRes.created_at)
          : null,
        updated_at: brandRes.updated_at ?
          utils.commonFormateDate(brandRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = BrandsMessages.BRAND_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = BrandsMessages.BRAND_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Active Brands Service
///////////////------------------------------//////////////////////////////
const getActiveBrands = async () => {
  let result = {
    status: 0,
    message: "",
    data: ""
  }
  const conn = await pool.getConnection()

  try {
    let query = `SELECT id, name FROM brands WHERE status=1 AND deleted_at IS NULL`
    let [res] = await conn.query(query)
    console.log('inside query', res)

    if (res && res.length > 0) {
      result.status = 1
      result.message = BrandsMessages.BRAND_LIST_FETCH_SUCCESS
      result.data = res
    } else {
      result.message = BrandsMessages.BRAND_NOT_FOUND
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release()
  }

  return result
}

/////////////--------------------------------//////////////////////////////
// Check Brand By Id Service
///////////////------------------------------//////////////////////////////
const checkBrandById = async (brnd_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM brands WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [brnd_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkBrandById query", res);

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
// Check Brand By Name Service
///////////////------------------------------//////////////////////////////
const checkBrandByName = async (name, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `SELECT id FROM brands WHERE name=? AND deleted_at IS NULL`;
    let queryInjector = [name];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkBrandByName query", res);

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
// Add Brands Service
///////////////------------------------------//////////////////////////////
const addBrands = async ({ name, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `INSERT INTO brands 
                  (name, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?)`;
    let [res] = await conn.execute(query, [
      name,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = BrandsMessages.BRAND_ADDED_SUCCESS;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something went wrong";
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Brands By Id Service
///////////////------------------------------//////////////////////////////
const updateBrandsById = async ({
  brnd_id,
  name,
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
    let query = `UPDATE brands 
                SET 
                  name=?,
                  status=?,
                  updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [
      name,
      status,
      currentTime,
      brnd_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = BrandsMessages.BRAND_UPDATED_SUCCESS;
      result.data = { id: brnd_id };
    } else if (res.affectedRows === 0) {
      result.message = BrandsMessages.INVALID_BRAND_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }
  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Brands Status By Id Service
///////////////------------------------------//////////////////////////////
const updateBrandsStatusById = async ({ brnd_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE brands 
                SET status=?, updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, brnd_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = BrandsMessages.BRAND_STATUS_UPDATED_SUCCESS;
      result.data = { id: brnd_id };
    } else if (res.affectedRows === 0) {
      result.message = BrandsMessages.INVALID_BRAND_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Delete Brands By Id Service
///////////////------------------------------//////////////////////////////
const deleteBrandsById = async ({ brnd_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE brands SET deleted_at=? WHERE id=?`;
    let [res] = await conn.execute(query, [currentTime, brnd_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = BrandsMessages.BRAND_DELETE_SUCCESS;
      result.data = { id: brnd_id };
    } else if (res.affectedRows === 0) {
      result.message = BrandsMessages.INVALID_BRAND_ID;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

module.exports = {
  getAllBrands,
  getBrandsById,
  getActiveBrands,
  checkBrandById,
  checkBrandByName,
  addBrands,
  updateBrandsById,
  updateBrandsStatusById,
  deleteBrandsById,
};
