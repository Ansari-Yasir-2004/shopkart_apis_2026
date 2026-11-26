const pool = require("../../../Config/db.polloingConnection");
const {
  ContactUsMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All Contact Us Service
///////////////------------------------------//////////////////////////////
const getAllContactUs = async () => {
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
        email, 
        number, 
        message, 
        status, 
        created_at, 
        updated_at 
      FROM contact_us
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((con_us) => ({
        ...con_us,
        created_at: con_us.created_at ?
          utils.commonFormateDate(con_us.created_at)
          : null,
        updated_at: con_us.updated_at ?
          utils.commonFormateDate(con_us.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = ContactUsMessages.CONTACT_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = ContactUsMessages.CONTACT_NOT_FOUND;
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
// Get Contact Us By Id Service
///////////////------------------------------//////////////////////////////
const getContactUsById = async ({ con_us_id }) => {
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
        email, 
        number, 
        message, 
        status, 
        created_at, 
        updated_at 
      FROM contact_us 
      WHERE id=?
    `;
    let [res] = await conn.execute(query, [con_us_id]);
    console.log("inside query", res);

    let conUsRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...conUsRes,
        created_at: conUsRes.created_at ?
          utils.commonFormateDate(conUsRes.created_at)
          : null,
        updated_at: conUsRes.updated_at ?
          utils.commonFormateDate(conUsRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = ContactUsMessages.CONTACT_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = ContactUsMessages.CONTACT_NOT_FOUND;
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
// Add Contact Us Service
///////////////------------------------------//////////////////////////////
const addContactUs = async ({ name, email, number, message, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      INSERT INTO contact_us 
        (
          name, 
          email, 
          number, 
          message, 
          status, 
          created_at, 
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    let [res] = await conn.execute(query, [
      name,
      email,
      number,
      message,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = ContactUsMessages.CONTACT_ADDED_SUCCESS;
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
// Update Contact Us By Id Service
///////////////------------------------------//////////////////////////////
const updateContactUsById = async ({ con_us_id, name, email, number, message, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE contact_us 
      SET 
        name=?, 
        email=?, 
        number=?, 
        message=?, 
        status=?, 
        updated_at=? 
      WHERE id=?
    `;
    let [res] = await conn.query(query, [
      name,
      email,
      number,
      message,
      status,
      currentTime,
      con_us_id,
    ]);
    console.log("inside query", res);
    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ContactUsMessages.CONTACT_UPDATED_SUCCESS;
      result.data = { id: con_us_id };
    } else if (res.affectedRows === 0) {
      result.message = ContactUsMessages.CONTACT_NOT_FOUND;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result
};

/////////////--------------------------------//////////////////////////////
// Update Contact Us Status By Id Service
///////////////------------------------------//////////////////////////////
const updateContactUsStatusById = async ({ con_us_id, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  }
  const conn = await pool.getConnection()

  try {
    let currentTime = utils.commonFormateDate(new Date())
    let query = `UPDATE contact_us SET status=?, updated_at=? WHERE id=?`
    let [res] = await conn.execute(query, [status, currentTime, con_us_id])
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = ContactUsMessages.CONTACT_STATUS_UPDATED_SUCCESS;
      result.data = { id: con_us_id }
    } else if (res.affectedRows === 0) {
      result.message = ContactUsMessages.CONTACT_NOT_FOUND
    } else {
      result.message = "Something went wrong"
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
// Delete Contact Us By Id Service
///////////////------------------------------//////////////////////////////
const deleteContactUsById = async ({ con_us_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `DELETE FROM contact_us WHERE id=?`;
    let [res] = await conn.execute(query, [con_us_id]);

    if (res && res.affectedRows === 1) {
      result.status = 1;
      result.message = ContactUsMessages.CONTACT_DELETE_SUCCESS;
      result.data = { id: con_us_id };
    } else if (res.affectedRows === 0) {
      result.message = ContactUsMessages.CONTACT_NOT_FOUND;
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

module.exports = {
  getAllContactUs,
  getContactUsById,
  addContactUs,
  updateContactUsById,
  updateContactUsStatusById,
  deleteContactUsById,
};
