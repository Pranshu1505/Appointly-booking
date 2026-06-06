const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const { AppError, asyncHandler } = require('../utils/errorHandler');

// POST /api/bookings  (customer)
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { slotId, notes } = req.body;

  const slot = await Slot.findById(slotId).populate('service');
  if (!slot) return next(new AppError('Slot not found.', 404));
  if (slot.isBooked) return next(new AppError('Slot already booked.', 400));

  // Mark slot as booked
  slot.isBooked = true;
  await slot.save();

  const booking = await Booking.create({
    customer: req.user._id,
    provider: slot.provider,
    service: slot.service._id,
    slot: slot._id,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    notes,
  });

  await booking.populate([
    { path: 'service', select: 'name duration price' },
    { path: 'provider', select: 'name email phone' },
  ]);

  res.status(201).json({ success: true, booking });
});

// GET /api/bookings/my  (customer: my bookings)
exports.getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { customer: req.user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('service', 'name category price duration')
    .populate('provider', 'name email phone')
    .sort('-createdAt');

  res.json({ success: true, count: bookings.length, bookings });
});

// GET /api/bookings/provider  (provider: all bookings for me)
exports.getProviderBookings = asyncHandler(async (req, res) => {
  const { status, date } = req.query;
  const filter = { provider: req.user._id };
  if (status) filter.status = status;
  if (date) filter.date = date;

  const bookings = await Booking.find(filter)
    .populate('service', 'name price duration')
    .populate('customer', 'name email phone')
    .sort('date startTime');

  res.json({ success: true, count: bookings.length, bookings });
});

// GET /api/bookings/:id
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service', 'name category price duration')
    .populate('provider', 'name email phone')
    .populate('customer', 'name email phone');

  if (!booking) return next(new AppError('Booking not found.', 404));

  const isOwner =
    booking.customer._id.equals(req.user._id) ||
    booking.provider._id.equals(req.user._id);
  if (!isOwner) return next(new AppError('Access denied.', 403));

  res.json({ success: true, booking });
});

// PUT /api/bookings/:id/status  (provider: confirm/complete | customer/provider: cancel)
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) return next(new AppError('Booking not found.', 404));

  const isProvider = booking.provider.equals(req.user._id);
  const isCustomer = booking.customer.equals(req.user._id);

  if (!isProvider && !isCustomer) return next(new AppError('Access denied.', 403));

  // Customers can only cancel
  if (isCustomer && !isProvider && status !== 'cancelled')
    return next(new AppError('Customers can only cancel bookings.', 403));

  // If cancelling, free up the slot
  if (status === 'cancelled') {
    await Slot.findByIdAndUpdate(booking.slot, { isBooked: false });
  }

  booking.status = status;
  await booking.save();

  res.json({ success: true, booking });
});

// GET /api/bookings/stats  (provider dashboard stats)
exports.getStats = asyncHandler(async (req, res) => {
  const providerId = req.user._id;

  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    Booking.countDocuments({ provider: providerId }),
    Booking.countDocuments({ provider: providerId, status: 'pending' }),
    Booking.countDocuments({ provider: providerId, status: 'confirmed' }),
    Booking.countDocuments({ provider: providerId, status: 'completed' }),
    Booking.countDocuments({ provider: providerId, status: 'cancelled' }),
  ]);

  res.json({ success: true, stats: { total, pending, confirmed, completed, cancelled } });
});