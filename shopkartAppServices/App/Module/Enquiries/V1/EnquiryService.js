const pool = require("../../../Config/db.polloingConnection");
const {
  EnquiriesMessages,
} = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");

/////////////--------------------------------//////////////////////////////
// Get All Enquiries Service
///////////////------------------------------//////////////////////////////
const getAllEnquiries = async () => {
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
        email, 
        number, 
        description, 
        status,
        created_at, 
        updated_at 
      FROM enquiries
    `;
    let [res] = await conn.execute(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_LIST_FETCH_SUCCESS;
      result.data = res;
    } else {
      result.message = EnquiriesMessages.ENQUIRY_NOT_FOUND;
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
// Get Enquiries By Id Service
///////////////------------------------------//////////////////////////////
const getEnquiriesById = async ({ enq_id }) => {
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
        email, 
        number, 
        description,
        status, 
        created_at, 
        updated_at 
      FROM enquiries
      WHERE id=?
    `;
    let [res] = await conn.execute(query, [enq_id]);
    console.log('inside query', res);

    if (res && res.length > 0) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_FETCH_SUCCESS;
      result.data = res[0];
    } else {
      result.message = EnquiriesMessages.ENQUIRY_NOT_FOUND;
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
// Add Enquiries Service
///////////////------------------------------//////////////////////////////
const addEnquiries = async ({ name, email, number, description, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      INSERT INTO enquiries
        (
          name, 
          email, 
          number, 
          description, 
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
      description,
      status,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_ADDED_SUCCESS;
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
// Update Enquiries By Id Service
///////////////------------------------------//////////////////////////////
const updateEnquiriesById = async ({
  enq_id,
  name,
  email,
  number,
  description,
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
      UPDATE enquiries 
      SET 
        name=?, 
        email=?, 
        number=?, 
        description=?, 
        status=?, 
        updated_at=? 
      WHERE id=?
    `;
    let [res] = await conn.query(query, [
      name,
      email,
      number,
      description,
      status,
      currentTime,
      enq_id,
    ]);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_UPDATED_SUCCESS;
      result.data = { id: enq_id };
    } else if (res.affectedRows === 0) {
      result.message = EnquiriesMessages.ENQUIRY_NOT_FOUND;
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
// Update Enquiries Status By Id Service
///////////////------------------------------//////////////////////////////
const updateEnquiriesStatusById = async ({ enq_id, status }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  }
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date())
    let query = `UPDATE enquiries SET status=?, updated_at=? WHERE id=?`
    let [res] = await conn.execute(query, [status, currentTime, enq_id])
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_STATUS_UPDATED_SUCCESS;
      result.data = { id: enq_id }
    } else if (res.affectedRows === 0) {
      result.message = EnquiriesMessages.ENQUIRY_NOT_FOUND
    } else {
      result.message = "something went wrong"
    }
  } catch (error) {
    result.message = error;
    console.log(error);
  } finally {
    conn.release()
  }

  return result;
}

/////////////--------------------------------//////////////////////////////
// Delete Enquiries By Id Service
///////////////------------------------------//////////////////////////////
const deleteEnquiriesById = async ({ enq_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let query = `DELETE FROM enquiries WHERE id=?`;
    let [res] = await conn.execute(query, [enq_id]);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = EnquiriesMessages.ENQUIRY_DELETE_SUCCESS;
      result.data = { id: enq_id };
    } else if (res.affectedRows === 0) {
      result.message = EnquiriesMessages.ENQUIRY_NOT_FOUND;
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
  getAllEnquiries,
  getEnquiriesById,
  addEnquiries,
  updateEnquiriesById,
  updateEnquiriesStatusById,
  deleteEnquiriesById,
};
