const router = require('express').Router();
const classController = require('../controllers/classController');

router.post('/', classController.createClass);

router.get('/', classController.findAll);
router.get('/find', classController.find);
router.get('/findOne', classController.findOne);

router.put('/', classController.update);
router.put('/join', classController.requestJoin);

router.put('/addUser', classController.addUser);
router.put('/removeUser', classController.removeUser);
router.put('/rejectUser', classController.rejectUser);

router.put('/setMonitor', classController.setMonitor);

router.put('/addCourse', classController.addCourse);
router.put('/removeCourse', classController.removeCourse);

router.put('/pushMajorName', classController.pushMajorName);

router.delete('/', classController.delete);

module.exports = router;