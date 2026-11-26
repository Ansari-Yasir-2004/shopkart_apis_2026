// const { error } = require("winston");
const logger = require("../../../Config/logger.config");
const EnquiryService = require("./EnquiryService");
const EnquiryValidations = require("./EnquiryValidations");

/////////////--------------------------------//////////////////////////////
// Get All Enquiries Controller
///////////////------------------------------//////////////////////////////
const getAllEnquiries = async (req, res, next) => {
  logger.info(" get all enquiries controller => list of enquiries");
  try {
    const pc = await EnquiryService.getAllEnquiries();
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Get Enquiries By Id Controller
///////////////------------------------------//////////////////////////////
const getEnquiriesById = async (req, res, next) => {
  logger.info("get enquiries by id controller => enquiries by id");
  try {
    const enq_id = req.params.id;

    await EnquiryValidations.EnquiriesIdValidate.validateAsync(enq_id)

    const pc = await EnquiryService.getEnquiriesById({ enq_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" })
    next(error);
  }
};

/////////////--------------------------------//////////////////////////////
// Add Enquiries SControllerervice
///////////////------------------------------//////////////////////////////
const addEnquiries = async (req, res, next) => {
  logger.info("add enquiries controller => add enquiries");
  try {
    const { name, email, number, description, status } = req.body;

    let validateData = await EnquiryValidations.addEnquiriesValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const finalStatus = status && status !== "" ? status : "PENDING";

    const pc = await EnquiryService.addEnquiries({
      name,
      email,
      number,
      description,
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
// Update Enquiries By Id Controller
///////////////------------------------------//////////////////////////////
const updateEnquiriesById = async (req, res, next) => {
  logger.info("update enquiries by id controller => update enquiries");
  try {
    const enq_id = req.params.id;
    const { name, email, number, description, status } = req.body;

    await EnquiryValidations.EnquiriesIdValidate.validateAsync(enq_id);

    let validateData = await EnquiryValidations.updateEnquiriesValidation.validate(req.body);
    if (validateData && validateData.error) {
      return res.status(422).json({ error: validateData.error.message });
    }

    const finalStatus = status && status !== "" ? status : "PENDING"

    const pc = await EnquiryService.updateEnquiriesById({
      enq_id,
      name,
      email,
      number,
      description,
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
// Update Enquiries Status By Id Controller
///////////////------------------------------//////////////////////////////
const updateEnquiriesStatusById = async (req, res, next) => {
  logger.info("update enquiries status by id => update enquiries status")
  try {
    const enq_id = req.params.id;
    const enquiriesStatus = req.params.status;

    await EnquiryValidations.EnquiriesIdValidate.validateAsync(enq_id);
    await EnquiryValidations.EnquiriesStatusBooleanValidate.validateAsync(enquiriesStatus);

    const status = enquiriesStatus === "true" ? "RESOLVED" : "PENDING";

    const pc = await EnquiryService.updateEnquiriesStatusById({ enq_id, status });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invaid Url Parameter" });
    next(error);
  }
}

/////////////--------------------------------//////////////////////////////
// Delete Enquiries By Id Controller
///////////////------------------------------//////////////////////////////
const deleteEnquiriesById = async (req, res, next) => {
  logger.info("delete enquiries by id controller => delete enquiries");
  try {
    const enq_id = req.params.id;

    await EnquiryValidations.EnquiriesIdValidate.validateAsync(enq_id);

    const pc = await EnquiryService.deleteEnquiriesById({ enq_id });
    res.status(200).json(pc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid Url Parameter" });
    next(error);
  }
};
module.exports = {
  getAllEnquiries,
  getEnquiriesById,
  addEnquiries,
  updateEnquiriesById,
  updateEnquiriesStatusById,
  deleteEnquiriesById,
};
