const router = require('express').Router();
const {
  getServices, createService, getService,
  updateService, deleteService, getCategories,
} = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, restrictTo('provider'), createService);
router.put('/:id', protect, restrictTo('provider'), updateService);
router.delete('/:id', protect, restrictTo('provider'), deleteService);

module.exports = router;