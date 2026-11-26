const logger = require("../../../Config/logger.config");
const { AdminsMessages } = require("../../../Utils/ResponseMessagesCollection");
const AdminService = require("./AdminService");
const AdminValidations = require("./AdminValidations");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../../Config/web.secret").jwt_secret;

/////////////--------------------------------//////////////////////////////
// Get All Admins Controller
///////////////------------------------------//////////////////////////////
const getAllAdmins = async (req, res, next) => {
  logger.info("get all admins controller => list of admins");
  try {
    const pc = await AdminService.getAllAdmins();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Admins By Id Controller
///////////////------------------------------//////////////////////////////
const getAdminsById = async (req, res, next) => {
  logger.info("get admins by id controller => admins by id");
  try {
    const admn_id = req.params.id;

    await AdminValidations.adminIdValidate.validateAsync(admn_id)

    const pc = await AdminService.getAdminsById({ admn_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add Admins Controller
///////////////------------------------------//////////////////////////////
const addAdmins = async (req, res, next) => {
  logger.info("add admins controller => add admins");
  try {
    const { name, email, number, password, address, block, block_reason } = req.body;

    let validateData = await AdminValidations.addAdminValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (number) {
      const numberCountFound = await AdminService.checkAdminByNumber(number)
      if (numberCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: AdminsMessages.NUMBER_ALREADY_EXISTS
        })
      }
    }

    if (email) {
      const emailCountFound = await AdminService.checkAdminsByEmail(email)
      if (emailCountFound != 0) {
        return res.status(409).json({
          status: 0,
          message: AdminsMessages.EMAIL_ALREADY_EXISTS
        })
      }
    }

    const pc = await AdminService.addAdmins({
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
// Update Admins By Id Controller
///////////////------------------------------//////////////////////////////
const updateAdminsById = async (req, res, next) => {
  logger.info("update admins By Id controller => update admins");

  try {
    const admn_id = req.params.id;
    const { name, email, number, password, address, block, block_reason } = req.body;

    await AdminValidations.adminIdValidate.validateAsync(admn_id);

    let validateData = await AdminValidations.updateAdminValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    if (admn_id) {
      const adminExists = await AdminService.checkAdminById(admn_id)
      if (!adminExists) {
        return res.status(404).json({
          status: 0,
          message: AdminsMessages.INVALID_ADMIN_ID
        })
      }
    }

    if (number) {
      const numberCountFound = await AdminService.checkAdminByNumber(number, admn_id)
      if (numberCountFound != admn_id && numberCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: AdminsMessages.NUMBER_ALREADY_EXISTS
        })
      }
    }

    if (email) {
      const emailCountFound = await AdminService.checkAdminsByEmail(email, admn_id)
      if (emailCountFound != admn_id && emailCountFound > 0) {
        return res.status(409).json({
          status: 0,
          message: AdminsMessages.EMAIL_ALREADY_EXISTS
        })
      }
    }

    const pc = await AdminService.updateAdminsById({
      admn_id,
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
// Update Admins Block Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateAdminsBlockStatusById = async (req, res, next) => {
  logger.info("update admins block status by id controller => update admins block status");
  try {
    const admn_id = req.params.id;
    const adminsBlockStatus = req.params.status;
    console.log(admn_id, adminsBlockStatus);

    await AdminValidations.adminIdValidate.validateAsync(admn_id);
    await AdminValidations.adminStatusBooleanValidate.validateAsync(adminsBlockStatus);

    const statusBoolean = adminsBlockStatus === "true" ? 1 : 0;

    const pc = await AdminService.updateAdminsBlockStatusById({ admn_id, statusBoolean });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "Invalid Url Parameter"});
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Delete Admin By Id Controller
///////////////------------------------------//////////////////////////////
const deleteAdmins = async (req, res, next) => {
  logger.info("delete admins by Id controller => delete admins");

  try {
    const admn_id = req.params.id;

    await AdminValidations.adminIdValidate.validateAsync(admn_id);

    const pc = await AdminService.deleteAdminsById({ admn_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Login Admins Controller
///////////////------------------------------//////////////////////////////
const loginAdmins = async (req, res, next) => {
  logger.info("login admins controller => login admins")

  try {
    const { number, password } = req.body

    let validateData = await AdminValidations.loginAdminValidation.validate(req.body)
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message })
    }

    const pc = await AdminService.loginAdmins({ number, password })
    console.log('login user controller', pc)

    const expiryTime = process.env.JWT_EXPIRY || '2m'

    if (pc.status === 1) {
      const user = pc.data
      const token = jwt.sign({ admn_id: user.id }, JWT_SECRET, {
        expiresIn: expiryTime ? expiryTime : '2m'
      })
      res.status(200).json({
        token: token,
        user_id: user.id,
        message: AdminsMessages.ADMIN_LOGIN_SUCCESS,
      })
    } else {
      res.status(401).json({ message: AdminsMessages.INVALID_CREDENTIALS })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Invalid Url Parameter" })
    next(error)
  }
}

module.exports = {
  getAllAdmins,
  getAdminsById,
  addAdmins,
  updateAdminsById,
  updateAdminsBlockStatusById,
  deleteAdmins,
  loginAdmins,
};
