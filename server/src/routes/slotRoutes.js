const router = require('express').Router();
const { getAvailableSlots, createSlot, createBulkSlots, deleteSlot } = require('../controllers/slotController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/:serviceId', getAvailableSlots);
router.post('/', protect, restrictTo('provider'), createSlot);
router.post('/bulk', protect, restrictTo('provider'), createBulkSlots);
router.delete('/:id', protect, restrictTo('provider'), deleteSlot);

module.exports = router;