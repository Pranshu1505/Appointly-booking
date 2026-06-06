const Slot = require('../models/Slot');
const Service = require('../models/Service');
const { AppError, asyncHandler } = require('../utils/errorHandler');

// GET /api/slots/:serviceId?date=YYYY-MM-DD
exports.getAvailableSlots = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const { date } = req.query;

  const filter = { service: serviceId, isBooked: false };
  if (date) filter.date = date;

  const slots = await Slot.find(filter).sort('date startTime');
  res.json({ success: true, count: slots.length, slots });
});

// POST /api/slots  (provider only)
exports.createSlot = asyncHandler(async (req, res, next) => {
  const { serviceId, date, startTime, endTime } = req.body;

  const service = await Service.findById(serviceId);
  if (!service) return next(new AppError('Service not found.', 404));
  if (!service.provider.equals(req.user._id))
    return next(new AppError('You can only add slots for your services.', 403));

  // Check for duplicate
  const exists = await Slot.findOne({ service: serviceId, date, startTime });
  if (exists) return next(new AppError('Slot already exists for this time.', 400));

  const slot = await Slot.create({
    service: serviceId,
    provider: req.user._id,
    date,
    startTime,
    endTime,
  });

  res.status(201).json({ success: true, slot });
});

// POST /api/slots/bulk  (provider: create multiple slots at once)
exports.createBulkSlots = asyncHandler(async (req, res, next) => {
  const { serviceId, date, slots } = req.body;
  // slots = [{ startTime: "09:00", endTime: "09:30" }, ...]

  const service = await Service.findById(serviceId);
  if (!service) return next(new AppError('Service not found.', 404));
  if (!service.provider.equals(req.user._id))
    return next(new AppError('Not your service.', 403));

  const slotDocs = slots.map((s) => ({
    service: serviceId,
    provider: req.user._id,
    date,
    startTime: s.startTime,
    endTime: s.endTime,
  }));

  const created = await Slot.insertMany(slotDocs, { ordered: false });
  res.status(201).json({ success: true, count: created.length, slots: created });
});

// DELETE /api/slots/:id  (provider only)
exports.deleteSlot = asyncHandler(async (req, res, next) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return next(new AppError('Slot not found.', 404));
  if (!slot.provider.equals(req.user._id))
    return next(new AppError('Not your slot.', 403));
  if (slot.isBooked) return next(new AppError('Cannot delete a booked slot.', 400));

  await slot.deleteOne();
  res.json({ success: true, message: 'Slot deleted.' });
});