const router = require('express').Router();
const bookController = require('../controllers/bookController');


router.post('/upload', bookController.upload);
router.post('/create', bookController.create);

router.get('/', bookController.findAll);
router.get('/findOne', bookController.findOne);
router.get('/find', bookController.find);
router.get('/download', bookController.download)

router.put('/', bookController.update);
router.put('/addCourse', bookController.addCourse);
router.put('/removeCourse', bookController.removeCourse);

router.delete('/', bookController.deletebook);
router.delete('/file', bookController.deleteBookFile);

module.exports = router;