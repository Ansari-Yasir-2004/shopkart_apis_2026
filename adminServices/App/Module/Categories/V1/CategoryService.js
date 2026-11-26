const pool = require("../../../Config/db.polloingConnection");
const {
  CategoriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");
const { uploadFileToServer, getServerRawUrl, fetchServerFileStream, deleteFileFromServer } = require("../../../Utils/uploadFile.js");


/////////////--------------------------------//////////////////////////////
// Get All Categories Service
///////////////------------------------------//////////////////////////////
const getAllCategories = async () => {
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
        name,
        description,
        url,
        position,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE deleted_at IS NULL
      ORDER BY position
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((cat) => ({
        ...cat,
        created_at: cat.created_at ?
          utils.commonFormateDate(cat.created_at)
          : null,
        updated_at: cat.updated_at ?
          utils.commonFormateDate(cat.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = CategoriesMessages.CATEGORY_NOT_FOUND;
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
// Get Categories By Id Service
///////////////------------------------------//////////////////////////////
const getCategoriesById = async ({ cat_id }) => {
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
        name,
        description,
        url,
        position,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.query(query, [cat_id]);
    console.log("inside query", res);

    let catRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...catRes,
        created_at: catRes.created_at ?
          utils.commonFormateDate(catRes.created_at)
          : null,
        updated_at: catRes.updated_at ?
          utils.commonFormateDate(catRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = CategoriesMessages.CATEGORY_NOT_FOUND;
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
// Get Active Categories Service
///////////////------------------------------//////////////////////////////
const getActiveCategories = async () => {
  let result = {
    status: 0,
    message: "",
    data: ""
  }
  const conn = await pool.getConnection()

  try {
    let query = `SELECT id, name FROM categories WHERE status=1 AND deleted_at IS NULL`
    let [res] = await conn.query(query)
    console.log('inside query', res)

    if (res && res.length > 0) {
      result.status = 1
      result.message = CategoriesMessages.CATEGORY_LIST_FETCH_SUCCESS
      result.data = res
    } else {
      result.message = CategoriesMessages.CATEGORY_NOT_FOUND
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release()
  }

  return result
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
// Check Category By Name Service
///////////////------------------------------//////////////////////////////
const checkCategoryByName = async (name, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `SELECT id FROM categories WHERE name=? AND deleted_at IS NULL`;
    let queryInjector = [name];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkCategoryByName query", res);

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
// Check Category By Position Service
///////////////------------------------------//////////////////////////////
const checkCategoryByPosition = async (position, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `SELECT id FROM categories WHERE position=? AND deleted_at IS NULL`;
    let queryInjector = [position];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkCategoryByPosition query", res);

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
// Add Categories Service
///////////////------------------------------//////////////////////////////
const addCategories = async ({ name, description, position, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `INSERT INTO categories 
                  (name, description, position, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?)`;
    let [res] = await conn.execute(query, [
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
      result.message = CategoriesMessages.CATEGORY_ADDED_SUCCESS;
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
// Update Categories By Id Service
///////////////------------------------------//////////////////////////////
const updateCategoriesById = async ({
  cat_id,
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
    let query = `UPDATE categories 
                SET 
                  name=?,
                  description=?,
                  position=?,
                  status=?,
                  updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [
      name,
      description,
      position,
      status,
      currentTime,
      cat_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_UPDATED_SUCCESS;
      result.data = { id: cat_id };
    } else if (res.affectedRows === 0) {
      result.message = CategoriesMessages.INVALID_CATEGORY_ID;
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
// Update Categories Status By Id Service
///////////////------------------------------//////////////////////////////
const updateCategoriesStatusById = async ({ cat_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE categories 
                SET status=?, updated_at=? 
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, cat_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_STATUS_UPDATED_SUCCESS;
      result.data = { id: cat_id };
    } else if (res.affectedRows === 0) {
      result.message = CategoriesMessages.INVALID_CATEGORY_ID;
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
// Delete Categories By Id Service
///////////////------------------------------//////////////////////////////
const deleteCategoriesById = async ({ cat_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE categories SET deleted_at=? WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [currentTime, cat_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_DELETE_SUCCESS;
      result.data = { id: cat_id };
    } else if (res.affectedRows === 0) {
      result.message = CategoriesMessages.INVALID_CATEGORY_ID;
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

// Images Services

/////////////--------------------------------//////////////////////////////
// Update Promocode Image by ID  Service
///////////////------------------------------//////////////////////////////
const saveCategoryImageById = async ({ file, CId }) => {
  const conn = await pool.getConnection();

  try {
    // Step 1: Check if the ID exists
    const [rows] = await conn.query(
      `SELECT id FROM categories WHERE id = ? LIMIT 1`,
      [CId]
    );

    if (!rows.length) {
      return {
        success: false,
        status: 404,
        error: `Banner ID ${CId} does not exist`,
      };
    }

    if (!file || !file.originalname) {
      return {
        success: false,
        status: 400,
        error: "File is missing or invalid",
      };
    }

    // Step 2: Upload the file to Server
    const fileExtension = file.originalname.split('.').pop(); // e.g., png
    const folder = `categories`;
    const subfolder = `${CId}`;
    const customFileName = `categories_${CId}_${Date.now()}`;

    const uploadResult = await uploadFileToServer({
      file,
      folder,
      subfolder,
      commitMessage: `Upload category image for ID ${CId}`,
      customFileName,
      fileExtension,

    });

    if (!uploadResult.success) return uploadResult;

    const { download_url } = uploadResult.data;

    // Step 3: Update DB with the Server SHA
    const relativePath = `${folder}/${subfolder}/${customFileName}.${fileExtension}`;
    const query = `UPDATE categories SET url = ? WHERE id = ?`;
    await conn.query(query, [relativePath, CId]);

    return {
      success: true,
      message: "Image uploaded successfully",
      status: 200,
      response: {
        // fileName: file.originalname,
        // server_url: download_url,
        // relativePath,
        id: CId,
      },
    };
  } catch (error) {
    console.error("Service error:", error.message || error);
    return {
      success: false,
      error: "Server upload failed",
    };
  } finally {
    conn.release();
  }
};


/////////////--------------------------------//////////////////////////////
// Get Image Path By Id Service
///////////////------------------------------//////////////////////////////
const getCategoryImageById = async ({ id }) => {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: "ID is required",
    };
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT url FROM categories WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length || !rows[0].url) {
      return {
        success: false,
        status: 404,
        error: "No banner found for the given ID",
      };
    }

    const serverUrl = getServerRawUrl(rows[0].url);
    const result = await fetchServerFileStream(serverUrl);

    return result;
  } catch (error) {
    console.error("Service Error:", error.message);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  } finally {
    conn.release();
  }
};


/////////////--------------------------------//////////////////////////////
// delete App Banner Image By ID  Service
///////////////------------------------------//////////////////////////////
const deleteCategoryImageById = async ({ id }) => {
  const conn = await pool.getConnection();
  let result = {
    success: false,
    status: 500,
    message: "Something went wrong",
  };

  try {
    // Step 1: Get image URL (used as SHA or Server identifier)
    const [rows] = await conn.query(
      `SELECT url FROM categories WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      result.status = 404;
      result.message = "Image not found";
      return result;
    }

    const { url } = rows[0];

    // Step 2: Delete from Server if URL exists
    if (url) {
      const serverDelete = await deleteFileFromServer({ relativePath: url });
      if (!serverDelete.success) return serverDelete;
    }

    // Step 3: Only update the URL to empty string
    await conn.query(
      `UPDATE categories SET url = '' WHERE id = ?`,
      [id]
    );

    result.success = true;
    result.status = 200;
    result.message = "Image deleted from Server and URL cleared in DB";
    return result;
  } catch (err) {
    console.error("Service Error:", err.message);
    result.message = "Internal error while deleting image";
    return result;
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllCategories,
  getCategoriesById,
  getActiveCategories,
  checkCategoryById,
  checkCategoryByName,
  checkCategoryByPosition,
  addCategories,
  updateCategoriesById,
  updateCategoriesStatusById,
  deleteCategoriesById,
  saveCategoryImageById,
  getCategoryImageById,
  deleteCategoryImageById
};
