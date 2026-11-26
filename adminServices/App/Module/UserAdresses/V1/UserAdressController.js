const UserAddressService = require("./UserAdressService");
const UserAddressValidations = require("./UserAdressValidations");
const logger = require("../../../Config/logger.config");

///////////////------------------------------//////////////////////////////
// GET ALL User Adress Controller
///////////////------------------------------//////////////////////////////
getAllUserAddresses = async (req, res, next) => {
  logger.info("admin get all addresses");

  try {
    const result = await UserAddressService.getAllUserAddresses();

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
    next(error);
  }
};

///////////////------------------------------//////////////////////////////
// ADD  User Address Controller
///////////////------------------------------//////////////////////////////
addUserAddress = async (req, res, next) => {
  logger.info("admin add address");

  try {
    const {
      user_id,
      country,
      state,
      city,
      building,
      area,
      landmark,
      address,
    } = req.body;

    // 🔥 user_id required for admin
    await UserAddressValidations.IdValidate.validateAsync(user_id);

    let validateData =
      await UserAddressValidations.addAddressValidation.validate(req.body);

    if (validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const result = await UserAddressService.addUserAddress({
      user_id,
      country,
      state,
      city,
      building,
      area,
      landmark,
      address,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Data" });
    next(error);
  }
};

///////////////------------------------------//////////////////////////////
// SET DEFAULT User Address Controller
///////////////------------------------------//////////////////////////////
// setDefaultUserAddress = async (req, res, next) => {
//   logger.info("admin set default address");

//   try {
//     const { user_id } = req.body;
//     const addrs_id = req.params.id;

//     await UserAddressValidations.IdValidate.validateAsync(addrs_id);
//     await UserAddressValidations.IdValidate.validateAsync(user_id);

//     const result = await UserAddressService.setDefaultUserAddress({
//       user_id,
//       addrs_id,
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "Invalid Data" });
//     next(error);
//   }
// };

setDefaultUserAddress = async (req, res, next) => {
  logger.info("admin set default address");

  try {
    const addrs_id = req.params.id;

    await UserAddressValidations.IdValidate.validateAsync(addrs_id);

    const result = await UserAddressService.setDefaultUserAddress({
      addrs_id,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message || "Invalid Data" });
    next(error);
  }
};

///////////////------------------------------//////////////////////////////
// DELETE  User Adress Controller
///////////////------------------------------//////////////////////////////
deleteUserAddress = async (req, res, next) => {
  logger.info("admin delete address");

  try {
    const addrs_id = req.params.id;

    await UserAddressValidations.IdValidate.validateAsync(addrs_id);

    const result = await UserAddressService.deleteUserAddress({ addrs_id });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

module.exports = {
  getAllUserAddresses,
  addUserAddress,
  setDefaultUserAddress,
  deleteUserAddress,
};