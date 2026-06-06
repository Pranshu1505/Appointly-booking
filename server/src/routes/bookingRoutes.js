const router = require('express').Router();
const {
  createBooking, getMyBookings, getProviderBookings,
  getBooking, updateBookingStatus, getStats,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);

router.post('/', restrictTo('customer'), createBooking);
router.get('/my', restrictTo('customer'), getMyBookings);
router.get('/provider', restrictTo('provider'), getProviderBookings);
router.get('/stats', restrictTo('provider'), getStats);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus);

module.exports = router;