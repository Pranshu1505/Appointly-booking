const Service = require('../models/Service');
const { AppError, asyncHandler } = require('../utils/errorHandler');

// GET /api/services
exports.getServices = asyncHandler(async (req, res) => {
  const { category, provider } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (provider) filter.provider = provider;

  const services = await Service.find(filter)
    .populate('provider', 'name email phone')
    .sort('-createdAt');

  res.json({ success: true, count: services.length, services });
});

// POST /api/services
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create({ ...req.body, provider: req.user._id });
  res.status(201).json({ success: true, service });
});

// GET /api/services/:id
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name email phone');
  if (!service) return next(new AppError('Service not found.', 404));
  res.json({ success: true, service });
});

// PUT /api/services/:id
exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));
  if (!service.provider.equals(req.user._id))
    return next(new AppError('You can only update your own services.', 403));

  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, service: updated });
});

// DELETE /api/services/:id
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));
  if (!service.provider.equals(req.user._id))
    return next(new AppError('You can only delete your own services.', 403));

  await service.deleteOne();
  res.json({ success: true, message: 'Service deleted.' });
});

// GET /api/services/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Service.distinct('category', { isActive: true });
  res.json({ success: true, categories });
});