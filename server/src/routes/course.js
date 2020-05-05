const router = require('express').Router();
const courseController = require('../controllers/courseController');

router.post('/createCourse', courseController.createCourse);
router.get('/', courseController.findAll);
router.get('/find', courseController.find);
router.get('/findOne', courseController.findOne);
router.get('/findByClass', courseController.findByClass);

router.put('/join', courseController.requestJoin);
router.put('/addUser', courseController.addUser);
router.put('/removeUser', courseController.removeUser);
router.put('/rejectUser', courseController.rejectUser);

router.put('/addClass', courseController.addClass);
router.put('/removeClass', courseController.removeClass);

router.put('/addBook', courseController.addBook);
router.put('/removeBook', courseController.removeBook);
router.put('/removeManyBook', courseController.removeManyBook);

router.delete('/', courseController.delete);

module.exports = router;