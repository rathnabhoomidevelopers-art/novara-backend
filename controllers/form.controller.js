const Contact = require("../models/contact.model");
const Inquiry = require("../models/inquiry.model");
const Popup   = require("../models/popup.model");
const Blog    = require("../models/blog.model");

const SUCCESS_MSG = "Thank You, Our team will reach you soon!.";
const ERROR_MSG   = "Something went wrong. Please try again later.";

exports.submitContact = async (req, res) => {
  try {
    const doc = new Contact({
      firstName:       req.body.firstName,
      lastName:        req.body.lastName,
      email:           req.body.email,
      phone:           req.body.phone,
      inquiry_project: req.body.inquiry_project,
      know_us:         req.body.know_us,
      message:         req.body.message,
      agreeToTerms:    req.body.agreeToTerms,
    });
    await doc.save();
    res.send(SUCCESS_MSG);
  } catch (err) {
    console.error("DB ERROR [contact]:", err);
    res.status(500).send(ERROR_MSG);
  }
};

exports.submitInquiry = async (req, res) => {
  try {
    const doc = new Inquiry({
      firstName:    req.body.firstName,
      lastName:     req.body.lastName,
      email:        req.body.email,
      phone:        req.body.phone,
      message:      req.body.message,
      agreeToTerms: req.body.agreeToTerms,
    });
    await doc.save();
    res.send(SUCCESS_MSG);
  } catch (err) {
    console.error("DB ERROR [inquiry]:", err);
    res.status(500).send(ERROR_MSG);
  }
};

exports.submitPopup = async (req, res) => {
  try {
    const doc = new Popup({
      firstName: req.body.firstName,
      lastName:  req.body.lastName,
      mobile:    req.body.mobile,
      email:     req.body.email,
      message:   req.body.message,
    });
    await doc.save();
    res.send(SUCCESS_MSG);
  } catch (err) {
    console.error("DB ERROR [pop-up]:", err);
    res.status(500).send(ERROR_MSG);
  }
};

exports.submitBlog = async (req, res) => {
  try {
    const doc = new Blog({
      name:         req.body.name,
      email:        req.body.email,
      phone:        req.body.phone,
      agreeToTerms: req.body.agreeToTerms,
    });
    await doc.save();
    res.send(SUCCESS_MSG);
  } catch (err) {
    console.error("DB ERROR [blogs]:", err);
    res.status(500).send(ERROR_MSG);
  }
};