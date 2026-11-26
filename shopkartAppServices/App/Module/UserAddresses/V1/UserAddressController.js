const UserAddressService = require("./UserAddressService");
const UserAddressValidations = require("./UserAddressValidation");
const logger = require("../../../Config/logger.config");

/////////////--------------------------------//////////////////////////////
// GET ADDRESSES Controller
/////////////--------------------------------//////////////////////////////

getAllUserAddresses = async (req, res, next) => {
  logger.info("get all address controller");

  try {
    const user_id = req.user.id;

    await UserAddressValidations.IdValidate.validateAsync(user_id);

    const result = await UserAddressService.getAllUserAddresses({ user_id });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// ADD ADDRESS Controller
/////////////--------------------------------//////////////////////////////
addUserAddress = async (req, res, next) => {
  logger.info("add address controller");

  try {
    const user_id = req.user.id;
    const {
      country,
      state,
      city,
      building,
      area,
      landmark,
      address,
      is_default,
    } = req.body;

    await UserAddressValidations.IdValidate.validateAsync(user_id);

    let validateData =
      await UserAddressValidations.addAddressValidation.validate(req.body);

    if (validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const pc = await UserAddressService.addUserAddress({
      user_id,
      country,
      state,
      city,
      building,
      area,
      landmark,
      address,
      is_default,
    });

    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// SET DEFAULT Controller
/////////////--------------------------------//////////////////////////////
setDefaultUserAddress = async (req, res, next) => {
  logger.info("set default address controller");

  try {
    const user_id = req.user.id;
    const addrs_id = req.params.id;

    await UserAddressValidations.IdValidate.validate(user_id);
    await UserAddressValidations.IdValidate.validateAsync(addrs_id);

    const result = await UserAddressService.setDefaultUserAddress({
      user_id,
      addrs_id,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

deleteUserAddress = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const addrs_id = req.params.id;

    await UserAddressValidations.IdValidate.validateAsync(addrs_id);

    const result = await UserAddressService.deleteUserAddress({
      user_id,
      addrs_id,
    });

    res.status(200).json(result);
  } catch (error) {
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
