const pool = require("../../../Config/db.polloingConnection");
const { AppBannersMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");
const { uploadFileToServer, getServerRawUrl, fetchServerFileStream, deleteFileFromServer } = require("../../../Utils/uploadFile.js");

/////////////--------------------------------//////////////////////////////
// Get All App Banners Service
///////////////------------------------------//////////////////////////////
const getAllAppBanners = async () => {
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
        title,
        description,
        url,
        position,
        status,
        created_at,
        updated_at
      FROM app_banners
      WHERE deleted_at IS NULL
      ORDER BY position
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((ap_bnr) => ({
        ...ap_bnr,
        created_at: ap_bnr.created_at ?
          utils.commonFormateDate(ap_bnr.created_at)
          : null,
        updated_at: ap_bnr.updated_at ?
          utils.commonFormateDate(ap_bnr.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = AppBannersMessages.APP_BANNER_NOT_FOUND;
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
// Get App Banners By Id Service
///////////////------------------------------//////////////////////////////
const getAppBannersById = async ({ ap_bnr_id }) => {
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
        title,
        description,
        url,
        position,
        status,
        created_at,
        updated_at
      FROM app_banners
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [ap_bnr_id]);
    console.log('inside query', res)

    let apBnrRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...apBnrRes,
        created_at: apBnrRes.created_at ?
          utils.commonFormateDate(apBnrRes.created_at)
          : null,
        updated_at: apBnrRes.updated_at ?
          utils.commonFormateDate(apBnrRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = AppBannersMessages.APP_BANNER_NOT_FOUND;
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
// Check App Banners By Id Service
///////////////------------------------------//////////////////////////////
const checkAppBannersById = async (ap_bnr_id) => {
  const conn = await pool.getConnection()
  let exists = false

  try {
    let query = `SELECT id FROM app_banners WHERE id=? AND deleted_at IS NULL`
    let queryInjector = [ap_bnr_id]

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkAppBannersById query', res)

    if (res.length > 0) {
      exists = true
    }
  } catch (error) {
    console.log('error occured', error)
  } finally {
    conn.release()
  }

  return exists;
}

/////////////--------------------------------//////////////////////////////
// Check App Banners By Position Service
///////////////------------------------------//////////////////////////////
const checkAppBannersByPosition = async (position, excludedId = null) => {
  const conn = await pool.getConnection()
  let findCount = 0

  try {
    let query = `SELECT id FROM app_banners WHERE position=? AND deleted_at IS NULL`
    let queryInjector = [position]

    if (excludedId) {
      query += ` AND id!=?`
      queryInjector.push(excludedId)
    }

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkAppBannersByPosition query', res)

    if (res.length > 0) {
      findCount = res[0].id
    } else {
      findCount = 0
    }
  } catch (error) {
    console.log('error occured', error)
  } finally {
    conn.release()
  }

  return findCount
}

/////////////--------------------------------//////////////////////////////
// Add App Banners Service
///////////////------------------------------//////////////////////////////
const addAppBanners = async ({ title, description, position, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      INSERT INTO app_banners 
        (
          title, 
          description, 
          position, 
          status, 
          created_at, 
          updated_at
        ) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    let [res] = await conn.execute(query, [
      title,
      description,
      position,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_ADDED_SUCCESS;
      result.data = { id: res.insertId };
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
// Update App Banners By Id Service
///////////////------------------------------//////////////////////////////
const updateAppBannersById = async ({
  ap_bnr_id,
  title,
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
    let query = `
      UPDATE app_banners 
      SET 
        title=?, 
        description=?, 
        position=?, 
        status=?, 
        updated_at=? 
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [
      title,
      description,
      position,
      status,
      currentTime,
      ap_bnr_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_UPDATED_SUCCESS;
      result.data = { id: ap_bnr_id };
    } else if (res.affectedRows === 0) {
      result.message = AppBannersMessages.APP_BANNER_NOT_FOUND;
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
// Update App Banners Status By Id Service
///////////////------------------------------//////////////////////////////
const updateAppBannersStatusById = async ({ ap_bnr_id, statusBoolean }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE app_banners SET status=?, updated_at=? WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [statusBoolean, currentTime, ap_bnr_id]);
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_STATUS_UPDATED_SUCCESS;
      result.data = { id: ap_bnr_id };
    } else if (res.affectedRows === 0) {
      result.message = AppBannersMessages.APP_BANNER_NOT_FOUND;
    } else {
      result.message = "Somthing went wrong";
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
// Delete App Banners By Id Service
///////////////------------------------------//////////////////////////////
const deleteAppBannersById = async ({ ap_bnr_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date())
    let query = `UPDATE app_banners SET deleted_at=? WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.execute(query, [currentTime, ap_bnr_id]);
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_DELETE_SUCCESS;
      result.data = { id: ap_bnr_id };
    } else if (res.affectedRows === 0) {
      result.message = AppBannersMessages.APP_BANNER_NOT_FOUND;
    } else {
      result.message = "something Went Wrong";
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
const saveAppBannerImageById = async ({ file, CId }) => {
  const conn = await pool.getConnection();

  try {
    // Step 1: Check if the ID exists
    const [rows] = await conn.query(
      `SELECT id FROM app_banners WHERE id = ? LIMIT 1`,
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
    const folder = `app_banners`;
    const subfolder = `${CId}`;
    const customFileName = `app_banners${CId}_${Date.now()}`;

    const uploadResult = await uploadFileToServer({
      file,
      folder,
      subfolder,
      commitMessage: `Upload AppBanner image for ID ${CId}`,
      customFileName,
      fileExtension,

    });

    if (!uploadResult.success) return uploadResult;

    const { download_url } = uploadResult.data;

    // Step 3: Update DB with the Server SHA
    const relativePath = `${folder}/${subfolder}/${customFileName}.${fileExtension}`;
    const query = `UPDATE app_banners SET url = ? WHERE id = ?`;
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
const getAppBannerImageById = async ({ id }) => {
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
      `SELECT url FROM app_banners WHERE id = ? LIMIT 1`,
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
const deleteAppBannerImageById = async ({ id }) => {
  const conn = await pool.getConnection();
  let result = {
    success: false,
    status: 500,
    message: "Something went wrong",
  };

  try {
    // Step 1: Get image URL (used as SHA or Server identifier)
    const [rows] = await conn.query(
      `SELECT url FROM app_banners WHERE id = ? LIMIT 1`,
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
      `UPDATE app_banners SET url = '' WHERE id = ?`,
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
  getAllAppBanners,
  getAppBannersById,
  checkAppBannersById,
  checkAppBannersByPosition,
  addAppBanners,
  updateAppBannersById,
  updateAppBannersStatusById,
  deleteAppBannersById,
  saveAppBannerImageById,
  getAppBannerImageById,
  deleteAppBannerImageById

};
