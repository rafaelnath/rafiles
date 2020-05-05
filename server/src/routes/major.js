const router = require('express').Router();
const majorController = require('../controllers/majorController');

router.post('/', majorController.create)

router.get('/', majorController.findAll);
router.get('/find', majorController.find);
router.get('/findOne', majorController.findOne);

router.put('/', majorController.update);
router.put('/addClass', majorController.addClass);
router.put('/removeClass', majorController.removeClass);

router.delete('/', majorController.delete);

module.exports = router;