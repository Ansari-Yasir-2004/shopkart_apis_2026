const pool = require("../../../Config/db.polloingConnection");
const utils = require("../../../Utils/Utils");
const {
  UserAddressMessages,
} = require("../../../Utils/ResponseMessagesCollection");

///////////////------------------------------//////////////////////////////
// GET ALL ADDRESSES Service
///////////////------------------------------//////////////////////////////
const getAllUserAddresses = async () => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    let query = `
      SELECT 
        ua.id,
        ua.user_id,
        u.name,
        u.email,
        u.number,
        ua.country,
        ua.state,
        ua.city,
        ua.building,
        ua.area,
        ua.landmark,
        ua.address,
        ua.is_default,
        ua.created_at,
        ua.updated_at
      FROM user_addresses ua
      LEFT JOIN users u ON u.id = ua.user_id
      ORDER BY ua.id DESC
    `;

    let [res] = await conn.query(query);

    if (res.length) {
      result.status = 1;
      result.message = UserAddressMessages.ADDRESS_FETCHED;
      result.data = res;
    } else {
      result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
    }
  } catch (error) {
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

///////////////------------------------------//////////////////////////////
// ADD  User Address Service
///////////////------------------------------//////////////////////////////
const addUserAddress = async ({
  user_id,
  country,
  state,
  city,
  building,
  area,
  landmark,
  address,
}) => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    let currentTime = utils.commonFormateDate(new Date());

    let [existing] = await conn.query(
      "SELECT id FROM user_addresses WHERE user_id = ?",
      [user_id],
    );

    let isDefault = existing.length === 0 ? 1 : 0;

    let [res] = await conn.execute(
      `INSERT INTO user_addresses
      (

      user_id,
       country, 
       state, 
       city, 
       building,
       area, 
       landmark,
       address, 
       is_default,
       created_at,
       updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        country ,
        state,
        city,
        building,
        area,
        landmark,
        address,
        isDefault,
        currentTime,
        currentTime,
      ],
    );

    if (res.insertId) {
      result.status = 1;
      result.message = UserAddressMessages.ADDRESS_CREATED;
      result.data = { id: res.insertId };
    } else {
      result.message = "Something Went Wrong";
    }
  } catch (error) {
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

///////////////------------------------------//////////////////////////////
// SET DEFAULT  Adress Service
///////////////------------------------------//////////////////////////////
// const setDefaultUserAddress = async ({ user_id, addrs_id }) => {
//   let result = {
//     status: 0, 
//     message: "", 
//     data: "" 
// };
//   const conn = await pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     // reset
//     await conn.query(
//       "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
//       [user_id],
//     );

//     // set one
//     let [res] = await conn.query(
//       "UPDATE user_addresses SET is_default = 1 WHERE id = ?",
//       [addrs_id],
//     );

//     if (res.affectedRows === 0) {
//       await conn.rollback();
//       result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
//       return result;
//     }

//     await conn.commit();

//     result.status = 1;
//     result.message = UserAddressMessages.ADDRESS_DEFAULT_SET;
//   } catch (error) {
//     await conn.rollback();
//     result.message = error;
//   } finally {
//     conn.release();
//   }

//   return result;
// };

const setDefaultUserAddress = async ({ addrs_id }) => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 🔥 get user_id from address
    let [address] = await conn.query(
      "SELECT user_id FROM user_addresses WHERE id=?",
      [addrs_id]
    );

    if (!address.length) {
      result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
      return result;
    }

    const user_id = address[0].user_id;

    // reset
    await conn.query(
      "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
      [user_id]
    );

    // set one
    await conn.query(
      "UPDATE user_addresses SET is_default = 1 WHERE id = ?",
      [addrs_id]
    );

    await conn.commit();

    result.status = 1;
    result.message = UserAddressMessages.ADDRESS_DEFAULT_SET;

  } catch (error) {
    await conn.rollback();
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

///////////////------------------------------//////////////////////////////
// DELETE ADDRESS Service
///////////////------------------------------//////////////////////////////
const deleteUserAddress = async ({ addrs_id }) => {
  let result = { status: 0, message: "", data: "" };
  const conn = await pool.getConnection();

  try {
    // check exist
    let [address] = await conn.query(
      "SELECT user_id, is_default FROM user_addresses WHERE id=?",
      [addrs_id],
    );

    if (!address.length) {
      result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
      return result;
    }

    const { user_id, is_default } = address[0];

    await conn.beginTransaction();

    // delete
    await conn.query("DELETE FROM user_addresses WHERE id=?", [addrs_id]);

    // agar default delete hua → new default set kar
    if (is_default === 1) {
      let [next] = await conn.query(
        "SELECT id FROM user_addresses WHERE user_id=? LIMIT 1",
        [user_id],
      );

      if (next.length) {
        await conn.query("UPDATE user_addresses SET is_default=1 WHERE id=?", [
          next[0].id,
        ]);
      }
    }

    await conn.commit();

    result.status = 1;
    result.message = "Address deleted successfully";
  } catch (error) {
    await conn.rollback();
    result.message = error;
  } finally {
    conn.release();
  }

  return result;
};

module.exports = {
  getAllUserAddresses,
  addUserAddress,
  setDefaultUserAddress,
  deleteUserAddress,
};
