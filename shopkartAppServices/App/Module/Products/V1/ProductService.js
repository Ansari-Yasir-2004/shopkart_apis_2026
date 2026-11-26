const pool = require("../../../Config/db.polloingConnection");
const {
  ProductsMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const { getServerRawUrl, fetchServerFileStream } = require("../../../Utils/uploadFile");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get Products By Id Service
///////////////------------------------------//////////////////////////////
const getProductsById = async ({ prod_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    // PRODUCT DETAILS
    let productQuery = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        p.name,
        p.slug,
        p.original_price,
        p.discount_price,
        p.description,
        p.position,
        p.out_of_stock,
        p.is_featured,
        p.is_new_arrival,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN brands b
        ON p.brand_id = b.id
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories sc
        ON p.sub_category_id = sc.id
      WHERE p.id=? AND p.status=1 AND p.deleted_at IS NULL
    `;

    let [productRes] = await conn.query(productQuery, [prod_id]);
    if (!productRes.length) {
      result.message = ProductsMessages.PRODUCT_NOT_FOUND;
      return result;
    }

    // PRODUCT SPECIFICATIONS
    let specificationQuery = `
      SELECT
        id,
        name,
        value,
        position
      FROM product_specifications
      WHERE product_id=? AND deleted_at IS NULL
      ORDER BY position ASC
    `;
    let [specificationRes] = await conn.query(specificationQuery, [prod_id]);

    // PRODUCT IMAGES
    let imagesQuery = `
      SELECT
        id AS image_id,
        url
      FROM product_images
      WHERE product_id=?
      ORDER BY id ASC
    `;
    let [imagesRes] = await conn.query(imagesQuery, [prod_id]);

    // FINAL RESPONSE
    const product = {
      ...productRes[0],
      specifications: specificationRes,
      images: imagesRes,
    };

    result.status = 1;
    result.message = ProductsMessages.PRODUCT_FETCH_SUCCESS;
    result.data = product;

  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Is Featured Products Service
///////////////------------------------------//////////////////////////////
const getIsFeaturedProducts = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        (
          SELECT 
            pi.id
          FROM product_images pi
          WHERE pi.product_id = p.id
          LIMIT 1
        ) AS image_id,
        p.name,
        p.slug,
        p.original_price,
        p.discount_price,
        p.description,
        p.position,
        p.out_of_stock,
        p.is_featured,
        p.is_new_arrival,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN brands b
        ON p.brand_id = b.id
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories sc
        ON p.sub_category_id = sc.id
      WHERE p.status=1 AND p.is_featured=1 AND p.deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = ProductsMessages.PRODUCT_NOT_FOUND;
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
// Get Is New Arrival Products Service
///////////////------------------------------//////////////////////////////
const getIsNewArrivalProducts = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        (
          SELECT 
            pi.id
          FROM product_images pi
          WHERE pi.product_id = p.id
          LIMIT 1
        ) AS image_id,
        p.name,
        p.slug,
        p.original_price,
        p.discount_price,
        p.description,
        p.position,
        p.out_of_stock,
        p.is_featured,
        p.is_new_arrival,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN brands b
        ON p.brand_id = b.id
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories sc
        ON p.sub_category_id = sc.id
      WHERE p.status=1 AND p.is_new_arrival=1 AND p.deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = ProductsMessages.PRODUCT_NOT_FOUND;
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
// Get Products By Category & SubCategory Id Service
///////////////------------------------------//////////////////////////////
const getProductsByCategoryAndSubCategoryId = async ({ filters }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  const isValid = (val) => {
    return val !== undefined && val !== null && val !== "null";
  }

  try {
    let query = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        (
          SELECT 
            pi.id
          FROM product_images pi
          WHERE pi.product_id = p.id
          LIMIT 1
        ) AS image_id,
        p.name,
        p.slug,
        p.original_price,
        p.discount_price,
        p.description,
        p.position,
        p.out_of_stock,
        p.is_featured,
        p.is_new_arrival,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN brands b
        ON p.brand_id = b.id
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories sc
        ON p.sub_category_id = sc.id
      WHERE p.status=1 AND p.deleted_at IS NULL
    `;

    let values = [];

    if (isValid(filters.category_id)) {
      query += ` AND p.category_id=?`
      values.push(filters.category_id)
    }

    if (isValid(filters.sub_category_id)) {
      query += ` AND p.sub_category_id=?`
      values.push(filters.sub_category_id)
    }

    let [res] = await conn.execute(query, values);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = ProductsMessages.PRODUCT_NOT_FOUND;
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
// Get Products By Category Id Service
///////////////------------------------------//////////////////////////////
const getProductsByCategoryId = async ({ cat_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        (
          SELECT 
            pi.id
          FROM product_images pi
          WHERE pi.product_id = p.id
          LIMIT 1
        ) AS image_id,
        p.name,
        p.slug,
        p.original_price,
        p.discount_price,
        p.description,
        p.position,
        p.out_of_stock,
        p.is_featured,
        p.is_new_arrival,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN brands b
        ON p.brand_id = b.id
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN sub_categories sc
        ON p.sub_category_id = sc.id
      WHERE p.status=1 AND p.category_id=? AND p.deleted_at IS NULL
      LIMIT 10
    `;
    let [res] = await conn.query(query, [cat_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = ProductsMessages.PRODUCT_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release();
  }
  return result;
};

// ====================== MULTIPLE IMAGES =======================

/////////////--------------------------------//////////////////////////////
// Get Product Images By Id Service
///////////////------------------------------//////////////////////////////
const getProductImageById = async ({ id }) => {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: "ID is required",
    };
  }
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.execute(
      `SELECT url FROM product_images WHERE id=? LIMIT 1`,
      [id]
    );

    if (!rows.length || !rows[0].url) {
      return {
        success: false,
        status: 404,
        error: "No image found for the given ID",
      };
    }

    const serverUrl = getServerRawUrl(rows[0].url);
    const result = await fetchServerFileStream(serverUrl);

    return result;
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: "Internal Server Error"
    };
  } finally {
    conn.release();
  }
}

module.exports = {
  getProductsById,
  getIsFeaturedProducts,
  getIsNewArrivalProducts,
  getProductsByCategoryAndSubCategoryId,
  getProductsByCategoryId,
  getProductImageById,
};
