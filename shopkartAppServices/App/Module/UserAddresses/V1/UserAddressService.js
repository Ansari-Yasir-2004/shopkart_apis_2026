const pool = require("../../../Config/db.polloingConnection");
const utils = require("../../../Utils/Utils");
const {
  UserAddressMessages,
} = require("../../../Utils/ResponseMessagesCollection");

///////////////------------------------------//////////////////////////////
// GET ALL ADDRESSES SERVICE
///////////////------------------------------//////////////////////////////
const getAllUserAddresses = async ({ user_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();
  console.log("initiate inter service get all addresses");

  try {
    let query = `
      SELECT 
        id,
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
        updated_at
      FROM user_addresses
      WHERE user_id = ?
      ORDER BY is_default DESC
    `;

    let [res] = await conn.query(query, [user_id]);

    if (res && res.length > 0) {
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
// ADD  USER ADDRESS SERVICE 
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
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();
  console.log("initiate inter sERVICE add address");

  try {
    let currentTime = utils.commonFormateDate(new Date());

    //  check first address
    let [existing] = await conn.query(
      "SELECT id FROM user_addresses WHERE user_id = ?",
      [user_id],
    );

    let isDefault = existing.length === 0 ? 1 : 0;

    let query = `
      INSERT INTO user_addresses
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
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    let [res] = await conn.execute(query, [
      user_id,
      country,
      state,
      city,
      building,
      area,
      landmark,
      address,
      isDefault,
      currentTime,
      currentTime,
    ]);

    if (res && res.insertId) {
      result.status = 1;
      result.message = UserAddressMessages.ADDRESS_CREATED;
      result.data = { id: res.insertId };
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

///////////////------------------------------//////////////////////////////
// SET DEFAULT USER ADDRESS SERVICE
///////////////------------------------------//////////////////////////////
const setDefaultUserAddress = async ({ user_id, addrs_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();
  console.log("initiate inter service set default address");

  try {
    await conn.beginTransaction();

    // sabko 0
    await conn.query(
      "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
      [user_id],
    );

    // ek ko 1
    let [res] = await conn.query(
      "UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?",
      [addrs_id, user_id],
    );

    if (res.affectedRows === 0) {
      await conn.rollback();
      result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
      return result;
    }

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
// DELETE User Adress SERVICE
///////////////------------------------------//////////////////////////////
const deleteUserAddress = async ({ user_id, addrs_id }) => {
  let result = {
    status: 0,
    message: "",
    data: "",
  };

  const conn = await pool.getConnection();

  try {
    /////////////////////
    // CHECK ADDRESS
    /////////////////////
    let [address] = await conn.query(
      "SELECT id FROM user_addresses WHERE id=? AND user_id=?",
      [addrs_id, user_id],
    );

    if (address.length === 0) {
      result.message = UserAddressMessages.ADDRESS_NOT_FOUND;
      return result;
    }

    ///////////////////////////////////////////
    // DELETE
    //////////////////////////////////////////
    let [res] = await conn.query(
      "DELETE FROM user_addresses WHERE id=? AND user_id=?",
      [addrs_id, user_id],
    );

    if (res.affectedRows > 0) {
      result.status = 1;
      result.message = "Address deleted successfully";
    } else {
      result.message = "Something went wrong";
    }
  } catch (error) {
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
