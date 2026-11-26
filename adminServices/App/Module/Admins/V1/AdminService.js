const pool = require("../../../Config/db.polloingConnection");
const { AdminsMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");
const bcrypt = require("bcrypt");

/////////////--------------------------------//////////////////////////////
// Get All Admins Service
///////////////------------------------------//////////////////////////////
const getAllAdmins = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service get all admins");

  try {
    let query = `
      SELECT 
        id, 
        name, 
        email, 
        number, 
        address, 
        block, 
        block_reason, 
        created_at, 
        updated_at 
      FROM admins
      WHERE deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((admin) => ({
        ...admin,
        created_at: admin.created_at ?
          utils.commonFormateDate(admin.created_at)
          : null,
        updated_at: admin.updated_at ?
          utils.commonFormateDate(admin.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = AdminsMessages.ADMIN_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = AdminsMessages.ADMIN_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
  } finally {
    conn.release();
  }
  return result;
};

/////////////--------------------------------//////////////////////////////
// Get Admins By Id Service
///////////////------------------------------//////////////////////////////
const getAdminsById = async ({ admn_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service get admins by id");

  try {
    let query = `
      SELECT 
        id, 
        name, 
        email, 
        number, 
        address, 
        block, 
        block_reason, 
        created_at, 
        updated_at 
      FROM admins 
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [admn_id]);
    console.log('inside query', res)

    let adminRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...adminRes,
        created_at: adminRes.created_at ?
          utils.commonFormateDate(adminRes.created_at)
          : null,
        updated_at: adminRes.updated_at ?
          utils.commonFormateDate(adminRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = AdminsMessages.ADMIN_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = AdminsMessages.ADMIN_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// check Admin By Id Service
///////////////------------------------------//////////////////////////////
const checkAdminById = async (admn_id) => {
  const conn = await pool.getConnection()
  let exists = false

  try {
    let query = `SELECT id FROM admins WHERE id=? AND deleted_at IS NULL`
    let queryInjector = [admn_id]

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkAdminById query', res)

    if (res.length > 0) {
      exists = true
    }
  } catch (error) {
    console.log("error occured", error)
  } finally {
    conn.release()
  }

  return exists;
}

/////////////--------------------------------//////////////////////////////
// check Admins By Number Service
///////////////------------------------------//////////////////////////////
const checkAdminByNumber = async (number, excludedId = null) => {
  const conn = await pool.getConnection()
  let findCount = 0

  try {
    let query = `SELECT id FROM admins WHERE number=? AND deleted_at IS NULL`
    let queryInjector = [number]

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkAdminByNumber query', res)

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

  return findCount;
}

/////////////--------------------------------//////////////////////////////
// check Admins By Email Service
///////////////------------------------------//////////////////////////////
const checkAdminsByEmail = async (email, excludedId = null) => {
  const conn = await pool.getConnection()
  let findCount = 0

  try {
    let query = `SELECT id FROM admins WHERE email=? AND deleted_at IS NULL`
    let queryInjector = [email]

    if (excludedId) {
      query += ` AND id!=?`
      queryInjector.push(excludedId)
    }

    let [res] = await conn.execute(query, queryInjector)
    console.log("inside checkAdminsByEmail query", res)

    if (res.length > 0) {
      findCount = res[0].id
    } else {
      findCount = 0
    }
  } catch (error) {
    console.log("error occured", error)
  } finally {
    conn.release()
  }

  return findCount;
}

/////////////--------------------------------//////////////////////////////
// Add Admins Service
///////////////------------------------------//////////////////////////////
const addAdmins = async ({ name, email, number, password, address }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service add admins");

  try {
    let currentTime = utils.commonFormateDate(new Date());
    const hashedPassword = await bcrypt.hash(password, 10);

    let query = `
      INSERT INTO admins
        (
          name, 
          email, 
          number, 
          password, 
          address,  
          created_at, 
          updated_at
        ) 
      VALUES (?, ?, ?, ?, ?, ?, ?)        
    `;
    let [res] = await conn.execute(query, [
      name,
      email,
      number,
      hashedPassword,
      address,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = AdminsMessages.ADMIN_ADDED_SUCCESS;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      result.message = AdminsMessages.EMAIL_ALREADY_EXISTS
    } else {
      result.message = error;
    }
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Admins By Id Service
///////////////------------------------------//////////////////////////////
const updateAdminsById = async ({
  admn_id,
  name,
  email,
  number,
  password,
  address,
}) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service update admins");

  try {
    let currentTime = utils.commonFormateDate(new Date());

    let query = "";
    let values = [];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)

      query = `
        UPDATE admins 
        SET 
          name=?, 
          email=?, 
          number=?, 
          password=?,
          address=?, 
          updated_at=? 
        WHERE id=? AND deleted_at IS NULL
      `

      values = [
        name,
        email,
        number,
        hashedPassword,
        address,
        currentTime,
        admn_id,
      ]
    } else {
      query = `
        UPDATE admins 
        SET 
          name=?, 
          email=?, 
          number=?, 
          address=?, 
          updated_at=? 
        WHERE id=? AND deleted_at IS NULL
      `

      values = [
        name,
        email,
        number,
        address,
        currentTime,
        admn_id,
      ]
    }

    let [res] = await conn.execute(query, values);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AdminsMessages.ADMIN_UPDATED_SUCCESS;
      result.data = { id: admn_id };
    } else if (res.affectedRows === 0) {
      result.message = AdminsMessages.ADMIN_NOT_FOUND;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      result.message = AdminsMessages.EMAIL_ALREADY_EXISTS
    } else {
      result.message = error;
    }
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Admins Block Status By Id Service
///////////////------------------------------//////////////////////////////
const updateAdminsBlockStatusById = async ({ admn_id, statusBoolean, block_reason }) => {
  let result = {
    status: 0,
    message: "",
    data: ""
  }
  const conn = await pool.getConnection();
  console.log("initiate update admin block status service")

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE admins
      SET block=?, block_reason=?, updated_at=?
      WHERE id=? AND deleted_at IS NULL
    `
    let [res] = await conn.execute(query, [statusBoolean, block_reason, currentTime, admn_id]);
    console.log('inside query', res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AdminsMessages.ADMIN_BLOCK_STATUS_UPDATED_SUCCESS;
      result.data = { id: admn_id };
    } else if (res.affectedRows === 0) {
      result.message = AdminsMessages.ADMIN_NOT_FOUND;
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
}

/////////////--------------------------------//////////////////////////////
// Delete Admin By Id Service
///////////////------------------------------//////////////////////////////
const deleteAdminsById = async ({ admn_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE admins SET deleted_at=? WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.query(query, [currentTime, admn_id]);
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = AdminsMessages.ADMIN_DELETE_SUCCESS;
      result.data = { id: admn_id };
    } else if (res.affectedRows === 0) {
      result.message = AdminsMessages.INVALID_ADMIN_ID
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
// Login Admins Service
///////////////------------------------------//////////////////////////////
const loginAdmins = async ({ number, password }) => {
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
        password,  
        block 
      FROM admins 
      WHERE number=? AND deleted_at IS NULL 
      LIMIT 1
    `;
    let [res] = await conn.execute(query, [number]);
    console.log("inside query", res);

    if (!res.length) {
      result.message = AdminsMessages.INVALID_CREDENTIALS;
      return result;
    }

    let admin = res[0];
    if (admin.block === 1) {
      result.message = AdminsMessages.ADMIN_BLOCK;
      return result;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      result.message = AdminsMessages.INVALID_PASSWORD;
      return result;
    }

    result.status = 1;
    result.message = AdminsMessages.ADMIN_LOGIN_SUCCESS;
    result.data = admin;

  } catch (error) {
    result.message = error;
    console.log(error)
  } finally {
    conn.release();
  }

  return result;
};

module.exports = {
  getAllAdmins,
  getAdminsById,
  checkAdminById,
  checkAdminByNumber,
  checkAdminsByEmail,
  addAdmins,
  updateAdminsById,
  updateAdminsBlockStatusById,
  deleteAdminsById,
  loginAdmins,
};
