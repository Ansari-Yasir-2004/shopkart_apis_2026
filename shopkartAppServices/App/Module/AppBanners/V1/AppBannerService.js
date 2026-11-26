const { error } = require("winston");
const pool = require("../../../Config/db.polloingConnection");
const { AppBannersMessages } = require("../../../Utils/ResponseMessagesCollection");
const { getServerRawUrl, fetchServerFileStream } = require("../../../Utils/uploadFile");

/////////////--------------------------------//////////////////////////////
// Get Actve App Banners Service
///////////////------------------------------//////////////////////////////
const getActiveAppBanners = async () => {
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
      WHERE status=1 AND deleted_at IS NULL
      ORDER BY position
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = AppBannersMessages.APP_BANNER_LIST_FETCH_SUCCESS;
      result.data = res;
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
// Get App Banners Image By Id Service
///////////////------------------------------//////////////////////////////
const getAppBannersImageById = async ({ id }) => {
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
      `SELECT url FROM app_banners WHERE id=? LIMIT 1`,
      [id]
    );
    console.log("inside rows", rows);

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
  getActiveAppBanners,
  getAppBannersImageById,
};
