const pool = require("../../../Config/db.polloingConnection");
const { CategoriesMessages, } = require("../../../Utils/ResponseMessagesCollection");
const { getServerRawUrl, fetchServerFileStream } = require("../../../Utils/uploadFile");

/////////////--------------------------------//////////////////////////////
// Get All Active Categories Service
///////////////------------------------------//////////////////////////////
const getAllActiveCategories = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.url,
        c.position,
        c.status,
        c.created_at,
        c.updated_at,
        sc.id AS sub_cat_id,
        sc.name AS sub_cat_name,
        sc.position AS sub_cat_position
      FROM categories c
      LEFT JOIN sub_categories sc
        ON c.id = sc.category_id
      WHERE c.status=1 AND c.deleted_at IS NULL
      ORDER BY position
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      let categories = {}

      res.forEach((cat) => {
        if (!categories[cat.id]) {
          categories[cat.id] = {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            url: cat.url,
            position: cat.position,
            status: cat.status,
            created_at: cat.created_at,
            updated_at: cat.updated_at,
            sub_categories: []
          }
        }

        if (cat.sub_cat_id) {
          categories[cat.id].sub_categories.push({
            sub_cat_id: cat.sub_cat_id,
            sub_cat_name: cat.sub_cat_name,
            sub_cat_position: cat.sub_cat_position
          })
        }
      })

      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_LIST_FETCH_SUCCESS;
      result.data = Object.values(categories);
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
    let query = `SELECT 
                  id,
                  name,
                  description,
                  url,
                  position,
                  status,
                  created_at,
                  updated_at
                FROM categories
                WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.query(query, [cat_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = CategoriesMessages.CATEGORY_FETCH_SUCCESS;
      result.data = res[0];
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
    let query = `SELECT id, url, name FROM categories WHERE status=1 AND deleted_at IS NULL ORDER BY position`
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
}

/////////////--------------------------------//////////////////////////////
// Get Categories Image By Id Service
///////////////------------------------------//////////////////////////////
const getCategoriesImageById = async ({ id }) => {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: "Id is required",
    };
  }
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.execute(
      `SELECT url FROM categories WHERE id=? LIMIT 1`,
      [id]
    );
    console.log("inside rows", rows);

    if (!rows.length || !rows[0].url) {
      return {
        success: false,
        status: 404,
        error: "No catgory image found for the given ID",
      };
    }

    const serverUrl = getServerRawUrl(rows[0].url);
    const result = await fetchServerFileStream(serverUrl);

    return result;
  } catch (error) {
    console.log("Service Error:", error.message);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  } finally {
    conn.release();
  }
};

module.exports = {
  getAllActiveCategories,
  getCategoriesById,
  getActiveCategories,
  getCategoriesImageById,
};
