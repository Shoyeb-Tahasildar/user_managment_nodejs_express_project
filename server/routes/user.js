const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//create, find,update,delete
router.get("/", userController.view);
router.post("/", userController.find);

router.get("/adduser", userController.form);
router.post("/adduser", userController.create);
router.get("/edituser/:id", userController.edituser);
router.post("/edituser/:id", userController.update);

router.get('/view-user/:id',userController.viewuser);

router.get("/:id", userController.delete);

module.exports = router;
