const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.post('/', noteController.create);

router.get('/', noteController.findAll);
router.get('/find', noteController.find);

router.put('/', noteController.update);
router.put('/addPage', noteController.addPage);
router.put('/removePage', noteController.removePage);

router.delete('/', noteController.delete);

module.exports = router;