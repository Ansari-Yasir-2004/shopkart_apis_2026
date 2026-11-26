const pool = require("../../../Config/db.polloingConnection");
const {
  SubCategoriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All SubCategories Service
///////////////------------------------------//////////////////////////////
const getAllSubCategories = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `SELECT 
                  sc.id,
                  sc.category_id,
                  c.name AS category_name,
                  sc.name,
                  sc.description,
                  sc.url,
                  sc.position,
                  sc.status,
                  sc.created_at,
                  sc.updated_at
                FROM sub_categories sc
                LEFT JOIN categories c
                ON sc.category_id = c.id
                WHERE sc.deleted_at IS NULL`;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = SubCategoriesMessages.SUB_CATEGORY_NOT_FOUND;
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get SubCategories By Id Service
///////////////------------------------------//////////////////////////////
const getSubCategoriesById = async ({ sub_cat_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `SELECT 
                  sc.id,
                  sc.category_id,
                  c.name AS category_name,
                  sc.name,
                  sc.description,
                  sc.url,
                  sc.position,
                  sc.status,
                  sc.created_at,
                  sc.updated_at
                FROM sub_categories sc
                LEFT JOIN categories c
                ON sc.category_id = c.id
                WHERE sc.id=? AND sc.deleted_at IS NULL`;
    let [res] = await conn.query(query, [sub_cat_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_FETCH_SUCCESS;
      result.data = res[0];
    } else {
      result.message = SubCategoriesMessages.SUB_CATEGORY_NOT_FOUND;
    }
  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get SubCategories By Id Service
///////////////------------------------------//////////////////////////////
const getSubCategoriesByCategoryId = async ({ cat_id }) => {
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
        category_id,
        name,
        description,
        url,
        position,
        status,
        created_at,
        updated_at
      FROM sub_categories 
      WHERE category_id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.query(query, [cat_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = SubCategoriesMessages.SUB_CATEGORY_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Check Category By Id Service
///////////////------------------------------//////////////////////////////
const checkCategoryById = async (cat_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM categories WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [cat_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkCategoryById query", res);

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
// Check SubCategory By Id Service
///////////////------------------------------//////////////////////////////
const checkSubCategoryById = async (sub_cat_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM sub_categories WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [sub_cat_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkSubCategoryById query", res);

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
// Check SubCategory By Name Service
///////////////------------------------------//////////////////////////////
const checkSubCategoryByName = async (cat_id, name, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `
              SELECT id 
              FROM sub_categories 
              WHERE category_id=? 
              AND name=? 
              AND deleted_at IS NULL  
            `;
    let queryInjector = [cat_id, name];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkSubCategoryByName query", res);

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
// Check SubCategory By Position Service
///////////////------------------------------//////////////////////////////
const checkSubCategoryByPosition = async (cat_id, position, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `
              SELECT id 
              FROM sub_categories 
              WHERE category_id=? 
              AND position=? 
              AND deleted_at IS NULL
            `;
    let queryInjector = [cat_id, position];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkSubCategoryByPosition query", res);

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
// Add SubCategories Service
///////////////------------------------------//////////////////////////////
const addSubCategories = async ({ category_id, name, description, position, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `INSERT INTO sub_categories 
                  (category_id, name, description, position, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let [res] = await conn.execute(query, [
      category_id,
      name,
      description,
      position,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_ADDED_SUCCESS;
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
// Update SubCategories By Id Service
///////////////------------------------------//////////////////////////////
const updateSubCategoriesById = async ({
  sub_cat_id,
  category_id,
  name,
  description,
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
    let query = `UPDATE sub_categories 
                SET 
                  category_id=?,
                  name=?,
                  description=?,
                  position=?,
                  status=?,
                  updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [
      category_id,
      name,
      description,
      position,
      status,
      currentTime,
      sub_cat_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_UPDATED_SUCCESS;
      result.data = { id: sub_cat_id };
    } else if (res.affectedRows === 0) {
      result.message = SubCategoriesMessages.INVALID_SUB_CATEGORY_ID;
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
// Update SubCategories Status By Id Service
///////////////------------------------------//////////////////////////////
const updateSubCategoriesStatusById = async ({ sub_cat_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE sub_categories 
                SET status=?, updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, sub_cat_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_STATUS_UPDATED_SUCCESS;
      result.data = { id: sub_cat_id };
    } else if (res.affectedRows === 0) {
      result.message = SubCategoriesMessages.INVALID_SUB_CATEGORY_ID;
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
// Delete SubCategories By Id Service
///////////////------------------------------//////////////////////////////
const deleteSubCategoriesById = async ({ sub_cat_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE sub_categories SET deleted_at=? WHERE id=?`;
    let [res] = await conn.execute(query, [currentTime, sub_cat_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = SubCategoriesMessages.SUB_CATEGORY_DELETE_SUCCESS;
      result.data = { id: sub_cat_id };
    } else if (res.affectedRows === 0) {
      result.message = SubCategoriesMessages.INVALID_SUB_CATEGORY_ID;
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
  getAllSubCategories,
  getSubCategoriesById,
  getSubCategoriesByCategoryId,
  checkCategoryById,
  checkSubCategoryById,
  checkSubCategoryByName,
  checkSubCategoryByPosition,
  addSubCategories,
  updateSubCategoriesById,
  updateSubCategoriesStatusById,
  deleteSubCategoriesById,
};
