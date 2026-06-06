const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../utils/errorHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
// exports.register = asyncHandler(async (req, res, next) => {
//   const { name, email, password, role, phone } = req.body;
     
//   // ✅ Provider registration band karo
//   if (role === 'provider') {
//     return next(new AppError('Provider registration allowed nahi hai.', 403));
//   }

//   const exists = await User.findOne({ email });
//   if (exists) return next(new AppError('Email already registered.', 400));

//   const user = await User.create({ name, email, password, role, phone });
//   const token = signToken(user._id);
  // const exists = await User.findOne({ email });
  // if (exists) return next(new AppError('Email already registered.', 400));

  // const user = await User.create({ name, email, password, role, phone });
  // const token = signToken(user._id);

//   res.status(201).json({
//     success: true,
//     message: 'Registration successful',
//     token,
//     user: { id: user._id, name: user.name, email: user.email, role: user.role },
//   });
// });

// exports.register = asyncHandler(async (req, res, next) => {
//   try {
//     console.log("BODY:", req.body);

//     const { name, email, password, role, phone } = req.body;

//     console.log("STEP 1");
//     const exists = await User.findOne({ email });

//     console.log("STEP 2");
//     if (exists) return next(new AppError("Email already registered.", 400));

//     console.log("STEP 3");
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phone,
//     });

//     console.log("STEP 4");

//     const token = signToken(user._id);

//     res.status(201).json({
//       success: true,
//       token,
//     });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     throw err;
//   }
// });




exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  console.log('BODY:', req.body);

  const exists = await User.findOne({ email });
  console.log('EXISTS:', exists);

  if (exists) return next(new AppError('Email already registered.', 400));

  const user = await User.create({
    name,
    email,
    password,
    role: 'customer', // ← hamesha customer
    phone
  });

  res.status(201).json({
    success: true,
    user,
  });

});
// POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Email and password required.', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError('Invalid email or password.', 401));

  const token = signToken(user._id);
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});



// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { AppError, asyncHandler } = require('../utils/errorHandler');

// exports.register = asyncHandler(async (req, res, next) => {
//   try {
//     console.log("BODY:", req.body);

//     const { name, email, password, role, phone } = req.body;

//     console.log("STEP 1");
//     const exists = await User.findOne({ email });

//     console.log("STEP 2");
//     if (exists) return next(new AppError("Email already registered.", 400));

//     console.log("STEP 3");
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phone,
//     });

//     console.log("STEP 4");

//     const token = signToken(user._id);

//     res.status(201).json({
//       success: true,
//       token,
//     });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     throw err;
//   }
// });