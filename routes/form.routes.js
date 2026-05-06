const express = require("express");
const router = express.Router();
const {
  submitContact,
  submitInquiry,
  submitPopup,
  submitBlog,
  submitBrochure,
} = require("../controllers/form.controller");

router.post("/contact",  submitContact);
router.post("/inquiry",  submitInquiry);
router.post("/pop-up",   submitPopup);
router.post("/blogs",    submitBlog);
router.post("/brochure", submitBrochure);

module.exports = router;