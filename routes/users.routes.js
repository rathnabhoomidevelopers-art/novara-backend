const express = require("express");
const router  = express.Router();
const { list, create, update, remove } = require("../controllers/users.controller");

router.get("/",       list);
router.post("/",      create);
router.put("/:id",    update);
router.delete("/:id", remove);

module.exports = router;