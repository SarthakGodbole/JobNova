import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sendNotificationEmail } from '../utils/emailNotifications.js';

const getWelcomeEmailTemplate = (user) => `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
    <h2 style="color: #3b82f6;">Welcome to JobNova!</h2>
    <p style="font-size: 16px;">Hello ${user.name},</p>
    <p>Your account has been successfully created. You can now track your job applications, organize interviews, and manage deadlines securely.</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 15px;">
      <p style="margin: 8px 0;"><strong>Role:</strong> ${user.role === 'admin' ? 'Operator (Admin)' : 'Student / Candidate'}</p>
    </div>
    <p style="margin-top: 24px; font-size: 14px;">Best of luck with your job search!</p>
    <p style="margin-top: 8px; font-size: 12px; color: #94a3b8;">The JobNova Team</p>
  </div>
`;
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'student',
    });

    const token = generateToken(user._id, user.role);

    // Send welcome notification
    sendNotificationEmail(
      user.email,
      'Welcome to JobNova!',
      getWelcomeEmailTemplate(user)
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
