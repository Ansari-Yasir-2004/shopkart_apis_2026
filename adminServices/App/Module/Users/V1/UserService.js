const pool = require("../../../Config/db.polloingConnection");
const { UsersMessages } = require("../../../Utils/ResponseMessagesCollection");
const utils = require("../../../Utils/Utils");
const bcrypt = require("bcrypt");

/////////////--------------------------------//////////////////////////////
// Get All Users Service
///////////////------------------------------//////////////////////////////
const getAllUsers = async () => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service get all users");

  try {
    let query = `
      SELECT 
        u.id, 
        ua.id AS user_address_id,
        ua.address AS user_address,
        u.name, 
        u.email, 
        u.number, 
        u.block, 
        u.block_reason,
        u.created_at, 
        u.updated_at 
      FROM users u
      LEFT JOIN user_addresses ua
        ON u.id = ua.user_id AND ua.is_default=1
      WHERE u.deleted_at IS NULL
    `;
    let [res] = await conn.query(query);
    console.log("inside query", res);

    if (res && res.length > 0) {
      const formattedRes = res.map((user) => ({
        ...user,
        created_at: user.created_at ?
          utils.commonFormateDate(user.created_at)
          : null,
        updated_at: user.updated_at ?
          utils.commonFormateDate(user.updated_at)
          : null,
      }))

      result.status = 1;
      result.message = UsersMessages.USER_LIST_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = UsersMessages.USER_NOT_FOUND;
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
// Get Users By Id Service
///////////////------------------------------//////////////////////////////
const getUsersById = async ({ user_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service get users by id");

  try {
    let query = `
      SELECT 
        u.id, 
        ua.id AS user_address_id,
        ua.address AS user_address,
        u.name, 
        u.email, 
        u.number, 
        u.block, 
        u.block_reason,
        u.created_at, 
        u.updated_at 
      FROM users u
      LEFT JOIN user_addresses ua
        ON u.id = ua.user_id AND ua.is_default=1
      WHERE u.id=? AND u.deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [user_id]);
    console.log('inside query', res)

    let userRes = res[0];

    if (res && res.length > 0) {
      const formattedRes = {
        ...userRes,
        created_at: userRes.created_at ?
          utils.commonFormateDate(userRes.created_at)
          : null,
        updated_at: userRes.updated_at ?
          utils.commonFormateDate(userRes.updated_at)
          : null,
      }

      result.status = 1;
      result.message = UsersMessages.USER_FETCH_SUCCESS;
      result.data = formattedRes;
    } else {
      result.message = UsersMessages.USER_NOT_FOUND;
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
// check User By Id Service
///////////////------------------------------//////////////////////////////
const checkUserById = async (user_id) => {
  const conn = await pool.getConnection()
  let exists = false

  try {
    let query = `SELECT id FROM users WHERE id=? AND deleted_at IS NULL`
    let queryInjector = [user_id]

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkUserById query', res)

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
// check Users By Number Service
///////////////------------------------------//////////////////////////////
const checkUserByNumber = async (number, excludedId = null) => {
  const conn = await pool.getConnection()
  let findCount = 0

  try {
    let query = `SELECT id FROM users WHERE number=? AND deleted_at IS NULL`
    let queryInjector = [number]

    if (excludedId) {
      query += ` AND id!=?`;
      queryInjector.push(excludedId);
    }

    let [res] = await conn.execute(query, queryInjector)
    console.log('inside checkUserByNumber query', res)

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
// check Users By Email Service
///////////////------------------------------//////////////////////////////
const checkUsersByEmail = async (email, excludedId = null) => {
  const conn = await pool.getConnection()
  let findCount = 0

  try {
    let query = `SELECT id FROM users WHERE email=? AND deleted_at IS NULL`
    let queryInjector = [email]

    if (excludedId) {
      query += ` AND id!=?`
      queryInjector.push(excludedId)
    }

    let [res] = await conn.execute(query, queryInjector)
    console.log("inside checkUsersByEmail query", res)

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
// Add Users Service
///////////////------------------------------//////////////////////////////
const addUsers = async ({ name, email, number, password, }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service add users");

  try {
    let currentTime = utils.commonFormateDate(new Date());
    const hashedPassword = await bcrypt.hash(password, 10);

    let query = `
      INSERT INTO users
        (
          name, 
          email, 
          number, 
          password, 
          created_at, 
          updated_at
        ) 
      VALUES (?, ?, ?, ?, ?, ?)        
    `;
    let [res] = await conn.execute(query, [
      name,
      email,
      number,
      hashedPassword,
      currentTime,
      currentTime,
    ]);
    console.log("inside query", res);

    if (res && res.insertId) {
      result.status = 1;
      result.message = UsersMessages.USER_ADDED_SUCCESS;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      result.message = UsersMessages.EMAIL_ALREADY_EXISTS
    } else {
      result.message = error;
    }
    console.log(error);
  } finally {
    conn.release();
  }

  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Users By Id Service
///////////////------------------------------//////////////////////////////
const updateUsersById = async ({
  user_id,
  name,
  email,
  number,
  password,
}) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();
  console.log("initiate inter service update users");

  try {
    let currentTime = utils.commonFormateDate(new Date());

    let query = "";
    let values = [];

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      query = `
        UPDATE users 
        SET 
          name=?, 
          email=?, 
          number=?, 
          password=?, 
          updated_at=? 
        WHERE id=? AND deleted_at IS NULL
      `;

      values = [
        name,
        email,
        number,
        hashedPassword,
        currentTime,
        user_id,
      ];
    } else {
      query = `
        UPDATE users 
        SET 
          name=?, 
          email=?, 
          number=?, 
          updated_at=? 
        WHERE id=? AND deleted_at IS NULL
      `;

      values = [
        name,
        email,
        number,
        currentTime,
        user_id,
      ];
    }

    let [res] = await conn.execute(query, values);
    console.log("inside query", res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = UsersMessages.USER_UPDATED_SUCCESS;
      result.data = { id: user_id };
    } else if (res.affectedRows === 0) {
      result.message = UsersMessages.USER_NOT_FOUND;
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      result.message = UsersMessages.EMAIL_ALREADY_EXISTS
    } else {
      result.message = error;
    }
    console.log(error);
  } finally {
    conn.release();
  }
  return result;
};

/////////////--------------------------------//////////////////////////////
// Update Users Block Status By Id Service
///////////////------------------------------//////////////////////////////
const updateUsersBlockStatusById = async ({ user_id, statusBoolean, block_reason }) => {
  let result = {
    status: 0,
    message: "",
    data: ""
  }
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `
      UPDATE users
      SET block=?, block_reason=?, updated_at=?
      WHERE id=? AND deleted_at IS NULL
    `;
    let [res] = await conn.execute(query, [statusBoolean, block_reason, currentTime, user_id]);
    console.log('inside query', res);

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = UsersMessages.USER_BLOCK_STATUS_UPDATED_SUCCESS;
      result.data = { id: user_id };
    } else if (res.affectedRows === 0) {
      result.message = UsersMessages.USER_NOT_FOUND;
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
// Delete User By Id Service
///////////////------------------------------//////////////////////////////
const deleteUsersById = async ({ user_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());
    let query = `UPDATE users SET deleted_at=? WHERE id=? AND deleted_at IS NULL`;
    let [res] = await conn.query(query, [currentTime, user_id]);
    console.log('inside query', res)

    if (res && res.affectedRows) {
      result.status = 1;
      result.message = UsersMessages.USER_DELETE_SUCCESS;
      result.data = { id: user_id };
    } else if (res.affectedRows === 0) {
      result.message = UsersMessages.INVALID_USER_ID;
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
// Login Users Service
///////////////------------------------------//////////////////////////////
// const loginUsers = async ({ number, password }) => {
//   let result = {
//     status: 0,
//     message: "",
//     data: "",
//   };
//   const conn = await pool.getConnection();

//   try {
//     let query = `
//       SELECT 
//         id,
//         name,
//         email,   
//         number, 
//         password,  
//         block 
//       FROM users 
//       WHERE number=? AND deleted_at IS NULL 
//       LIMIT 1
//     `;
//     let [res] = await conn.execute(query, [number]);
//     console.log("inside query", res);

//     if (!res.length) {
//       result.message = UsersMessages.INVALID_CREDENTIALS;
//       return result;
//     }

//     let User = res[0];
//     if (User.block === 1) {
//       result.message = UsersMessages.USER_BLOCK;
//       return result;
//     }

//     const isMatch = await bcrypt.compare(password, User.password);
//     if (!isMatch) {
//       result.message = UsersMessages.INVALID_PASSWORD;
//       return result;
//     }

//     result.status = 1;
//     result.message = UsersMessages.USER_LOGIN_SUCCESS;
//     result.data = User;

//   } catch (error) {
//     result.message = error;
//     console.log(error);
//   } finally {
//     conn.release();
//   }
//   return result;
// };

module.exports = {
  getAllUsers,
  getUsersById,
  checkUserById,
  checkUserByNumber,
  checkUsersByEmail,
  addUsers,
  updateUsersById,
  updateUsersBlockStatusById,
  deleteUsersById,
  // loginUsers,
};
