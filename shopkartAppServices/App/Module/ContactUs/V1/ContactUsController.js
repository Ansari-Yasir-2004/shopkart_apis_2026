const logger = require("../../../Config/logger.config");
const ContactUsService = require("./ContactUsService");
const ContactUsValidations = require("./ContactUsValidations");

/////////////--------------------------------//////////////////////////////
// Get All Contact Us Controller
///////////////------------------------------//////////////////////////////
const getAllContactUs = async (req, res, next) => {
  logger.info("get all contact us controller => list of contact us");
  try {
    const pc = await ContactUsService.getAllContactUs();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Contact Us By Id Controller
///////////////------------------------------//////////////////////////////
const getContactUsById = async (req, res, next) => {
  logger.info("get all contact us by id controller => contact us by id");
  try {
    const con_us_id = req.params.id;

    await ContactUsValidations.contactUsIdValidate.validateAsync(con_us_id)

    const pc = await ContactUsService.getContactUsById({ con_us_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add Contact Us Controller
///////////////------------------------------//////////////////////////////
const addContactUs = async (req, res, next) => {
  logger.info("add contact us controller => add contact us");
  try {
    const { name, email, number, message, status } = req.body;

    let validateData = await ContactUsValidations.addContactUsValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const finalStatus = status && status !== "" ? status : "UNSEEN";

    const pc = await ContactUsService.addContactUs({
      name,
      email,
      number,
      message,
      status: finalStatus,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" })
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Contact Us By Id Service
///////////////------------------------------//////////////////////////////
const updateContactUsById = async (req, res, next) => {
  logger.info("update contact us by id controller => update contact us");
  try {
    const con_us_id = req.params.id;
    const { name, email, number, message, status } = req.body;

    await ContactUsValidations.contactUsIdValidate.validateAsync(con_us_id);

    let validateData = await ContactUsValidations.updateContactUsValidation.validate(
      req.body,
    );
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const finalStatus = status && status !== "" ? status : "UNSEEN"

    const pc = await ContactUsService.updateContactUsById({
      con_us_id,
      name,
      email,
      number,
      message,
      status: finalStatus,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Update Contact Us Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateContactUsStatusById = async (req, res, next) => {
  logger.info("update contact us status by id => update contact us status")
  try {
    const con_us_id = req.params.id;
    const contactUsStatus = req.params.status;

    await ContactUsValidations.contactUsIdValidate.validateAsync(con_us_id);
    await ContactUsValidations.contactUsStatusBooleanValidate.validateAsync(contactUsStatus);

    const status = contactUsStatus === "true" ? "SEEN" : "UNSEEN";

    const pc = await ContactUsService.updateContactUsStatusById({ con_us_id, status });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Delete Contact Us By Id Controller
///////////////------------------------------//////////////////////////////
const deleteContactUsById = async (req, res, next) => {
  logger.info("delete contact us by id controller => delete contact us");
  try {
    const con_us_id = req.params.id;

    await ContactUsValidations.contactUsIdValidate.validateAsync(con_us_id);

    const pc = await ContactUsService.deleteContactUsById({
      con_us_id,
    });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};

module.exports = {
  getAllContactUs,
  getContactUsById,
  addContactUs,
  updateContactUsById,
  updateContactUsStatusById,
  deleteContactUsById,
};
