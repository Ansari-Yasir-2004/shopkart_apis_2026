const logger = require("../../../Config/logger.config");
const { UsersMessages } = require("../../../Utils/ResponseMessagesCollection");
const UserService = require("./UserService");
const UserValidations = require("./UserValidations");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../../Config/web.secret").jwt_secret;

/////////////--------------------------------//////////////////////////////
// Get All Users Controller
///////////////------------------------------//////////////////////////////
const getAllUsers = async (req, res, next) => {
  logger.info("get all users controller => list of users");
  try {
    const pc = await UserService.getAllUsers();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Users By Id Controller
///////////////------------------------------//////////////////////////////
const getUsersById = async (req, res, next) => {
  logger.info("get users by id controller => users by id");

  try {
    const user_id = req.params.id;

    await UserValidations.userIdValidate.validateAsync(user_id)

    const pc = await UserService.getUsersById({ user_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add Users Controller
///////////////------------------------------//////////////////////////////
const addUsers = async (req, res, next) => {
  logger.info("add users controller => add users");
  try {
    const { name, email, number, password, address, block, block_reason } = req.body;

    let validateData = await UserValidations.addUserValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (number) {
      const numberCountFound = await UserService.checkUserByNumber(number)
      if (numberCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.NUMBER_ALREADY_EXISTS
        })
      }
    }

    if (email) {
      const emailCountFound = await UserService.checkUsersByEmail(email)
      if (emailCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.EMAIL_ALREADY_EXISTS
        })
      }
    }

    const pc = await UserService.addUsers({
      name,
      email,
      number,
      password,
      address,
      block,
      block_reason
    });

    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Users By Id Controller
///////////////------------------------------//////////////////////////////
const updateUsersById = async (req, res, next) => {
  logger.info("update Users By Id controller => update Users");

  try {
    const user_id = req.params.id;
    const { name, email, number, password, address, block, block_reason } = req.body;

    await UserValidations.userIdValidate.validateAsync(user_id);

    let validateData = await UserValidations.updateUserValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (user_id) {
      const UserExists = await UserService.checkUserById(user_id)
      if (!UserExists) {
        return res.status(404).json({
          status: 0,
          message: UsersMessages.INVALID_USER_ID
        })
      }
    }

    if (number) {
      const numberCountFound = await UserService.checkUserByNumber(number, user_id)
      if (numberCountFound != user_id && numberCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.NUMBER_ALREADY_EXISTS
        })
      }
    }

    if (email) {
      const emailCountFound = await UserService.checkUsersByEmail(email, user_id)
      if (emailCountFound != user_id && emailCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.EMAIL_ALREADY_EXISTS
        })
      }
    }

    const pc = await UserService.updateUsersById({
      user_id,
      name,
      email,
      number,
      password,
      address,
      block,
      block_reason,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Users Block Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateUsersBlockStatusById = async (req, res, next) => {
  logger.info("update users block status by id controller => update users block status");
  try {
    const user_id = req.params.id;
    const UsersBlockStatus = req.params.status;

    await UserValidations.userIdValidate.validateAsync(user_id);
    await UserValidations.userStatusBooleanValidate.validateAsync(UsersBlockStatus);

    const statusBoolean = UsersBlockStatus === "true" ? 1 : 0;

    const pc = await UserService.updateUsersBlockStatusById({ user_id, statusBoolean });
    res.status(200).json(pc)
  } catch (error) {
    ;
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Delete User By Id Controller
///////////////------------------------------//////////////////////////////
const deleteUsers = async (req, res, next) => {
  logger.info("delete users by Id controller => delete users");

  try {
    const user_id = req.params.id;

    await UserValidations.userIdValidate.validateAsync(user_id);

    const pc = await UserService.deleteUsersById({ user_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Register Users Controller
///////////////------------------------------//////////////////////////////
const registerUsers = async (req, res, next) => {
  logger.info("add users controller => add users");
  try {
    const { name, email, number, password, address } = req.body;
    
    let validateData = await UserValidations.registerUserValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (number) {
      const numberCountFound = await UserService.checkUserByNumber(number)
      if (numberCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.NUMBER_ALREADY_EXISTS,
        })
      }
    }

    if (email) {
      const emailCountFound = await UserService.checkUsersByEmail(email)
      if (emailCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: UsersMessages.EMAIL_ALREADY_EXISTS,
        })
      }
    }

    const pc = await UserService.registerUsers({
      name,
      email,
      number,
      password,
      address,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Login Users Controller
///////////////------------------------------//////////////////////////////
const loginUsers = async (req, res, next) => {
  logger.info("login Users controller => login Users")

  try {
    const { number, password } = req.body

    let validateData = await UserValidations.loginUserValidation.validate(req.body)
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message })
    }

    const pc = await UserService.loginUsers({ number, password })
    console.log('login user controller', pc)

    const expiryTime = process.env.JWT_EXPIRY || '2m'

    if (pc.status === 1) {
      const user = pc.data
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: expiryTime ? expiryTime : '2m'
      })
      res.status(200).json({
        token: token,
        user_id: user.id,
        message: UsersMessages.USER_LOGIN_SUCCESS,
      })
    } else {
      res.status(401).json({ message: pc.message })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Invalid Url Parameter" })
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUsersById,
  addUsers,
  updateUsersById,
  updateUsersBlockStatusById,
  deleteUsers,
  registerUsers,
  loginUsers,
};
