const router = require("express").Router();
const userController = require('../controllers/userController');

router.get("/", userController.findAll);
router.get("/findOne", userController.findOne);
router.get("/find", userController.find);

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/adminlogin", userController.adminlogin);

router.put("/", userController.update);
router.put('/upic', userController.updatePic);
router.put("/password", userController.changePassword);
router.put("/addClass", userController.addClass);
router.put("/removeClass", userController.removeClass);

router.put("/addCourse", userController.addCourse);
router.put("/removeCourse", userController.removeCourse);

router.put("/addBook", userController.addBook);
router.put("/removeBook", userController.removeBook);

router.delete("/", userController.delete);

module.exports = router;