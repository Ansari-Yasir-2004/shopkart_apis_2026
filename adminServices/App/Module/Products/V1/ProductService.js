const pool = require("../../../Config/db.polloingConnection");
const {
  ProductsMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");
const { uploadFileToServer, getServerRawUrl, fetchServerFileStream, deleteFileFromServer } = require("../../../Utils/uploadFile.js");

/////////////--------------------------------//////////////////////////////
// Get All Products Service
///////////////------------------------------//////////////////////////////
const getAllProducts = async () => {
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
        pi.id AS image_id,
        pi.url,
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
      LEFT JOIN product_images pi
        ON p.id = pi.product_id
      WHERE p.deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const productMapping = {};

      res.forEach((product) => {
        if (!productMapping[product.id]) {
          productMapping[product.id] = {
            id: product.id,
            brand_id: product.brand_id,
            brand_name: product.brand_name,
            category_id: product.category_id,
            category_name: product.category_name,
            sub_category_id: product.sub_category_id,
            sub_category_name: product.sub_category_name,
            name: product.name,
            slug: product.slug,
            original_price: product.original_price,
            discount_price: product.discount_price,
            description: product.description,
            position: product.position,
            out_of_stock: product.out_of_stock,
            is_featured: product.is_featured,
            is_new_arrival: product.is_new_arrival,
            status: product.status,
            created_at: product.created_at
              ? utils.commonFormateDate(product.created_at)
              : null,
            updated_at: product.updated_at
              ? utils.commonFormateDate(product.updated_at)
              : null,
            images: [],
          }
        }

        if (product.image_id && product.url) {
          productMapping[product.id].images.push({
            image_id: product.image_id,
            url: product.url,
          })
        }
      })

      result.status = 1;
      result.message = ProductsMessages.PRODUCT_LIST_FETCH_SUCCESS;
      result.data = Object.values(productMapping);
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
    let query = `
      SELECT 
        p.id,
        p.brand_id,
        b.name AS brand_name,
        p.category_id,
        c.name AS category_name,
        p.sub_category_id,
        sc.name AS sub_category_name,
        p.name,
        p.url,
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
      WHERE p.id=? AND p.deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [prod_id]);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_FETCH_SUCCESS;
      result.data = res[0];
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
// Get Active Products Service
///////////////------------------------------//////////////////////////////
const getActiveProducts = async () => {
  let result = {
    status: 0,
    message: "",
    data: ""
  };
  const conn = await pool.getConnection();

  try {
    let query = `SELECT id, name FROM products WHERE status=1 AND deleted_at IS NULL`;
    let [res] = await conn.query(query);
    console.log('inside query', res);

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
// Check Brand By Id Service
///////////////------------------------------//////////////////////////////
const checkBrandById = async (brnd_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM brands WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [brnd_id];

    let [res] = await conn.execute(query, queryInjector);
    console.log('inside checkBrandById query', res);

    if (res && res.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.log('error occured', error);
  } finally {
    conn.release();
  }
  return exists;
}

/////////////--------------------------------//////////////////////////////
// Check category By Id Service
///////////////------------------------------//////////////////////////////
const checkCategoryById = async (cat_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM categories WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [cat_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log('inside checkCategoryById query', res);

    if (res.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.log('error occured', error);
  } finally {
    conn.release();
  }
  return exists;
}

/////////////--------------------------------//////////////////////////////
// Check sub category By Id Service
///////////////------------------------------//////////////////////////////
const checkSubCategoryById = async (sub_cat_id) => {
  const conn = await pool.getConnection();
  let exists = false;

  try {
    let query = `SELECT id FROM sub_categories WHERE id=? AND deleted_at IS NULL`;
    let queryInjector = [sub_cat_id];

    const [res] = await conn.execute(query, queryInjector);
    console.log('inside query', res);

    if (res.length > 0) {
      exists = true;
    }
  } catch (error) {
    console.log('error occured', error);
  } finally {
    conn.release();
  }
  return exists;
}

/////////////--------------------------------//////////////////////////////
// Check Product By Name Service
///////////////------------------------------//////////////////////////////
const checkProductByName = async (name, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `SELECT id FROM products WHERE name=? AND deleted_at IS NULL`;
    let queryInjector = [name];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductByName query", res);

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
// Check Product By Position Service
///////////////------------------------------//////////////////////////////
const checkProductByPosition = async (position, excludedId = null) => {
  const conn = await pool.getConnection();
  let findCount = 0;

  try {
    let query = `SELECT id FROM products WHERE position=? AND deleted_at IS NULL`;
    let queryInjector = [position];

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    const [res] = await conn.execute(query, queryInjector);
    console.log("inside checkProductByPosition query", res);

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
// Add Products Service
///////////////------------------------------//////////////////////////////
const addProducts = async ({
  brand_id,
  category_id,
  sub_category_id,
  name,
  original_price,
  discount_price,
  description,
  position,
  out_of_stock,
  is_featured,
  is_new_arrival,
  status
}) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let slug = utils.slugify(name)
    let query = `
      INSERT INTO products 
        (
          brand_id, 
          category_id, 
          sub_category_id, 
          name, 
          slug, 
          original_price, 
          discount_price, 
          description, 
          position, 
          out_of_stock, 
          is_featured, 
          is_new_arrival, 
          status, 
          created_at, 
          updated_at
        ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    let [res] = await conn.execute(query, [
      brand_id,
      category_id,
      sub_category_id,
      name,
      slug,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_ADDED_SUCCESS;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something went wrong";
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
// Update Products By Id Service
///////////////------------------------------//////////////////////////////
const updateProductsById = async ({
  prod_id,
  brand_id,
  category_id,
  sub_category_id,
  name,
  original_price,
  discount_price,
  description,
  position,
  out_of_stock,
  is_featured,
  is_new_arrival,
  status
}) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let slug = utils.slugify(name)
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE products 
      SET 
        brand_id=?, 
        category_id=?, 
        sub_category_id=?, 
        name=?, 
        slug=?, 
        original_price=?, 
        discount_price=?, 
        description=?, 
        position=?, 
        out_of_stock=?, 
        is_featured=?,
        is_new_arrival=?,
        status=?, 
        updated_at=? 
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [
      brand_id,
      category_id,
      sub_category_id,
      name,
      slug,
      original_price,
      discount_price,
      description,
      position,
      out_of_stock,
      is_featured,
      is_new_arrival,
      status,
      currentTime,
      prod_id
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_UPDATED_SUCCESS;
      result.data = { id: prod_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductsMessages.INVALID_PRODUCT_ID;
    } else {
      result.message = "Something Went Wrong";
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
// Update Products Status By Id Service
///////////////------------------------------//////////////////////////////
const updateProductsStatusById = async ({ prod_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE products 
      SET 
        status=?, 
        updated_at=? 
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, prod_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_STATUS_UPDATED_SUCCESS;
      result.data = { id: prod_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductsMessages.INVALID_PRODUCT_ID;
    } else {
      result.message = "Something Went Wrong";
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
// Update Products OutOfStock Status By Id Service
///////////////------------------------------//////////////////////////////
const updateProductsOutOfStockStatusById = async ({ prod_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: ""
  }
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE products
      SET 
        out_of_stock=?, 
        updated_at=?
      WHERE id=? AND deleted_at IS NULL
    `
    let [res] = await conn.execute(query, [statusBoolean, currentTime, prod_id]);
    console.log('inside query', res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_OUT_OF_STOCK_STATUS;
      result.data = { id: prod_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductsMessages.INVALID_PRODUCT_ID;
    } else {
      result.message = "Something Went Wrong";
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
// Delete Products By Id Service
///////////////------------------------------//////////////////////////////
const deleteProductsById = async ({ prod_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE products SET deleted_at=? WHERE id=?`;
    let [res] = await conn.execute(query, [currentTime, prod_id]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ProductsMessages.PRODUCT_DELETE_SUCCESS;
      result.data = { id: prod_id };
    } else if (res.affectedRows === 0) {
      result.message = ProductsMessages.INVALID_PRODUCT_ID;
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

///////////////// Multiple Images /////////////////

/////////////--------------------------------//////////////////////////////
// Save Product Image By ID Service
///////////////------------------------------//////////////////////////////
const saveProductImageById = async ({ files, product_id }) => {
  const conn = await pool.getConnection();

  try {
    for (let file of files) {

      const fileExtension = file.originalname.split('.').pop();
      const folder = `products`;
      const subfolder = `${product_id}`;
      const customFileName = `product_${product_id}_${Date.now()}`;

      const uploadResult = await uploadFileToServer({
        file,
        folder,
        subfolder,
        customFileName,
        fileExtension
      });

      if (!uploadResult.success) continue;

      const relativePath = `${folder}/${subfolder}/${customFileName}.${fileExtension}`;
      const currentTime = utils.commonFormateDate(new Date());

      await conn.query(
        `INSERT INTO product_images (product_id, url, created_at) VALUES (?, ?, ?)`,
        [product_id, relativePath, currentTime]
      );
    }

    return {
      success: true,
      message: "Images uploaded successfully"
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    conn.release();
  }
};

/////////////--------------------------------//////////////////////////////
// Get All Product Images Service
///////////////------------------------------//////////////////////////////
const getAllProductImages = async () => {

  const result = {
    status: 0,
    message: "",
    data: []
  };

  const conn = await pool.getConnection();

  try {

    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        pi.id AS image_id,
        pi.url,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_images pi
        ON p.id = pi.product_id
    `;

    const [res] = await conn.query(query);

    if (res.length > 0) {

      const productMap = {};

      res.forEach(row => {

        if (!productMap[row.product_id]) {
          productMap[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
            images: []
          };
        }

        if (row.image_id && row.url) {
          productMap[row.product_id].images.push({
            id: row.image_id,
            url: row.url
          });
        }
      });

      result.data = Object.values(productMap);
      result.status = 1;
      result.message = "Product images fetched successfully";

    } else {
      result.message = "No images found";
    }

  } catch (error) {
    result.message = error.message;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Product Image By ID Service
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

    const [rows] = await conn.query(
      `SELECT url FROM product_images WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length || !rows[0].url) {
      return {
        success: false,
        status: 404,
        error: "No Image found for the given ID",
      };
    }

    const serverUrl = getServerRawUrl(rows[0].url);
    const result = await fetchServerFileStream(serverUrl);

    return result;

  } catch (error) {
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
// Delete Product Image By ID Service
///////////////------------------------------//////////////////////////////
const deleteProductImageById = async ({ id }) => {

  const conn = await pool.getConnection();

  let result = {
    success: false,
    status: 500,
    message: "Something went wrong",
  };

  try {

    const [rows] = await conn.query(
      `SELECT url FROM product_images WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      result.status = 404;
      result.message = "Image not found";
      return result;
    }

    const { url } = rows[0];

    if (url) {
      try {
        await deleteFileFromServer({ relativePath: url });
      } catch (err) {
        console.log("File not found on server, skipping...");
      }
    }

    // 🔥 YAHI CHANGE KIYA HAI (UPDATE → DELETE)
    await conn.query(
      `DELETE FROM product_images WHERE id = ?`,
      [id]
    );

    result.success = true;
    result.status = 200;
    result.message = "Image deleted from server and row removed from DB";

    return result;

  } catch (err) {
    result.message = "Internal error while deleting image";
    return result;
  } finally {
    conn.release();
  }
};


module.exports = {
  getAllProducts,
  getProductsById,
  checkBrandById,
  checkCategoryById,
  checkSubCategoryById,
  getActiveProducts,
  checkProductById,
  checkProductByName,
  checkProductByPosition,
  addProducts,
  updateProductsById,
  updateProductsStatusById,
  updateProductsOutOfStockStatusById,
  deleteProductsById,
  saveProductImageById,
  getAllProductImages,
  getProductImageById,
  getProductImageById,
  deleteProductImageById
};
